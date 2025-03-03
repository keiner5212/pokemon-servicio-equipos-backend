// src/firebase/firebase.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import { initializeApp, FirebaseApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { Auth, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  FirebaseStorage,
} from "firebase/storage";
import { Config } from "@/modules/enviroment/Config";

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: FirebaseApp;
  private db: Firestore;
  private auth: Auth;
  private storage: FirebaseStorage;

  constructor() {
    this.app = initializeApp({
      apiKey: Config.FB_API_KEY,
      authDomain: Config.FB_AUTH_DOMAIN,
      projectId: Config.FB_PROJECT_ID,
      storageBucket: Config.FB_STORAGE_BUCKET,
      messagingSenderId: Config.FB_MESSAGE_SENDER_ID,
      appId: Config.FB_APP_ID,
    });

    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
    this.storage = getStorage(this.app);
  }

  async onModuleInit() {
    await this.signInUser(Config.FB_API_USER_EMAIL, Config.FB_API_USER_PASSWORD);
  }

  async signInUser(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log("User signed in:", userCredential.user.uid);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  }

  async uploadImage(file: Buffer, name: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, `images/${name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  getFirestoreInstance(): Firestore {
    return this.db;
  }

  getAuthInstance(): Auth {
    return this.auth;
  }

  getAppInstance(): FirebaseApp {
    return this.app;
  }

  getStorageInstance(): FirebaseStorage {
    return this.storage;
  }
}
