-- Create wedding party table if it doesn't exist
CREATE TABLE IF NOT EXISTS wedding_party (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  side TEXT NOT NULL, -- 'bride' or 'groom'
  order_position INTEGER, -- for ordering in displays
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_wedding_party_side ON wedding_party(side);
CREATE INDEX IF NOT EXISTS idx_wedding_party_role ON wedding_party(role);

-- Enable Row Level Security
ALTER TABLE wedding_party ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access on wedding_party" ON wedding_party FOR SELECT USING (true);
CREATE POLICY "Allow public insert on wedding_party" ON wedding_party FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on wedding_party" ON wedding_party FOR UPDATE USING (true);

-- Insert Emily's wedding party (Bride's side)
INSERT INTO wedding_party (name, role, side, order_position) VALUES
('Caroline Woolf', 'Maid of Honor', 'bride', 1),
('Chloe Hendrix', 'Maid of Honor', 'bride', 2),
('Taylor Lachney', 'Bridesmaid', 'bride', 3),
('Helen Dyer', 'Bridesmaid', 'bride', 4),
('Kathryn McKowen', 'Bridesmaid', 'bride', 5),
('Kaily Belleau', 'Bridesmaid', 'bride', 6),
('Rileigh Fontenot', 'Bridesmaid', 'bride', 7),
('Chelsea Wong', 'Bridesmaid', 'bride', 8);

-- Insert Matthew's wedding party (Groom's side)
INSERT INTO wedding_party (name, role, side, order_position) VALUES
('Michael Adams', 'Best Man', 'groom', 1),
('Joshua Giacone', 'Groomsman', 'groom', 2),
('Rolland Wallace', 'Groomsman', 'groom', 3),
('Nicholas Jones', 'Groomsman', 'groom', 4),
('James Avault', 'Groomsman', 'groom', 5),
('Taron Jones', 'Groomsman', 'groom', 6),
('Jacob Sicard', 'Groomsman', 'groom', 7);

-- Verify the data was inserted correctly
SELECT 
  side,
  role,
  name,
  order_position
FROM wedding_party 
ORDER BY side, order_position;
