#!/bin/sh

if [ ! -f ".firebaserc" ]; then
  echo "Inicializando Firebase Emulator..."
  firebase init --project "$FIREBASE_PROJECT"
fi

firebase emulators:start --only auth,firestore,storage,database --project "$FIREBASE_PROJECT" --import=./firebase --export-on-exit
