
-- Create a doctor_images bucket for storing doctor profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('doctor_images', 'doctor_images', true);

-- Allow public access to the images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'doctor_images');

-- Allow authenticated users to insert and update their own images
CREATE POLICY "User Upload Policy"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'doctor_images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "User Update Policy"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'doctor_images' AND (storage.foldername(name))[1] = auth.uid()::text);
