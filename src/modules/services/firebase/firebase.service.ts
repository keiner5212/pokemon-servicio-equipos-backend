// src/firebase/firebase.service.ts
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
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
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private app: FirebaseApp;
  private db: Firestore;
  private auth: Auth;
  private storage: FirebaseStorage;

  constructor(private configService: ConfigService) {
    this.app = initializeApp({
      apiKey: this.configService.get<string>("FB_API_KEY"),
      authDomain: this.configService.get<string>("FB_AUTH_DOMAIN"),
      projectId: this.configService.get<string>("FB_PROJECT_ID"),
      storageBucket: this.configService.get<string>("FB_STORAGE_BUCKET"),
      messagingSenderId: this.configService.get<string>("FB_MESSAGE_SENDER_ID"),
      appId: this.configService.get<string>("FB_APP_ID"),
    });

    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
    this.storage = getStorage(this.app);
  }

  async onModuleInit() {
    this.logger.log("Initializing Firebase module...");
    await this.signInUser(
      this.configService.get<string>("FB_API_USER_EMAIL") || "",
      this.configService.get<string>("FB_API_USER_PASSWORD") || ""
    );
  }

  async signInUser(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.logger.log(`User signed in: ${userCredential.user.uid}`);
    } catch (error) {
      this.logger.error("Error signing in:", error);
    }
  }

  async uploadImage(file: Buffer, name: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, `images/${name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      this.logger.log(`Image uploaded successfully: ${downloadUrl}`);
      return downloadUrl;
    } catch (error) {
      this.logger.error("Error uploading image:", error);
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
