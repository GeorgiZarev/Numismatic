-- Admins may move an order to any status. Stock follows three states:
--   reserved = new/pending order that has not taken stock (shoppers see less, real stock unchanged)
--   taken    = approved order (confirmed/packed/sent/completed) or an older order that already took stock
--   none     = cancelled
-- Every change is checked and applied per product and per size inside one transaction,
-- with the product rows locked, so stock can never go negative or be double counted.
CREATE OR REPLACE FUNCTION update_order_status_with_stock(p_order_id UUID, p_new_status TEXT)
RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE
  previous_status TEXT;
  order_committed BOOLEAN;
  from_state TEXT;
  to_state TEXT;
  item RECORD;
  product RECORD;
  size_index INTEGER;
  size_quantity INTEGER;
  reserved_total INTEGER;
  reserved_size INTEGER;
  own_reserved INTEGER;
BEGIN
  SELECT status, stock_committed INTO previous_status, order_committed FROM orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found' USING ERRCODE = 'P0001';
  END IF;

  to_state := CASE
    WHEN p_new_status IN ('new', 'pending') THEN 'reserved'
    WHEN p_new_status IN ('confirmed', 'packed', 'sent', 'completed') THEN 'taken'
    WHEN p_new_status IN ('cancelled', 'canceled') THEN 'none'
  END;
  IF to_state IS NULL THEN
    RAISE EXCEPTION 'Unknown order status %', p_new_status USING ERRCODE = 'P0001';
  END IF;
  from_state := CASE
    WHEN previous_status IN ('cancelled', 'canceled') THEN 'none'
    WHEN order_committed OR previous_status IN ('confirmed', 'packed', 'sent', 'completed') THEN 'taken'
    ELSE 'reserved'
  END;

  IF from_state <> to_state THEN
    FOR item IN
      SELECT coin_id, size_mm, SUM(quantity)::INTEGER AS quantity
      FROM order_items WHERE order_id = p_order_id AND coin_id IS NOT NULL
      GROUP BY coin_id, size_mm ORDER BY coin_id, size_mm
    LOOP
      SELECT id, stock_quantity, size_stock INTO product FROM coins WHERE id = item.coin_id FOR UPDATE;
      IF NOT FOUND THEN CONTINUE; END IF;

      size_index := NULL;
      size_quantity := NULL;
      IF item.size_mm IS NOT NULL THEN
        SELECT ordinality::INTEGER - 1, (entry->>'stock_quantity')::INTEGER INTO size_index, size_quantity
        FROM jsonb_array_elements(product.size_stock) WITH ORDINALITY AS size(entry, ordinality)
        WHERE (entry->>'size_mm')::NUMERIC = item.size_mm;
        IF size_index IS NULL THEN
          RAISE EXCEPTION 'Size % mm no longer exists for product %, so this status change is not possible', item.size_mm, item.coin_id USING ERRCODE = 'P0001';
        END IF;
      END IF;

      IF to_state IN ('taken', 'reserved') AND from_state <> 'taken' THEN
        -- Boxes must be free: real stock minus what other pending orders hold.
        own_reserved := CASE WHEN from_state = 'reserved' THEN item.quantity ELSE 0 END;
        SELECT COALESCE(SUM(quantity), 0)::INTEGER INTO reserved_total
        FROM pending_stock_reservations WHERE coin_id = item.coin_id;
        IF product.stock_quantity - (reserved_total - own_reserved) < item.quantity THEN
          RAISE EXCEPTION 'Not enough stock for product % (needs %, free %)', item.coin_id, item.quantity, product.stock_quantity - (reserved_total - own_reserved) USING ERRCODE = 'P0001';
        END IF;
        IF item.size_mm IS NOT NULL THEN
          SELECT COALESCE(SUM(quantity), 0)::INTEGER INTO reserved_size
          FROM pending_stock_reservations WHERE coin_id = item.coin_id AND size_mm = item.size_mm;
          IF size_quantity - (reserved_size - own_reserved) < item.quantity THEN
            RAISE EXCEPTION 'Not enough stock for product % size % mm (needs %, free %)', item.coin_id, item.size_mm, item.quantity, size_quantity - (reserved_size - own_reserved) USING ERRCODE = 'P0001';
          END IF;
        END IF;
      END IF;

      IF to_state = 'taken' THEN
        -- reserved/none -> taken: take the boxes out of real stock.
        UPDATE coins SET
          stock_quantity = stock_quantity - item.quantity,
          size_stock = CASE WHEN size_index IS NULL THEN size_stock
            ELSE jsonb_set(size_stock, ARRAY[size_index::TEXT, 'stock_quantity'], to_jsonb(size_quantity - item.quantity)) END
        WHERE id = item.coin_id;
      ELSIF from_state = 'taken' THEN
        -- taken -> reserved/none: put the boxes back into real stock.
        UPDATE coins SET
          stock_quantity = stock_quantity + item.quantity,
          size_stock = CASE WHEN size_index IS NULL THEN size_stock
            ELSE jsonb_set(size_stock, ARRAY[size_index::TEXT, 'stock_quantity'], to_jsonb(size_quantity + item.quantity)) END,
          expected_delivery_date = NULL
        WHERE id = item.coin_id;
      END IF;
      -- reserved <-> none only changes the reservation, which follows the order's status.
    END LOOP;
  END IF;

  UPDATE orders SET
    status = CASE WHEN p_new_status = 'canceled' THEN 'cancelled' ELSE p_new_status END,
    stock_committed = (to_state = 'taken'),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = p_order_id;
END;
$$;
