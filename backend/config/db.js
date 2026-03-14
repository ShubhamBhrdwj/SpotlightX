import fs from "fs";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getFirebaseOptions() {
  const projectId = process.env.FIREBASE_PROJECT_ID || "demo-spotlightx";
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf8")
    );

    return {
      credential: cert(serviceAccount),
      projectId
    };
  }

  return { projectId };
}

export async function connectDB() {
  try {
    if (!getApps().length) {
      initializeApp(getFirebaseOptions());
    }

    const db = getFirestore();
    const mode = process.env.FIRESTORE_EMULATOR_HOST ? "emulator" : "cloud";

    console.log(
      `Firestore ready (${mode}) for project ${process.env.FIREBASE_PROJECT_ID || "demo-spotlightx"}`
    );

    return db;
  } catch (error) {
    console.error(`Firestore initialization failed: ${error.message}`);
    process.exit(1);
  }
}

export function getDb() {
  if (!getApps().length) {
    initializeApp(getFirebaseOptions());
  }

  return getFirestore();
}
