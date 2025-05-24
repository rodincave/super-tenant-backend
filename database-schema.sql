-- Create the owner_preferences table in Supabase
CREATE TABLE IF NOT EXISTS owner_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id TEXT NOT NULL UNIQUE,
  priorities TEXT[] DEFAULT '{}',
  tenant_category TEXT DEFAULT '',
  student_field TEXT DEFAULT '',
  student_field_preference TEXT DEFAULT '',
  professional_sector TEXT DEFAULT '',
  professional_sector_preference TEXT DEFAULT '',
  min_financial_requirement TEXT DEFAULT '',
  financial_requirements TEXT[] DEFAULT '{}',
  lease_type TEXT DEFAULT '',
  min_stay TEXT DEFAULT '',
  acceptances TEXT[] DEFAULT '{}',
  lifestyle_matters TEXT[] DEFAULT '{}',
  relationship_management TEXT DEFAULT '',
  dealbreakers TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on owner_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_owner_preferences_owner_id ON owner_preferences(owner_id);

-- Enable Row Level Security (RLS)
ALTER TABLE owner_preferences ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to manage their own preferences
-- Note: In a real app, you'd use auth.uid() instead of allowing all operations
CREATE POLICY "Users can manage their own preferences" ON owner_preferences
  FOR ALL USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_owner_preferences_updated_at
  BEFORE UPDATE ON owner_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
