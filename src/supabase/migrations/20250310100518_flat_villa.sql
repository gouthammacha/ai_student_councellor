/*
  # Create assessment attempts table

  1. New Tables
    - `assessment_attempts`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with timezone)
      - `user_id` (uuid, references auth.users)
      - `student_name` (text, not null)
      - `responses` (jsonb, stores assessment responses)
      - `analysis` (jsonb, stores analysis results)

  2. Security
    - Enable RLS on `assessment_attempts` table
    - Add policies for:
      - Users can insert their own attempts
      - Users can read only their own attempts
*/

CREATE TABLE IF NOT EXISTS public.assessment_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  student_name text NOT NULL,
  responses jsonb NOT NULL,
  analysis jsonb NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own attempts
CREATE POLICY "Users can insert their own attempts"
  ON public.assessment_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to read their own attempts
CREATE POLICY "Users can read their own attempts"
  ON public.assessment_attempts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_user_id ON public.assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_created_at ON public.assessment_attempts(created_at DESC);