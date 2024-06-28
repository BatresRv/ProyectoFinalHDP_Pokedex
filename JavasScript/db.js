const DB_NAME = 'PokedexDB';
const DB_VERSION = 1;
const DB_STORE_NAME = 'trainers';

// Función para abrir la base de datos
function openDatabase() {
    return new Promise((resolve, reject) => {
        // Abrimos la base de datos
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        // Evento en caso de error al abrir la base de datos
        request.onerror = event => {
            console.error('Error:', event);
            reject('Error');
        };

        // Evento en caso de éxito 
        request.onsuccess = event => {
            resolve(event.target.result);
        };
    });
}

// Función para obtener un object store
function getObjectStore(storeName, mode) {
    return openDatabase().then(db => {
        // Iniciamos una transacción en la base de datos
        const transaction = db.transaction(storeName, mode);
        // Obtenemos el object store de la transacción
        return transaction.objectStore(storeName);
    });
}

// Función para añadir un nuevo entrenador a la base de datos
function addTrainer(trainer) {
    return getObjectStore(DB_STORE_NAME, 'readwrite').then(store => {
        return new Promise((resolve, reject) => {
            const request = store.add(trainer);
            // Evento en caso de éxito al añadir el entrenador
            request.onsuccess = () => resolve();
            // Evento en caso de error al añadir el entrenador
            request.onerror = event => {
                console.error('Error: ', event);
                reject('Error ');
            };
        });
    });
}

// Función para obtener todos los entrenadores de la base de datos
function getTrainers() {
    return getObjectStore(DB_STORE_NAME, 'readonly').then(store => {
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            // Evento en caso de éxito al obtener los entrenadores
            request.onsuccess = event => resolve(event.target.result);
            // Evento en caso de error al obtener los entrenadores
            request.onerror = event => {
                console.error('Error', event);
                reject('Error');
            };
        });
    });
}

// Función para actualizar un entrenador en la base de datos
function updateTrainer(trainer) {
    return getObjectStore(DB_STORE_NAME, 'readwrite').then(store => {
        return new Promise((resolve, reject) => {
            const request = store.put(trainer);
            // Evento en caso de éxito al actualizar el entrenador
            request.onsuccess = () => resolve();
            // Evento en caso de error al actualizar el entrenador
            request.onerror = event => {
                console.error('Error', event);
                reject('Error');
            };
        });
    });
}

// Función para eliminar un entrenador de la db por ID
function deleteTrainer(trainerId) {
    return getObjectStore(DB_STORE_NAME, 'readwrite').then(store => {
        return new Promise((resolve, reject) => {
            const request = store.delete(trainerId);
            // Evento en caso de éxito al eliminar el entrenador
            request.onsuccess = () => resolve();
            // Evento en caso de error al eliminar el entrenador
            request.onerror = event => {
                console.error('Error', event);
                reject('Error');
            };
        });
    });
}


export { addTrainer, getTrainers, updateTrainer, deleteTrainer };
