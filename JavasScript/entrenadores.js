// Importa funciones y clases desde otros archivos
import { addTrainer, getTrainers, updateTrainer, deleteTrainer } from './db.js';
import Pokemon from './pokemon.js';
<<<<<<< HEAD
// Espera a que el DOM esté completamente cargado antes de ejecutar las funciones
=======

// Esperando a que el documento este cargado
>>>>>>> e43e6e9df20ad1e4c824c579c148dffb4d154b4b
document.addEventListener('DOMContentLoaded', () => {
    initializeTrainers(); // Inicializando a los entrenadores
    renderSelectedPokemons(); // Renderizando los Pokémon seleccionados
    renderTrainers(); // Renderizando los entrenadores
});
// Inicializa los entrenadores si no existen en la base de datos

// Función para inicializar los entrenadores
async function initializeTrainers() {
    const initialTrainers = [
        { id: 1, name: 'Orlando', group: 'Sabiduría', pokemons: [] },
        { id: 2, name: 'Marvin', group: 'Instinto', pokemons: [] },
        { id: 3, name: 'Antolino', group: 'Valor', pokemons: [] },
        { id: 4, name: 'Alisson', group: 'Sabiduría', pokemons: [] },
        { id: 5, name: 'Yosselin', group: 'Instinto', pokemons: [] },
    ];
    // Obtiene la lista de entrenadores desde la base de datos
    let trainers = await getTrainers();
    if (trainers.length === 0) {
        // Si no hay entrenadores en la base de datos, agrega los entrenadores iniciales
        initialTrainers.forEach(trainer => addTrainer(trainer));
    } else {
<<<<<<< HEAD
        // Actualiza los entrenadores existentes con el grupo si falta
=======
        // Si hay entrenadores, verifica si necesitan ser actualizados
>>>>>>> e43e6e9df20ad1e4c824c579c148dffb4d154b4b
        trainers = trainers.map(trainer => {
            if (!trainer.group) {
                const initialTrainer = initialTrainers.find(it => it.id === trainer.id);
                if (initialTrainer) {
                    trainer.group = initialTrainer.group;
                    updateTrainer(trainer);
                }
            }
            return trainer;
        });
    }
}
<<<<<<< HEAD
// Renderiza los Pokémon seleccionados desde el localStorage
=======

// Función para renderizar los Pokémon seleccionados
>>>>>>> e43e6e9df20ad1e4c824c579c148dffb4d154b4b
async function renderSelectedPokemons() {
    const selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons')) || [];
    const selectedContainer = document.querySelector('.selected-pokemons');

    selectedContainer.innerHTML = '';

    selectedPokemons.forEach(pokemon => {
        const pokemonInstance = new Pokemon(pokemon.id, pokemon.name, pokemon.sprites, pokemon.types);
        const pokemonCard = createSelectedPokemonCard(pokemonInstance);
        selectedContainer.appendChild(pokemonCard);
    });
}
<<<<<<< HEAD
// Crea una tarjeta HTML para un Pokémon seleccionado
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
        removePokemon(pokemon.id);
    });

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(removeButton);

    return card;
}
// Elimina un Pokémon seleccionado del localStorage y actualiza la vista
function removePokemon(pokemonId) {
    let selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons')) || [];
    selectedPokemons = selectedPokemons.filter(pokemon => pokemon.id !== pokemonId);
    localStorage.setItem('selectedPokemons', JSON.stringify(selectedPokemons));
    renderSelectedPokemons();
}
// Renderiza la lista de entrenadores desde la base de datos
=======

// Función para renderizar los entrenadores
>>>>>>> e43e6e9df20ad1e4c824c579c148dffb4d154b4b
async function renderTrainers() {
    const trainers = await getTrainers();
    const trainersContainer = document.querySelector('.trainers-container');
    trainersContainer.innerHTML = '';

    trainers.forEach(trainer => {
        const trainerCard = createTrainerCard(trainer);
        trainersContainer.appendChild(trainerCard);
    });
}
<<<<<<< HEAD
// Crea una tarjeta HTML para un entrenado
=======

// Función para crear la tarjeta de un entrenador
>>>>>>> e43e6e9df20ad1e4c824c579c148dffb4d154b4b
function createTrainerCard(trainer) {
    const trainerCard = document.createElement('div');
    const teamName = trainer.group.toLowerCase();
    trainerCard.className = `trainer-card ${teamName}`;

    const trainerId = document.createElement('span');
    trainerId.textContent = `ID: ${trainer.id}`;
    trainerId.className = 'trainer-id';

    const trainerImg = document.createElement('img');
    trainerImg.src = getTrainerImage(trainer.id);
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

    const pokemonList = document.createElement('ul');
    trainer.pokemons.forEach((pokemon, index) => {
        const listItem = document.createElement('li');
        const img = document.createElement('img');
        img.src = pokemon.sprites.front_default;
        img.alt = pokemon.name;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Eliminar';
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
    trainerCard.appendChild(pokemonList);

    return trainerCard;
}
<<<<<<< HEAD
// Asigna un Pokémon seleccionado a un entrenador
=======


>>>>>>> e43e6e9df20ad1e4c824c579c148dffb4d154b4b
async function assignPokemonToTrainer(trainerId) {
    const selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons')) || [];
    const trainers = await getTrainers();
    const trainer = trainers.find(tr => tr.id === trainerId);

    if (selectedPokemons.length > 0) {
        const pokemonOptions = selectedPokemons.map((pokemon, index) => `${index + 1}. ${pokemon.name}`).join('\n');
        const selection = prompt(`Selecciona un Pokémon para asignar a ${trainer.name}:\n${pokemonOptions}`);

        const selectedIndex = parseInt(selection) - 1;
        if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < selectedPokemons.length) {
            const selectedPokemon = selectedPokemons.splice(selectedIndex, 1)[0];
            trainer.pokemons.push(selectedPokemon);

            localStorage.setItem('selectedPokemons', JSON.stringify(selectedPokemons));
            updateTrainer(trainer);

            const pokemonImg = document.querySelector(`img[alt="${selectedPokemon.name}"]`);
            pokemonImg.classList.add('pokemon-img-moving');

            pokemonImg.addEventListener('animationend', () => {
                location.reload(); // Refresca la página después de la animación
            }, { once: true });
        } else {
            alert('Selección no válida');
        }
    } else {
        alert('No hay Pokémon seleccionados para asignar.');
    }
}
<<<<<<< HEAD
// Elimina un Pokémon de un entrenador y lo devuelve a la lista de seleccionados
=======

// Función para eliminar un Pokémon de un entrenador
>>>>>>> e43e6e9df20ad1e4c824c579c148dffb4d154b4b
async function removePokemonFromTrainer(trainerId, pokemonIndex) {
    const trainers = await getTrainers();
    const selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons')) || [];
    const trainer = trainers.find(tr => tr.id === trainerId);
    
    if (trainer && trainer.pokemons.length > pokemonIndex) {
        const [removedPokemon] = trainer.pokemons.splice(pokemonIndex, 1);
        selectedPokemons.push(removedPokemon);

        localStorage.setItem('selectedPokemons', JSON.stringify(selectedPokemons));
        updateTrainer(trainer);

        location.reload(); // Refresca la página después de eliminar el Pokémon
    }
}
