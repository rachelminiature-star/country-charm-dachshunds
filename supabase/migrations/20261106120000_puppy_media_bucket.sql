-- Public storage bucket for puppy and gallery photos/videos (used by the admin pages).
INSERT INTO storage.buckets (id, name, public)
VALUES ('puppy-media', 'puppy-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Anyone can view media.
DROP POLICY IF EXISTS "puppy-media public read" ON storage.objects;
CREATE POLICY "puppy-media public read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'puppy-media');

-- Only admins can upload, change or delete media.
DROP POLICY IF EXISTS "puppy-media admin insert" ON storage.objects;
CREATE POLICY "puppy-media admin insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'puppy-media' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "puppy-media admin update" ON storage.objects;
CREATE POLICY "puppy-media admin update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'puppy-media' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "puppy-media admin delete" ON storage.objects;
CREATE POLICY "puppy-media admin delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'puppy-media' AND public.has_role(auth.uid(), 'admin'));
