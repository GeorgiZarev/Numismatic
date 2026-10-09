CREATE OR REPLACE FUNCTION place_order_with_stock(p_user_id UUID, p_order JSONB, p_items JSONB)
RETURNS UUID LANGUAGE plpgsql AS $$
DECLARE
  requested RECORD;
  product RECORD;
  new_order_id UUID;
  order_total NUMERIC(10,2) := 0;
BEGIN
  IF jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain products' USING ERRCODE = 'P0001';
  END IF;

  FOR requested IN
    SELECT coin_id, SUM(quantity)::INTEGER AS quantity
    FROM jsonb_to_recordset(p_items) AS item(coin_id UUID, quantity INTEGER)
    GROUP BY coin_id ORDER BY coin_id
  LOOP
    IF requested.quantity IS NULL OR requested.quantity < 1 THEN
      RAISE EXCEPTION 'Invalid product quantity' USING ERRCODE = 'P0001';
    END IF;
    SELECT id, name, price, photo_url, status, stock_quantity INTO product
    FROM coins WHERE id = requested.coin_id FOR UPDATE;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Insufficient stock for product %', requested.coin_id USING ERRCODE = 'P0001';
    END IF;
    IF product.status <> 'active' OR product.stock_quantity < requested.quantity THEN
      RAISE EXCEPTION 'Insufficient stock for product %', requested.coin_id USING ERRCODE = 'P0001';
    END IF;
    order_total := order_total + product.price * requested.quantity;
  END LOOP;

  INSERT INTO orders (
    user_id, customer_name, phone, email, city, address, postal_code,
    address_line_2, country, delivery_notes, payment_method, total
  ) VALUES (
    p_user_id, p_order->>'customer_name', p_order->>'phone', p_order->>'email',
    p_order->>'city', p_order->>'address', p_order->>'postal_code',
    p_order->>'address_line_2', p_order->>'country', p_order->>'delivery_notes',
    p_order->>'payment_method', order_total
  ) RETURNING id INTO new_order_id;

  FOR requested IN
    SELECT coin_id, SUM(quantity)::INTEGER AS quantity
    FROM jsonb_to_recordset(p_items) AS item(coin_id UUID, quantity INTEGER)
    GROUP BY coin_id ORDER BY coin_id
  LOOP
    SELECT id, name, price, photo_url INTO product FROM coins WHERE id = requested.coin_id;
    UPDATE coins SET stock_quantity = stock_quantity - requested.quantity
    WHERE id = requested.coin_id;
    INSERT INTO order_items (order_id, coin_id, coin_name, photo_url, price, quantity)
    VALUES (new_order_id, product.id, product.name, product.photo_url, product.price, requested.quantity);
  END LOOP;

  RETURN new_order_id;
END;
$$;
