const { execSync } = require("child_process");
const fs = require("fs");

const FIREBASE_PROJECT = process.env.FIREBASE_PROJECT || "default-project";
const main = () => {

  if (!fs.existsSync("firebase.json")) {
    console.log("Firebase data not found. Skipping Firebase Emulator start...");
    return
  }

  execSync(
    `firebase emulators:start --only auth,firestore,storage,database --project ${FIREBASE_PROJECT} --import ./firebasedata --export-on-exit`,
    { stdio: "inherit" }
  );
}
try {
  main()
} catch (error) {
  console.log(error.message);
  setTimeout(() => {
    try {
      main()
    } catch (error) {
      console.log(error.message);
    }
  }, 5000);
}