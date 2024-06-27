// db.js
const DB_NAME = 'PokedexDB';
const DB_VERSION = 1;
const DB_STORE_NAME = 'trainers';

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = event => {
            console.error('Error opening database', event);
            reject('Error opening database');
        };

        request.onsuccess = event => {
            resolve(event.target.result);
        };

        request.onupgradeneeded = event => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(DB_STORE_NAME)) {
                const objectStore = db.createObjectStore(DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });
                objectStore.createIndex('name', 'name', { unique: false });
            }
        };
    });
}

function getObjectStore(storeName, mode) {
    return openDatabase().then(db => {
        const transaction = db.transaction(storeName, mode);
        return transaction.objectStore(storeName);
    });
}

function addTrainer(trainer) {
    return getObjectStore(DB_STORE_NAME, 'readwrite').then(store => {
        return new Promise((resolve, reject) => {
            const request = store.add(trainer);
            request.onsuccess = () => resolve();
            request.onerror = event => {
                console.error('Error adding trainer', event);
                reject('Error adding trainer');
            };
        });
    });
}

function getTrainers() {
    return getObjectStore(DB_STORE_NAME, 'readonly').then(store => {
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = event => resolve(event.target.result);
            request.onerror = event => {
                console.error('Error getting trainers', event);
                reject('Error getting trainers');
            };
        });
    });
}

function updateTrainer(trainer) {
    return getObjectStore(DB_STORE_NAME, 'readwrite').then(store => {
        return new Promise((resolve, reject) => {
            const request = store.put(trainer);
            request.onsuccess = () => resolve();
            request.onerror = event => {
                console.error('Error updating trainer', event);
                reject('Error updating trainer');
            };
        });
    });
}

function deleteTrainer(trainerId) {
    return getObjectStore(DB_STORE_NAME, 'readwrite').then(store => {
        return new Promise((resolve, reject) => {
            const request = store.delete(trainerId);
            request.onsuccess = () => resolve();
            request.onerror = event => {
                console.error('Error deleting trainer', event);
                reject('Error deleting trainer');
            };
        });
    });
}

export { addTrainer, getTrainers, updateTrainer, deleteTrainer };
