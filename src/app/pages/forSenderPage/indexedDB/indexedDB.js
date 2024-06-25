// src/indexedDB.js


export function openDatabase() {
  return new Promise((resolve, reject) => {
    //database name is FileDatabase
    const request = indexedDB.open('FileDatabase', 1);

    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files', { keyPath: 'id'});
      }
    };

    request.onsuccess = function(event) {
      resolve(event.target.result);
    };

    request.onerror = function(event) {
      reject('Database error: ' + event.target.errorCode);
    };
  });
}

export async function saveFile(file,id) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['files'], 'readwrite');
    const objectStore = transaction.objectStore('files');
    
    const data = {
      id : id ,
      content : file
    }
    const request = objectStore.put(data);
    request.onsuccess = function() {
      resolve('File saved successfully.');
    };

    request.onerror = function(event) {
      reject('Error saving file: ' + event.target.error);
    };
  });
}



export const deleteFile = async (id) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['files'], 'readwrite');
    const objectStore = transaction.objectStore('files');
    const request = objectStore.delete(id);

    request.onsuccess = () => {
      resolve('File deleted successfully');
    };

    request.onerror = (event) => {
      reject(`Failed to delete file: ${event.target.error}`);
    };
  });
};


export async function getFile(id) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['files'], 'readonly');
    const objectStore = transaction.objectStore('files');
    const request = objectStore.get(id);

    request.onsuccess = function(event) {
      if (event.target.result) {
        resolve(event.target.result.content);
      } else {
        reject('No file found.');
      }
    };

    request.onerror = function(event) {
      reject('Error retrieving file: ' + event.target.error);
    };
  });
}


export async function countFiles() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['files'], 'readonly');
    const objectStore = transaction.objectStore('files');
    const request = objectStore.count();

    request.onsuccess = function(event) {
      resolve(request.result);
    };

    request.onerror = function(event) {
      reject('Error counting files: ' + event.target.error);
    };
  });
}

export async function getAllKeys () {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['files'], 'readonly');
    const objectStore = transaction.objectStore('files');
    const request = objectStore.getAllKeys();

    request.onsuccess = function(event) {
      resolve(request.result)
    };

    request.onerror = function(event) {
      reject('Error retrieving file: ' + event.target.error);
    };
  });
}

export async function clearAllItems() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['files'], 'readwrite');
    const objectStore = transaction.objectStore('files');
    const request = objectStore.clear();

    request.onsuccess = function(event) {
      resolve(request.result);
    };

    request.onerror = function(event) {
      reject('Error clearing dB: ' + event.target.error);
    };
  });
}