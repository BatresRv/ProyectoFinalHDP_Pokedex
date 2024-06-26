

//Configuración de IndexedDB
//Primero, necesitamos configurar IndexedDB y crear un ObjectStore para almacenar los Pokémon acompañantes.
// Función para abrir la conexión con IndexedDB
function abrirConexion() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open('pokedexDB', 1);
  
      request.onerror = function(event) {
        console.error('Error al abrir la base de datos:', event.target.error);
        reject(event.target.error);
      };
  
      request.onsuccess = function(event) {
        const db = event.target.result;
        resolve(db);
      };
  
      request.onupgradeneeded = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('acompanantes')) {
          const store = db.createObjectStore('acompanantes', { keyPath: 'id', autoIncrement: true });
          // Definir índices u otras configuraciones si es necesario
        }
      };
    });
  }
  
  // Función para agregar un nuevo Pokémon acompañante
async function agregarAcompanante(pokemon) {
    const db = await abrirConexion();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['acompanantes'], 'readwrite');
      const store = transaction.objectStore('acompanantes');
      const request = store.add(pokemon);
  
      request.onsuccess = function(event) {
        resolve(event.target.result);
      };
  
      request.onerror = function(event) {
        console.error('Error al agregar el Pokémon acompañante:', event.target.error);
        reject(event.target.error);
      };
    });
  }
  
  // Función para obtener todos los Pokémon acompañantes
  async function obtenerTodosAcompanantes() {
    const db = await abrirConexion();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['acompanantes'], 'readonly');
      const store = transaction.objectStore('acompanantes');
      const request = store.getAll();
  
      request.onsuccess = function(event) {
        resolve(event.target.result);
      };
  
      request.onerror = function(event) {
        console.error('Error al obtener los Pokémon acompañantes:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  /* Operaciones CRUD
A continuación, implementaremos las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para los Pokémon acompañantes. */
  
  // Función para eliminar un Pokémon acompañante por su ID
  async function eliminarAcompanante(id) {
    const db = await abrirConexion();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['acompanantes'], 'readwrite');
      const store = transaction.objectStore('acompanantes');
      const request = store.delete(id);
  
      request.onsuccess = function(event) {
        resolve();
      };
  
      request.onerror = function(event) {
        console.error('Error al eliminar el Pokémon acompañante:', event.target.error);
        reject(event.target.error);
      };
    });
  }
  
  /**Integración con la Interfaz de Usuario */

  // Ejemplo de cómo integrar con la selección de un Pokémon en la tarjeta principal del Pokédex
async function seleccionarAcompanante(pokemon) {
    try {
      // Agregar el Pokémon a la lista de acompañantes
      const idAcompanante = await agregarAcompanante(pokemon);
      console.log(`Pokemon agregado como acompañante con ID: ${idAcompanante}`);
  
      // Actualizar la interfaz para mostrar el Pokémon en la sección "Mis Acompañantes"
      actualizarInterfazAcompanantes();
    } catch (error) {
      console.error('Error al seleccionar el Pokémon como acompañante:', error);
      // Manejar el error adecuadamente en tu aplicación
    }
  }
  