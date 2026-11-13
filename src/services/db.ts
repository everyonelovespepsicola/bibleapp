import { openDB, type IDBPDatabase } from 'idb';
import type { BibleTranslation } from '../types/bible';

const DB_NAME = 'BibleAppDB';
const DB_VERSION = 1;
const STORE_TRANSLATIONS = 'translations';
const STORE_METADATA = 'metadata';

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_TRANSLATIONS)) {
        db.createObjectStore(STORE_TRANSLATIONS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_METADATA)) {
        db.createObjectStore(STORE_METADATA);
      }
    },
  });
}

export async function saveTranslation(translation: BibleTranslation): Promise<void> {
  const db = await getDB();
  await db.put(STORE_TRANSLATIONS, translation);
}

export async function getTranslation(id: string): Promise<BibleTranslation | undefined> {
  const db = await getDB();
  return db.get(STORE_TRANSLATIONS, id);
}

export async function getAllTranslations(): Promise<BibleTranslation[]> {
  const db = await getDB();
  return db.getAll(STORE_TRANSLATIONS);
}

export async function deleteTranslation(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_TRANSLATIONS, id);
}
