/*
  # Create Doubts Table

  1. New Tables
    - `doubts`
      - `id` (uuid, primary key) - Unique identifier for each doubt
      - `user_id` (uuid) - User identifier (for future auth integration)
      - `subject` (text) - Subject category of the doubt
      - `question` (text) - The actual doubt/question asked
      - `explanation` (text) - AI-generated simple explanation
      - `example` (text) - AI-generated example
      - `input_method` (text) - Whether input was 'voice' or 'text'
      - `created_at` (timestamptz) - Timestamp when doubt was created
  
  2. Security
    - Enable RLS on `doubts` table
    - Add policy for anyone to insert doubts (public access for demo)
    - Add policy for anyone to read all doubts (public access for demo)
*/

CREATE TABLE IF NOT EXISTS doubts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  subject text DEFAULT '',
  question text NOT NULL,
  explanation text DEFAULT '',
  example text DEFAULT '',
  input_method text DEFAULT 'text',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE doubts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert doubts"
  ON doubts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read doubts"
  ON doubts
  FOR SELECT
  TO anon, authenticated
  USING (true);