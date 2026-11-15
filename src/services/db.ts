import { openDB, type IDBPDatabase } from 'idb';
import type { BibleTranslation } from '../types/bible';
import type { EgwChapterData } from '../types/egw';

const DB_NAME = 'BibleAppDB';
const DB_VERSION = 3; // Incremented to v3 for consolidated public domain books and index
const STORE_TRANSLATIONS = 'translations';
const STORE_METADATA = 'metadata';
const STORE_EGW_BOOKS = 'egw_books';
const STORE_EGW_INDEX = 'egw_index';

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (!db.objectStoreNames.contains(STORE_TRANSLATIONS)) {
        db.createObjectStore(STORE_TRANSLATIONS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_METADATA)) {
        db.createObjectStore(STORE_METADATA);
      }
      if (oldVersion < 2) {
        if (!db.objectStoreNames.contains(STORE_EGW_BOOKS)) {
          db.createObjectStore(STORE_EGW_BOOKS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_EGW_INDEX)) {
          db.createObjectStore(STORE_EGW_INDEX);
        }
      }
      if (oldVersion < 3) {
        // Clear cached books from v2 to refresh with consolidated true chapters
        // In onupgradeneeded, object stores can be cleared directly on the transaction
        try {
          if (db.objectStoreNames.contains(STORE_EGW_BOOKS)) {
            const store = (db as any).transaction ? (db as any).transaction.objectStore(STORE_EGW_BOOKS) : null;
            if (store && store.clear) store.clear();
          }
          if (db.objectStoreNames.contains(STORE_EGW_INDEX)) {
            const store = (db as any).transaction ? (db as any).transaction.objectStore(STORE_EGW_INDEX) : null;
            if (store && store.clear) store.clear();
          }
        } catch (e) {
          console.warn('[DB Upgrade] Could not clear old stores, continuing:', e);
        }
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

/**
 * Cache full EGW Book data into IndexedDB for 100% offline access
 */
export async function saveEgwBookOffline(book: { id: string; chapters: EgwChapterData[] }): Promise<void> {
  const db = await getDB();
  await db.put(STORE_EGW_BOOKS, book);
}

export async function getEgwBookOffline(id: string): Promise<{ id: string; chapters: EgwChapterData[] } | undefined> {
  const db = await getDB();
  return db.get(STORE_EGW_BOOKS, id.toLowerCase());
}

/**
 * Save master reverse verse index to IndexedDB
 */
export async function saveEgwVerseIndexOffline(index: Record<string, any[]>): Promise<void> {
  const db = await getDB();
  await db.put(STORE_EGW_INDEX, index, 'master_index');
}

export async function getEgwVerseIndexOffline(): Promise<Record<string, any[]> | undefined> {
  const db = await getDB();
  return db.get(STORE_EGW_INDEX, 'master_index');
}
