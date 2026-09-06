# Supabase Storage setup

Your app stores actual PDFs, Word files and images in the Supabase bucket `NOTECLOUD-FILES`.
Firebase Firestore stores only the metadata.

## Important
Open Supabase → Settings → API and copy **Project URL**. Put that exact value in:

VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co

Then copy the **Publishable key** into:

VITE_SUPABASE_PUBLISHABLE_KEY=...

Restart Vite after editing `.env`:

npm run dev

## Bucket
The bucket name must be exactly:

NOTECLOUD-FILES

It must be Public for the current download implementation. The required policies are:
- SELECT
- INSERT
- DELETE

for bucket `NOTECLOUD-FILES`.
