import Pokemon from './pokemon.js';
document.addEventListener('DOMContentLoaded', () => {
    initializeTrainers();
    renderSelectedPokemons();
    renderTrainers();
});

function initializeTrainers() {
    const initialTrainers = [
        { id: 1, name: 'Orlando',userName: 'Carlitos', pokemons: [] },
        { id: 2, name: 'Marvin', pokemons: [] },
        { id: 3, name: 'Antolino', pokemons: [] },
        { id: 4, name: 'Alisson', pokemons: [] },
        { id: 5, name: 'Yosselin', pokemons: [] },
    ];

    if (!localStorage.getItem('trainers')) {
        localStorage.setItem('trainers', JSON.stringify(initialTrainers));
    }
}

function renderSelectedPokemons() {
    const selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons')) || [];
    const selectedContainer = document.querySelector('.selected-pokemons');

    selectedContainer.innerHTML = '';

    selectedPokemons.forEach(pokemon => {
        const pokemonInstance = new Pokemon(pokemon.id, pokemon.name, pokemon.sprites, pokemon.types);
        const pokemonCard = createSelectedPokemonCard(pokemonInstance);
        selectedContainer.appendChild(pokemonCard);
    });
}

function createSelectedPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'selected-pokemon-card';

    const img = document.createElement('img');
    img.src = pokemon.sprites.front_default;
    img.alt = pokemon.name;

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

function removePokemon(pokemonId) {
    let selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons')) || [];
    selectedPokemons = selectedPokemons.filter(pokemon => pokemon.id !== pokemonId);
    localStorage.setItem('selectedPokemons', JSON.stringify(selectedPokemons));
    renderSelectedPokemons();
}

function renderTrainers() {
    const trainers = JSON.parse(localStorage.getItem('trainers')) || [];
    const trainersContainer = document.querySelector('.trainers-container');
    trainersContainer.innerHTML = '';

    trainers.forEach(trainer => {
        const trainerCard = createTrainerCard(trainer);
        trainersContainer.appendChild(trainerCard);
    });
}

function createTrainerCard(trainer) {
    const trainerCard = document.createElement('div');
    trainerCard.className = 'trainer-card';

    const trainerName = document.createElement('h3');
    trainerName.textContent = trainer.name;

    const trainerId = document.createElement('span');
    trainerId.textContent = `ID: ${trainer.id}`;

    const assignButton = document.createElement('button');
    assignButton.textContent = 'Asignar Pokémon';
    assignButton.addEventListener('click', () => {
        assignPokemonToTrainer(trainer.id);
    });

    const pokemonList = document.createElement('ul');
    trainer.pokemons.forEach((pokemon, index) => {
        const listItem = document.createElement('li');
        const img = document.createElement('img');
        img.src = pokemon.sprites.front_default;
        img.alt = pokemon.name;
        img.className = 'trainer-pokemon-image';

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Eliminar';
        removeButton.addEventListener('click', () => {
            removePokemonFromTrainer(trainer.id, index);
        });

        listItem.textContent = pokemon.name;
        listItem.prepend(img);
        listItem.appendChild(removeButton);
        pokemonList.appendChild(listItem);
    });

    trainerCard.appendChild(trainerName);
    trainerCard.appendChild(trainerId);
    trainerCard.appendChild(assignButton);
    trainerCard.appendChild(pokemonList);

    return trainerCard;
}

function assignPokemonToTrainer(trainerId) {
    const selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons')) || [];
    const trainers = JSON.parse(localStorage.getItem('trainers')) || [];
    const trainer = trainers.find(tr => tr.id === trainerId);

    if (selectedPokemons.length > 0) {
        const pokemonOptions = selectedPokemons.map((pokemon, index) => `${index + 1}. ${pokemon.name}`).join('\n');
        const selection = prompt(`Selecciona un Pokémon para asignar a ${trainer.name}:\n${pokemonOptions}`);

        const selectedIndex = parseInt(selection) - 1;
        if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < selectedPokemons.length) {
            const selectedPokemon = selectedPokemons.splice(selectedIndex, 1)[0];
            trainer.pokemons.push(selectedPokemon);

            localStorage.setItem('selectedPokemons', JSON.stringify(selectedPokemons));
            localStorage.setItem('trainers', JSON.stringify(trainers));

            renderSelectedPokemons();
            renderTrainers();
        } else {
            alert('Selección no válida');
        }
    } else {
        alert('No hay Pokémon seleccionados para asignar.');
    }
}

function removePokemonFromTrainer(trainerId, pokemonIndex) {
    const trainers = JSON.parse(localStorage.getItem('trainers')) || [];
    const trainer = trainers.find(tr => tr.id === trainerId);
    if (trainer && trainer.pokemons.length > pokemonIndex) {
        trainer.pokemons.splice(pokemonIndex, 1);
        localStorage.setItem('trainers', JSON.stringify(trainers));
        renderTrainers();
    }
}
