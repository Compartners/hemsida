-- Create storage bucket for CV uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('cv-uploads', 'cv-uploads', false);

-- Allow anyone to upload CVs (no auth required for job applications)
CREATE POLICY "Anyone can upload CV"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'cv-uploads');

-- Allow service role to read CVs for email attachment
CREATE POLICY "Service role can read CVs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'cv-uploads');