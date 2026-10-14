CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  city VARCHAR(120) NOT NULL,
  address TEXT NOT NULL,
  postal_code VARCHAR(30),
  address_line_2 TEXT,
  country VARCHAR(2),
  delivery_notes TEXT,
  payment_method VARCHAR(50) DEFAULT 'cash_on_delivery',
  status VARCHAR(30) DEFAULT 'new' CHECK (status IN ('new', 'pending', 'confirmed', 'packed', 'sent', 'completed', 'cancelled', 'canceled')),
  total DECIMAL(10,2) NOT NULL,
  stock_committed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE orders ADD COLUMN IF NOT EXISTS postal_code VARCHAR(30);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address_line_2 TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS country VARCHAR(2);
-- Orders placed before reservations existed already took their boxes out of stock.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stock_committed BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE orders ALTER COLUMN stock_committed SET DEFAULT FALSE;

ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'new';
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN ('new', 'pending', 'confirmed', 'packed', 'sent', 'completed', 'cancelled', 'canceled'));

CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  coin_id UUID REFERENCES coins(id) ON DELETE SET NULL,
  coin_name VARCHAR(255) NOT NULL,
  photo_url VARCHAR(255),
  size_mm NUMERIC(6,2),
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0)
);

ALTER TABLE order_items ADD COLUMN IF NOT EXISTS size_mm NUMERIC(6,2);

-- Boxes held by orders that the admin has not approved yet. Shop stock = real stock - these.
CREATE OR REPLACE VIEW pending_stock_reservations AS
SELECT order_items.coin_id, order_items.size_mm, SUM(order_items.quantity)::INTEGER AS quantity
FROM order_items
JOIN orders ON orders.id = order_items.order_id
WHERE orders.status IN ('new', 'pending')
  AND NOT orders.stock_committed
  AND order_items.coin_id IS NOT NULL
GROUP BY order_items.coin_id, order_items.size_mm;
