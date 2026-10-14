CREATE OR REPLACE FUNCTION update_order_status_with_stock(p_order_id UUID, p_new_status TEXT)
RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE
  previous_status TEXT;
  order_committed BOOLEAN;
  item RECORD;
  previous_rank INTEGER;
  next_rank INTEGER;
  size_index INTEGER;
  current_sizes JSONB;
  current_quantity INTEGER;
  size_quantity INTEGER;
BEGIN
  SELECT status, stock_committed INTO previous_status, order_committed FROM orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found' USING ERRCODE = 'P0001';
  END IF;

  IF previous_status IN ('cancelled', 'canceled') THEN
    IF p_new_status = 'cancelled' THEN RETURN; END IF;
    RAISE EXCEPTION 'Cancelled orders cannot be reopened' USING ERRCODE = 'P0001';
  END IF;

  IF p_new_status = 'cancelled' THEN
    IF previous_status IN ('sent', 'completed') THEN
      RAISE EXCEPTION 'Dispatched orders cannot be cancelled' USING ERRCODE = 'P0001';
    END IF;
    UPDATE orders SET status = 'cancelled', stock_committed = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = p_order_id;
    -- An unapproved order only held a reservation, which the status change releases.
    IF NOT order_committed THEN RETURN; END IF;
    FOR item IN
      SELECT coin_id, size_mm, SUM(quantity)::INTEGER AS quantity
      FROM order_items WHERE order_id = p_order_id AND coin_id IS NOT NULL
      GROUP BY coin_id, size_mm ORDER BY coin_id, size_mm
    LOOP
      IF item.size_mm IS NOT NULL THEN
        SELECT size_stock INTO current_sizes FROM coins WHERE id = item.coin_id FOR UPDATE;
        SELECT ordinality::INTEGER - 1 INTO size_index
        FROM jsonb_array_elements(current_sizes) WITH ORDINALITY AS size(entry, ordinality)
        WHERE (entry->>'size_mm')::NUMERIC = item.size_mm;
        IF size_index IS NULL THEN
          RAISE EXCEPTION 'Cannot restore removed size % mm for product %', item.size_mm, item.coin_id USING ERRCODE = 'P0001';
        END IF;
        UPDATE coins SET
          size_stock = jsonb_set(size_stock, ARRAY[size_index::TEXT, 'stock_quantity'], to_jsonb((size_stock->size_index->>'stock_quantity')::INTEGER + item.quantity)),
          stock_quantity = stock_quantity + item.quantity,
          expected_delivery_date = NULL WHERE id = item.coin_id;
      ELSE
        UPDATE coins SET stock_quantity = stock_quantity + item.quantity,
          expected_delivery_date = NULL WHERE id = item.coin_id;
      END IF;
    END LOOP;
    RETURN;
  END IF;

  previous_rank := CASE previous_status
    WHEN 'new' THEN 0 WHEN 'pending' THEN 0 WHEN 'confirmed' THEN 1
    WHEN 'packed' THEN 2 WHEN 'sent' THEN 3 WHEN 'completed' THEN 4 END;
  next_rank := CASE p_new_status
    WHEN 'new' THEN 0 WHEN 'confirmed' THEN 1 WHEN 'packed' THEN 2
    WHEN 'sent' THEN 3 WHEN 'completed' THEN 4 END;
  IF next_rank IS NULL OR next_rank < previous_rank THEN
    RAISE EXCEPTION 'Order status cannot move backwards' USING ERRCODE = 'P0001';
  END IF;

  -- Approval takes the reserved boxes out of real stock.
  IF next_rank >= 1 AND NOT order_committed THEN
    FOR item IN
      SELECT coin_id, size_mm, SUM(quantity)::INTEGER AS quantity
      FROM order_items WHERE order_id = p_order_id AND coin_id IS NOT NULL
      GROUP BY coin_id, size_mm ORDER BY coin_id, size_mm
    LOOP
      SELECT stock_quantity, size_stock INTO current_quantity, current_sizes FROM coins WHERE id = item.coin_id FOR UPDATE;
      IF NOT FOUND OR current_quantity < item.quantity THEN
        RAISE EXCEPTION 'Not enough stock to approve this order for product %', item.coin_id USING ERRCODE = 'P0001';
      END IF;
      IF item.size_mm IS NOT NULL THEN
        size_index := NULL;
        SELECT ordinality::INTEGER - 1, (entry->>'stock_quantity')::INTEGER INTO size_index, size_quantity
        FROM jsonb_array_elements(current_sizes) WITH ORDINALITY AS size(entry, ordinality)
        WHERE (entry->>'size_mm')::NUMERIC = item.size_mm;
        IF size_index IS NULL OR size_quantity < item.quantity THEN
          RAISE EXCEPTION 'Not enough stock to approve this order for product % size % mm', item.coin_id, item.size_mm USING ERRCODE = 'P0001';
        END IF;
        UPDATE coins SET
          size_stock = jsonb_set(size_stock, ARRAY[size_index::TEXT, 'stock_quantity'], to_jsonb(size_quantity - item.quantity)),
          stock_quantity = stock_quantity - item.quantity
        WHERE id = item.coin_id;
      ELSE
        UPDATE coins SET stock_quantity = stock_quantity - item.quantity WHERE id = item.coin_id;
      END IF;
    END LOOP;
    UPDATE orders SET status = p_new_status, stock_committed = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = p_order_id;
    RETURN;
  END IF;

  UPDATE orders SET status = p_new_status, updated_at = CURRENT_TIMESTAMP WHERE id = p_order_id;
END;
$$;
