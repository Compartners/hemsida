-- Create storage bucket for procurement documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('procurement-docs', 'procurement-docs', false);

-- Allow anyone to upload files to the bucket
CREATE POLICY "Anyone can upload procurement docs"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'procurement-docs');

-- Allow service role to read files (for edge function)
CREATE POLICY "Service role can read procurement docs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'procurement-docs');

-- Allow service role to delete files (cleanup after sending)
CREATE POLICY "Service role can delete procurement docs"
ON storage.objects
FOR DELETE
USING (bucket_id = 'procurement-docs');