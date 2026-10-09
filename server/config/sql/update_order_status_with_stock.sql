CREATE OR REPLACE FUNCTION update_order_status_with_stock(p_order_id UUID, p_new_status TEXT)
RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE
  previous_status TEXT;
  item RECORD;
  previous_rank INTEGER;
  next_rank INTEGER;
BEGIN
  SELECT status INTO previous_status FROM orders WHERE id = p_order_id FOR UPDATE;
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
    UPDATE orders SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = p_order_id;
    FOR item IN
      SELECT coin_id, SUM(quantity)::INTEGER AS quantity
      FROM order_items WHERE order_id = p_order_id AND coin_id IS NOT NULL
      GROUP BY coin_id ORDER BY coin_id
    LOOP
      UPDATE coins SET stock_quantity = stock_quantity + item.quantity,
        expected_delivery_date = NULL WHERE id = item.coin_id;
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
  UPDATE orders SET status = p_new_status, updated_at = CURRENT_TIMESTAMP WHERE id = p_order_id;
END;
$$;
