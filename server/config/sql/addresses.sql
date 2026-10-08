CREATE TABLE IF NOT EXISTS user_addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(80) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  city VARCHAR(120) NOT NULL,
  address TEXT NOT NULL,
  postal_code VARCHAR(30),
  address_line_2 TEXT,
  country VARCHAR(2),
  notes TEXT,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE user_addresses ADD COLUMN IF NOT EXISTS postal_code VARCHAR(30);
ALTER TABLE user_addresses ADD COLUMN IF NOT EXISTS address_line_2 TEXT;
ALTER TABLE user_addresses ADD COLUMN IF NOT EXISTS country VARCHAR(2);

CREATE INDEX IF NOT EXISTS user_addresses_user_id_idx ON user_addresses(user_id);
