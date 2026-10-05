CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  city VARCHAR(120) NOT NULL,
  address TEXT NOT NULL,
  delivery_notes TEXT,
  payment_method VARCHAR(50) DEFAULT 'cash_on_delivery',
  status VARCHAR(30) DEFAULT 'new' CHECK (status IN ('new', 'pending', 'confirmed', 'packed', 'sent', 'completed', 'cancelled', 'canceled')),
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'new';
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN ('new', 'pending', 'confirmed', 'packed', 'sent', 'completed', 'cancelled', 'canceled'));

CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  coin_id UUID REFERENCES coins(id) ON DELETE SET NULL,
  coin_name VARCHAR(255) NOT NULL,
  photo_url VARCHAR(255),
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0)
);
