// storage.js - IndexedDB storage for recordings

const RecordingStorage = (() => {
  const DB_NAME = 'SingersVoiceDB';
  const DB_VERSION = 1;
  const STORE_NAME = 'recordings';
  let db = null;

  function open() {
    return new Promise((resolve, reject) => {
      if (db) return resolve(db);
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const database = e.target.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('date', 'date', { unique: false });
        }
      };

      request.onsuccess = (e) => {
        db = e.target.result;
        resolve(db);
      };

      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function save(recording) {
    const database = await open();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const entry = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        title: recording.title || 'Untitled Recording',
        date: new Date().toISOString(),
        duration: recording.duration || 0,
        blob: recording.blob,
        mimeType: recording.mimeType || 'audio/webm',
        source: recording.source || 'practice',
      };
      const request = store.add(entry);
      request.onsuccess = () => resolve(entry);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function getAll() {
    const database = await open();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        const results = request.result.sort((a, b) =>
          new Date(b.date) - new Date(a.date)
        );
        resolve(results);
      };
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function get(id) {
    const database = await open();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function remove(id) {
    const database = await open();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }

  return { open, save, getAll, get, remove };
})();
