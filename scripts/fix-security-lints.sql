-- Fix function search path mutable warnings

-- Fix init_member_rsvp
CREATE OR REPLACE FUNCTION init_member_rsvp()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.rsvps (member_id, status)
  VALUES (NEW.id, 'unknown')
  ON CONFLICT (member_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix update_updated_at_column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';
