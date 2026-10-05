CREATE TABLE IF NOT EXISTS user_addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(80) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  city VARCHAR(120) NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS user_addresses_user_id_idx ON user_addresses(user_id);
