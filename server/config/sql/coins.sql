CREATE TABLE IF NOT EXISTS coins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, 
  name VARCHAR(255) NOT NULL,
  name_bg VARCHAR(255),
  description TEXT,
  photo_url VARCHAR(255),
  price DECIMAL(10,2) NOT NULL,
  monarch VARCHAR(255),
  year INTEGER,
  country VARCHAR,
  price_value VARCHAR,
  currency VARCHAR NOT NULL,
  product_type VARCHAR(30) NOT NULL DEFAULT 'coin' CHECK (product_type IN ('coin', 'investment', 'consumable')),
  consumable_category VARCHAR(30) CHECK (consumable_category IN ('capsules', 'cleaning_solutions', 'cardboard_holders')),
  company VARCHAR(255),
  volume_ml INTEGER CHECK (volume_ml > 0),
  suitable_metals VARCHAR(255),
  pieces_per_box INTEGER CHECK (pieces_per_box > 0),
  size_stock JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(size_stock) = 'array'),
  composition_metal VARCHAR,
  weight VARCHAR,
  fineness INTEGER CHECK (fineness BETWEEN 0 AND 1000),
  pure_weight NUMERIC(10,3) CHECK (pure_weight >= 0),
  diameter VARCHAR,
  shape VARCHAR,
  technique VARCHAR,
  denomination VARCHAR,
  lettering VARCHAR,
  script VARCHAR,
  mintage NUMERIC,
  mint_place VARCHAR,
  coin_grading VARCHAR(50),
  number VARCHAR,
  status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'sold', 'hidden')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  restocked_at TIMESTAMP,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  zero_stock_action VARCHAR(20) NOT NULL DEFAULT 'hide' CHECK (zero_stock_action IN ('hide', 'show', 'review_delete')),
  expected_delivery_date DATE
);

ALTER TABLE coins ADD COLUMN IF NOT EXISTS status VARCHAR(30) NOT NULL DEFAULT 'active';
ALTER TABLE coins ADD COLUMN IF NOT EXISTS restocked_at TIMESTAMP;
ALTER TABLE coins ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 0;
ALTER TABLE coins ADD COLUMN IF NOT EXISTS zero_stock_action VARCHAR(20) NOT NULL DEFAULT 'hide';
ALTER TABLE coins ADD COLUMN IF NOT EXISTS expected_delivery_date DATE;
ALTER TABLE coins ALTER COLUMN stock_quantity SET DEFAULT 0;
ALTER TABLE coins ALTER COLUMN stock_quantity SET NOT NULL;
ALTER TABLE coins ALTER COLUMN zero_stock_action SET DEFAULT 'hide';
ALTER TABLE coins ALTER COLUMN zero_stock_action SET NOT NULL;
ALTER TABLE coins DROP CONSTRAINT IF EXISTS coins_stock_quantity_check;
ALTER TABLE coins ADD CONSTRAINT coins_stock_quantity_check CHECK (stock_quantity >= 0);
ALTER TABLE coins DROP CONSTRAINT IF EXISTS coins_zero_stock_action_check;
ALTER TABLE coins ADD CONSTRAINT coins_zero_stock_action_check CHECK (zero_stock_action IN ('hide', 'show', 'review_delete'));
ALTER TABLE coins ADD COLUMN IF NOT EXISTS product_type VARCHAR(30) NOT NULL DEFAULT 'coin';
ALTER TABLE coins ADD COLUMN IF NOT EXISTS consumable_category VARCHAR(30);
ALTER TABLE coins ADD COLUMN IF NOT EXISTS company VARCHAR(255);
ALTER TABLE coins ADD COLUMN IF NOT EXISTS volume_ml INTEGER;
ALTER TABLE coins ADD COLUMN IF NOT EXISTS suitable_metals VARCHAR(255);
ALTER TABLE coins ADD COLUMN IF NOT EXISTS pieces_per_box INTEGER;
ALTER TABLE coins ADD COLUMN IF NOT EXISTS size_stock JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE coins DROP CONSTRAINT IF EXISTS coins_size_stock_check;
ALTER TABLE coins ADD CONSTRAINT coins_size_stock_check CHECK (jsonb_typeof(size_stock) = 'array');
ALTER TABLE coins DROP CONSTRAINT IF EXISTS coins_volume_ml_check;
ALTER TABLE coins ADD CONSTRAINT coins_volume_ml_check CHECK (volume_ml > 0);
ALTER TABLE coins DROP CONSTRAINT IF EXISTS coins_pieces_per_box_check;
ALTER TABLE coins ADD CONSTRAINT coins_pieces_per_box_check CHECK (pieces_per_box > 0);
ALTER TABLE coins DROP CONSTRAINT IF EXISTS coins_consumable_category_check;
ALTER TABLE coins ADD CONSTRAINT coins_consumable_category_check CHECK (consumable_category IN ('capsules', 'cleaning_solutions', 'cardboard_holders'));
ALTER TABLE coins ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE coins ADD COLUMN IF NOT EXISTS name_bg VARCHAR(255);
ALTER TABLE coins ADD COLUMN IF NOT EXISTS fineness INTEGER;
ALTER TABLE coins ADD COLUMN IF NOT EXISTS pure_weight NUMERIC(10,3);
ALTER TABLE coins DROP CONSTRAINT IF EXISTS coins_country_check;
ALTER TABLE coins ALTER COLUMN country DROP DEFAULT;
ALTER TABLE coins ALTER COLUMN coin_grading TYPE VARCHAR(50);
ALTER TABLE coins DROP CONSTRAINT IF EXISTS coins_fineness_check;
ALTER TABLE coins ADD CONSTRAINT coins_fineness_check CHECK (fineness BETWEEN 0 AND 1000);
ALTER TABLE coins DROP CONSTRAINT IF EXISTS coins_pure_weight_check;
ALTER TABLE coins ADD CONSTRAINT coins_pure_weight_check CHECK (pure_weight >= 0);
ALTER TABLE coins DROP CONSTRAINT IF EXISTS coins_product_type_check;
ALTER TABLE coins ADD CONSTRAINT coins_product_type_check CHECK (product_type IN ('coin', 'investment', 'consumable'));
ALTER TABLE coins ALTER COLUMN year DROP NOT NULL;
ALTER TABLE coins DROP CONSTRAINT IF EXISTS coins_status_check;
ALTER TABLE coins ADD CONSTRAINT coins_status_check CHECK (status IN ('active', 'draft', 'sold', 'hidden'));
UPDATE coins SET currency = 'EUR' WHERE currency IS DISTINCT FROM 'EUR';
