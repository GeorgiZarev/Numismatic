CREATE OR REPLACE FUNCTION place_order_with_stock(p_user_id UUID, p_order JSONB, p_items JSONB)
RETURNS UUID LANGUAGE plpgsql AS $$
DECLARE
  requested RECORD;
  product RECORD;
  new_order_id UUID;
  order_total NUMERIC(10,2) := 0;
  size_available INTEGER;
  reserved INTEGER;
BEGIN
  IF jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain products' USING ERRCODE = 'P0001';
  END IF;

  -- Placing an order only reserves boxes; real stock is deducted when the admin approves it.
  -- Locking each product row serializes concurrent orders, so reservations cannot oversell.
  FOR requested IN
    SELECT coin_id, size_mm, SUM(quantity)::INTEGER AS quantity
    FROM jsonb_to_recordset(p_items) AS item(coin_id UUID, quantity INTEGER, size_mm NUMERIC)
    GROUP BY coin_id, size_mm ORDER BY coin_id, size_mm
  LOOP
    IF requested.quantity IS NULL OR requested.quantity < 1 THEN
      RAISE EXCEPTION 'Invalid product quantity' USING ERRCODE = 'P0001';
    END IF;
    SELECT id, name, price, photo_url, status, stock_quantity, size_stock, product_type, consumable_category INTO product
    FROM coins WHERE id = requested.coin_id FOR UPDATE;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Insufficient stock for product %', requested.coin_id USING ERRCODE = 'P0001';
    END IF;
    SELECT COALESCE(SUM(quantity), 0)::INTEGER INTO reserved
    FROM pending_stock_reservations WHERE coin_id = requested.coin_id;
    IF product.status <> 'active' OR product.stock_quantity - reserved < requested.quantity THEN
      RAISE EXCEPTION 'Insufficient stock for product %', requested.coin_id USING ERRCODE = 'P0001';
    END IF;
    IF product.product_type = 'consumable' AND product.consumable_category IN ('capsules', 'cardboard_holders') THEN
      IF jsonb_array_length(product.size_stock) = 0 THEN
        RAISE EXCEPTION 'Sizes are not configured for product %', requested.coin_id USING ERRCODE = 'P0001';
      END IF;
      IF requested.size_mm IS NULL THEN
        RAISE EXCEPTION 'Choose a size for product %', requested.coin_id USING ERRCODE = 'P0001';
      END IF;
      SELECT (entry->>'stock_quantity')::INTEGER INTO size_available
      FROM jsonb_array_elements(product.size_stock) AS size(entry)
      WHERE (entry->>'size_mm')::NUMERIC = requested.size_mm;
      SELECT COALESCE(SUM(quantity), 0)::INTEGER INTO reserved
      FROM pending_stock_reservations WHERE coin_id = requested.coin_id AND size_mm = requested.size_mm;
      IF size_available IS NULL OR size_available - reserved < requested.quantity THEN
        RAISE EXCEPTION 'Insufficient stock for product % size % mm', requested.coin_id, requested.size_mm USING ERRCODE = 'P0001';
      END IF;
    ELSIF requested.size_mm IS NOT NULL THEN
      RAISE EXCEPTION 'Product % has no sizes', requested.coin_id USING ERRCODE = 'P0001';
    END IF;
    order_total := order_total + product.price * requested.quantity;
  END LOOP;

  INSERT INTO orders (
    user_id, customer_name, phone, email, city, address, postal_code,
    address_line_2, country, delivery_notes, payment_method, total, stock_committed
  ) VALUES (
    p_user_id, p_order->>'customer_name', p_order->>'phone', p_order->>'email',
    p_order->>'city', p_order->>'address', p_order->>'postal_code',
    p_order->>'address_line_2', p_order->>'country', p_order->>'delivery_notes',
    p_order->>'payment_method', order_total, FALSE
  ) RETURNING id INTO new_order_id;

  FOR requested IN
    SELECT coin_id, size_mm, SUM(quantity)::INTEGER AS quantity
    FROM jsonb_to_recordset(p_items) AS item(coin_id UUID, quantity INTEGER, size_mm NUMERIC)
    GROUP BY coin_id, size_mm ORDER BY coin_id, size_mm
  LOOP
    SELECT id, name, price, photo_url INTO product FROM coins WHERE id = requested.coin_id;
    INSERT INTO order_items (order_id, coin_id, coin_name, photo_url, price, quantity, size_mm)
    VALUES (new_order_id, product.id, product.name, product.photo_url, product.price, requested.quantity, requested.size_mm);
  END LOOP;

  RETURN new_order_id;
END;
$$;
