# One-time Firebase setup

This app uses Firebase Firestore for note/picture metadata and Supabase Storage for the actual files.

## Enable Firestore
Firebase Console -> Firestore Database -> Create database.
Choose a location and start the database.

## Firestore Rules
Open Firestore Database -> Rules and paste:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notes/{document=**} {
      allow read, write: if true;
    }
    match /pictures/{document=**} {
      allow read, write: if true;
    }
  }
}

Publish the rules.

These rules are intentionally open because this version has no login/authentication. Do not use them for a production multi-user app.

## Supabase
Storage bucket name must be exactly: NOTECLOUD-FILES
The bucket can remain Public. Your INSERT, SELECT and DELETE policies must be enabled for uploads/downloads/deletes.

## Run
npm install
npm run dev

After editing .env, always stop and restart Vite.
