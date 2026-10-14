-- One-time fix approved by Georgi on 2026-10-10 for the switch to "reserve on order, deduct on approval".
-- Order 0ca901c0… was placed under the old flow, which already took 6 boxes of 14 mm Capsules Lindern
-- out of real stock. Put them back and mark the order as an unapproved reservation.
-- Idempotent: once the order is flagged stock_committed = FALSE it does nothing.
DO $$
DECLARE
  target_order CONSTANT UUID := '0ca901c0-3668-4d49-aa04-bd4c358feab2';
  target_coin CONSTANT UUID := '79303f9c-d013-42e6-a1ea-50870288ad85';
  order_status TEXT;
  order_committed BOOLEAN;
  item_count INTEGER;
  size_index INTEGER;
BEGIN
  SELECT status, stock_committed INTO order_status, order_committed FROM orders WHERE id = target_order FOR UPDATE;
  IF NOT FOUND OR NOT order_committed THEN
    RAISE NOTICE 'Nothing to fix';
    RETURN;
  END IF;
  IF order_status NOT IN ('new', 'pending') THEN
    RAISE EXCEPTION 'Order % is % now, not pending; fix skipped', target_order, order_status;
  END IF;
  SELECT COUNT(*) INTO item_count FROM order_items
  WHERE order_id = target_order AND NOT (coin_id = target_coin AND size_mm = 14 AND quantity = 6);
  IF item_count <> 0 OR NOT EXISTS (
    SELECT 1 FROM order_items WHERE order_id = target_order AND coin_id = target_coin AND size_mm = 14 AND quantity = 6
  ) THEN
    RAISE EXCEPTION 'Order % items changed; fix skipped', target_order;
  END IF;

  SELECT ordinality::INTEGER - 1 INTO size_index
  FROM coins, jsonb_array_elements(coins.size_stock) WITH ORDINALITY AS size(entry, ordinality)
  WHERE coins.id = target_coin AND (entry->>'size_mm')::NUMERIC = 14;
  IF size_index IS NULL THEN
    RAISE EXCEPTION '14 mm size missing on product %; fix skipped', target_coin;
  END IF;

  UPDATE coins SET
    size_stock = jsonb_set(size_stock, ARRAY[size_index::TEXT, 'stock_quantity'], to_jsonb((size_stock->size_index->>'stock_quantity')::INTEGER + 6)),
    stock_quantity = stock_quantity + 6
  WHERE id = target_coin;
  UPDATE orders SET stock_committed = FALSE WHERE id = target_order;
END;
$$;
