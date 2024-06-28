import { addTrainer, getTrainers, updateTrainer, deleteTrainer } from './db.js';
import Pokemon from './pokemon.js';


document.addEventListener('DOMContentLoaded', () => {
    initializeTrainers(); // Inicializando entrenadores en la db
    renderSelectedPokemons(); // Renderizando los Pokémon seleccionados desde el localStorage
    renderTrainers(); // Renderizando los entrenadores desde la db
    setupEventListeners(); // Event listeners para los botones 
});

// Función para inicializar los entrenadores
async function initializeTrainers() {
    const initialTrainers = [
        { id: 1, name: 'Orlando', group: 'Sabiduría', pokemons: [] },
        { id: 2, name: 'Marvin', group: 'Instinto', pokemons: [] },
        { id: 3, name: 'Antolino', group: 'Valor', pokemons: [] },
        { id: 4, name: 'Alisson', group: 'Sabiduría', pokemons: [] },
        { id: 5, name: 'Yosselin', group: 'Instinto', pokemons: [] },
    ];

    // Obtenemos la lista de entrenadores de la db
    let trainers = await getTrainers();
    
    // Si no hay entrenadores en la base de datos añadimos los entrenadores 
    if (trainers.length === 0) {
        initialTrainers.forEach(trainer => addTrainer(trainer)); 
    } else {
        // Si hay entrenadores en la db 
        trainers = trainers.map(trainer => {

            if (!trainer.group) {
            
                const initialTrainer = initialTrainers.find(it => it.id === trainer.id);
                if (initialTrainer) {
                  
                    trainer.group = initialTrainer.group; 
                    // Actualizamos el entrenador
                    updateTrainer(trainer);
                }
            }
            return trainer; 
        });
    }
}


// Función para renderizar los Pokémon seleccionados desde el localStorage
async function renderSelectedPokemons() {
    const selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons')) || [];
    
    // Seleccionamos el contenedor donde se mostrarán los Pokémon
    const selectedContainer = document.querySelector('.selected-pokemons');

    selectedContainer.innerHTML = '';

    selectedPokemons.forEach(pokemon => {

        // Creando una instancia de la clase Pokemon con los datos del Pokémon actual
        const pokemonInstance = new Pokemon(pokemon.id, pokemon.name, pokemon.sprites, pokemon.types);
        
        // Creamos una tarjeta para el Pokémon 
        const pokemonCard = createSelectedPokemonCard(pokemonInstance);
        
        // Añadimos la tarjeta del Pokémon al contenedor
        selectedContainer.appendChild(pokemonCard);
    });
}


// Función para crear la tarjeta de un Pokémon seleccionado
function createSelectedPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'selected-pokemon-card';

    const img = document.createElement('img');
    img.src = pokemon.sprites.front_default;
    img.alt = pokemon.name;
    img.className = 'pokemon-img';

    const name = document.createElement('h3');
    name.textContent = pokemon.name;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Eliminar';
    removeButton.addEventListener('click', () => {
        removePokemon(pokemon.id); // Función para eliminar el Pokémon
    });

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(removeButton);

    return card;
}

// Función para eliminar un Pokémon del localStorage
function removePokemon(pokemonId) {
    let selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons')) || []; // Recuperamos la lista de Pokémon seleccionados del localStorage
    selectedPokemons = selectedPokemons.filter(pokemon => pokemon.id !== pokemonId);  // Filtramos el array para eliminar el Pokémon con el id especificado
    localStorage.setItem('selectedPokemons', JSON.stringify(selectedPokemons));// Guardamos el array actualizado de nuevo en el localStorage

    renderSelectedPokemons();// Volvemos a renderizar los Pokémon seleccionados para reflejar los cambios
}


// Función para renderizar los entrenadores desde la base de datos
async function renderTrainers() {
    const trainers = await getTrainers(); // Obtenemos la lista de entrenadores desde la db
    const trainersContainer = document.querySelector('.trainers-container'); // Seleccionamos el contenedor de los entrenadores en el DOM

    trainersContainer.innerHTML = ''; // Limpiamos el contenedor

    // Iteramos en la lista de entrenadores
    trainers.forEach(trainer => {
        const trainerCard = createTrainerCard(trainer); // Creamos una tarjeta de entrenador 

        trainersContainer.appendChild(trainerCard);
    });
}


// Función para crear la tarjeta de un entrenador
function createTrainerCard(trainer) {
    const trainerCard = document.createElement('div');
    const teamName = trainer.group.toLowerCase();
    trainerCard.className = `trainer-card ${teamName}`;

    const trainerId = document.createElement('span');
    trainerId.textContent = `ID: ${trainer.id}`;
    trainerId.className = 'trainer-id';

    const trainerImg = document.createElement('img');
    trainerImg.src = getTrainerImage(trainer.id); // Obtiene la imagen del entrenador según su ID
    trainerImg.alt = `${trainer.name}`;
    trainerImg.className = 'trainer-img';

    const trainerName = document.createElement('h3');
    trainerName.textContent = trainer.name;
    trainerName.className = 'trainer-name';

    const trainerGroup = document.createElement('h3');
    trainerGroup.textContent = `Grupo: ${trainer.group}`;
    trainerGroup.className = 'trainer-group';

    const assignButton = document.createElement('button');
    assignButton.textContent = 'Asignar Pokémon';
    assignButton.className = 'assign-button';
    assignButton.addEventListener('click', () => {
        assignPokemonToTrainer(trainer.id); 
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', () => {
        deleteTrainerById(trainer.id); 
    });

    const updateButton = document.createElement('button');
    updateButton.textContent = 'Actualizar';
    updateButton.className = 'update-button';
    updateButton.addEventListener('click', () => {
        updateTrainerName(trainer.id); 
    });

    const pokemonList = document.createElement('ul');
    trainer.pokemons.forEach((pokemon, index) => {
        const listItem = document.createElement('li');
        const img = document.createElement('img');
        img.src = pokemon.sprites.front_default;
        img.alt = pokemon.name;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Regresar';
        removeButton.className = 'remove-button';
        removeButton.addEventListener('click', () => {
            removePokemonFromTrainer(trainer.id, index); 
        });

        listItem.textContent = pokemon.name;
        listItem.prepend(img);
        listItem.appendChild(removeButton);
        pokemonList.appendChild(listItem);
    });

    trainerCard.appendChild(trainerId);
    trainerCard.appendChild(trainerImg);
    trainerCard.appendChild(trainerName);
    trainerCard.appendChild(trainerGroup);
    trainerCard.appendChild(assignButton);
    trainerCard.appendChild(updateButton);
    trainerCard.appendChild(deleteButton);
    trainerCard.appendChild(pokemonList);

    return trainerCard;
}

// Función para obtener la imagen del entrenador según su ID
function getTrainerImage(trainerId) {
    switch (trainerId) {
        case 1:
            return 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRlhoyv6F8AaCuul_6acYawIPAhV8gHy6iXMasP6RyFZVXjBk5Y';
        case 2:
            return 'https://e7.pngegg.com/pngimages/967/12/png-clipart-pokemon-black-2-and-white-2-pokemon-black-white-pokemon-gold-and-silver-trainer-video-game-pokemon-thumbnail.png';
        case 3:
            return 'https://c3.klipartz.com/pngpicture/730/726/sticker-png-brock.png';
        case 4:
            return 'https://w7.pngwing.com/pngs/541/272/png-transparent-pokemon-trainer-pixel-art-sprite-pokemon-fictional-character-hatsune-miku-pokemon.png';
        case 5:
            return 'https://w7.pngwing.com/pngs/866/98/png-transparent-hatsune-miku-vocaloid-pixel-art-yeah-you-can-fictional-character-hatsune-miku-art.png';
        default:
            return '';
    }
}

// Función para asignar un Pokémon a un entrenador
async function assignPokemonToTrainer(trainerId) {

    const selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons')) || [];// Obtenemos la lista de Pokémon seleccionados desde el localStorage
    const trainers = await getTrainers(); // Obtenemos la lista de entrenadores
    const trainer = trainers.find(tr => tr.id === trainerId);// Encontradno al entrenador por ID 

    // Si hay Pokémon seleccionados
    if (selectedPokemons.length > 0) {
        // Creamos una lista de opciones de Pokémon para el prompt
        const pokemonOptions = selectedPokemons.map((pokemon, index) => `${index + 1}. ${pokemon.name}`).join('\n');
        // Solicitamos al usuario que seleccione un Pokémon
        const selection = prompt(`Selecciona un Pokémon para asignar a ${trainer.name}:\n${pokemonOptions}`);
        // Convertimos la opcion a un índice de array
        const selectedIndex = parseInt(selection) - 1;

        // Verificamos que la selección sea válida
        if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < selectedPokemons.length) {

            // Eliminamos el Pokémon seleccionado del array y lo asignamos al entrenador
            const selectedPokemon = selectedPokemons.splice(selectedIndex, 1)[0];
            trainer.pokemons.push(selectedPokemon);

            // Actualizamos el localStorage 
            localStorage.setItem('selectedPokemons', JSON.stringify(selectedPokemons));

            // Actualizamos el entrenador en la db
            updateTrainer(trainer);

            // Añadiendo una animación a la imagen del Pokémon
            const pokemonImg = document.querySelector(`img[alt="${selectedPokemon.name}"]`);
            pokemonImg.classList.add('pokemon-img-moving');

            pokemonImg.addEventListener('animationend', () => {
                location.reload(); // recargando la página después de la animación
            }, { once: true });
        } else {
            alert('Selección no válida');
        }
    } else {
        alert('No hay Pokémon seleccionados para asignar.'); 
    }
}


// Función para eliminar un Pokémon de un entrenador
async function removePokemonFromTrainer(trainerId, pokemonIndex) {
    const trainers = await getTrainers();
    // Obtenemos la lista de Pokémon seleccionados desde el localStorage
    const selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons')) || [];

    // Buscando al entrenador por ID 
    const trainer = trainers.find(tr => tr.id === trainerId);
    
    // Verificando si el entrenador existe 
    if (trainer && trainer.pokemons.length > pokemonIndex) {

        // Eliminando el Pokémon del array de Pokémon del entrenador
        const [removedPokemon] = trainer.pokemons.splice(pokemonIndex, 1);

        // Añandiendo el Pokémon eliminado a la lista de Pokémon seleccionados
        selectedPokemons.push(removedPokemon);

        // Actualizando el localStorage 
        localStorage.setItem('selectedPokemons', JSON.stringify(selectedPokemons));

        // Actualizando el entrenador en la db
        updateTrainer(trainer);

        location.reload(); 
    }
}


// Función para los event listeners de la interfaz
function setupEventListeners() {

    const addTrainerButton = document.querySelector('#add-trainer-button');

    // Añadiendo un evento click
    addTrainerButton.addEventListener('click', () => {
        const trainerName = prompt('Ingresa el nombre del nuevo entrenador:');
        const trainerGroup = prompt('Ingresa el grupo del nuevo entrenador (Sabiduría, Instinto, Valor):');
        
        // Verificando que el nombre y el grupo no estén vacíos
        if (trainerName && trainerGroup) {
            // Añadiendo un nuevo entrenador a la db
            addTrainer({ id: Date.now(), name: trainerName, group: trainerGroup, pokemons: [] });
            
   
            location.reload(); 
        } else {
           
            alert('Nombre y grupo son requeridos para agregar un nuevo entrenador.');
        }
    });
}


// Función para eliminar un entrenador por ID
async function deleteTrainerById(trainerId) {
    if (confirm('¿Estás seguro de que deseas eliminar a este entrenador?')) {
        await deleteTrainer(trainerId);
        location.reload(); // Refresca la página después de eliminar el entrenador
    }
}

// Función para actualizar el nombre de un entrenador
async function updateTrainerName(trainerId) {
    
    const newName = prompt('Ingresa el nuevo nombre del entrenador:');
    
    // Verificamos que el nombre no este vacio
    if (newName) {
        // Obtenemos la lista de entrenadores desde la db
        const trainers = await getTrainers();
        
        // Buscando al entrenador por ID 
        const trainer = trainers.find(tr => tr.id === trainerId);
        
        // Verificamos si eiste
        if (trainer) {

            // Actualizando el nombre
            trainer.name = newName;
            // Actualizando en la db
            await updateTrainer(trainer);
            
            location.reload(); 
        }
    } else {
    
        alert('El nombre no puede estar vacío.');
    }
}