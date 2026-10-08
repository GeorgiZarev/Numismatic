CREATE TABLE IF NOT EXISTS coins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, 
  name VARCHAR(255) NOT NULL,
  description TEXT,
  photo_url VARCHAR(255),
  price DECIMAL(10,2) NOT NULL,
  monarch VARCHAR(255),
  year INTEGER,
  country VARCHAR DEFAULT 'Montenegro' CHECK (country IN ('Montenegro', 'Bulgaria', 'Serbia', 'Romania', 'Greece', 'United States')),
  price_value VARCHAR,
  currency VARCHAR NOT NULL,
  product_type VARCHAR(30) NOT NULL DEFAULT 'coin' CHECK (product_type IN ('coin', 'investment', 'consumable')),
  consumable_category VARCHAR(30) CHECK (consumable_category IN ('capsules', 'cleaning_solutions', 'cardboard_holders')),
  composition_metal VARCHAR,
  weight VARCHAR,
  diameter VARCHAR,
  shape VARCHAR,
  technique VARCHAR,
  denomination VARCHAR,
  lettering VARCHAR,
  script VARCHAR,
  mintage NUMERIC,
  mint_place VARCHAR,
  coin_grading VARCHAR(5),
  number VARCHAR,
  status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'sold', 'hidden')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  restocked_at TIMESTAMP
);

ALTER TABLE coins ADD COLUMN IF NOT EXISTS status VARCHAR(30) NOT NULL DEFAULT 'active';
ALTER TABLE coins ADD COLUMN IF NOT EXISTS restocked_at TIMESTAMP;
ALTER TABLE coins ADD COLUMN IF NOT EXISTS product_type VARCHAR(30) NOT NULL DEFAULT 'coin';
ALTER TABLE coins ADD COLUMN IF NOT EXISTS consumable_category VARCHAR(30);
ALTER TABLE coins DROP CONSTRAINT IF EXISTS coins_consumable_category_check;
ALTER TABLE coins ADD CONSTRAINT coins_consumable_category_check CHECK (consumable_category IN ('capsules', 'cleaning_solutions', 'cardboard_holders'));
ALTER TABLE coins ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE coins DROP CONSTRAINT IF EXISTS coins_country_check;
ALTER TABLE coins ADD CONSTRAINT coins_country_check CHECK (country IN ('Montenegro', 'Bulgaria', 'Serbia', 'Romania', 'Greece', 'United States'));
ALTER TABLE coins DROP CONSTRAINT IF EXISTS coins_product_type_check;
ALTER TABLE coins ADD CONSTRAINT coins_product_type_check CHECK (product_type IN ('coin', 'investment', 'consumable'));
ALTER TABLE coins ALTER COLUMN year DROP NOT NULL;
ALTER TABLE coins DROP CONSTRAINT IF EXISTS coins_status_check;
ALTER TABLE coins ADD CONSTRAINT coins_status_check CHECK (status IN ('active', 'draft', 'sold', 'hidden'));
UPDATE coins SET currency = 'EUR' WHERE currency IS DISTINCT FROM 'EUR';
