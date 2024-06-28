import { addTrainer, getTrainers, updateTrainer, deleteTrainer } from './db.js';
import Pokemon from './pokemon.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeTrainers();
    renderSelectedPokemons();
    renderTrainers();
});

async function initializeTrainers() {
    const initialTrainers = [
        { id: 1, name: 'Orlando', group: 'Sabiduría', pokemons: [] },
        { id: 2, name: 'Marvin', group: 'Instinto', pokemons: [] },
        { id: 3, name: 'Antolino', group: 'Valor', pokemons: [] },
        { id: 4, name: 'Alisson', group: 'Sabiduría', pokemons: [] },
        { id: 5, name: 'Yosselin', group: 'Instinto', pokemons: [] },
    ];

    let trainers = await getTrainers();
    if (trainers.length === 0) {
        initialTrainers.forEach(trainer => addTrainer(trainer));
    } else {
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

function removePokemon(pokemonId) {
    let selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons')) || [];
    selectedPokemons = selectedPokemons.filter(pokemon => pokemon.id !== pokemonId);
    localStorage.setItem('selectedPokemons', JSON.stringify(selectedPokemons));
    renderSelectedPokemons();
}

async function renderTrainers() {
    const trainers = await getTrainers();
    const trainersContainer = document.querySelector('.trainers-container');
    trainersContainer.innerHTML = '';

    trainers.forEach(trainer => {
        const trainerCard = createTrainerCard(trainer);
        trainersContainer.appendChild(trainerCard);
    });
}

function createTrainerCard(trainer) {
    const trainerCard = document.createElement('div');
    const teamName = trainer.group.toLowerCase();
    trainerCard.className = `trainer-card ${teamName}`;

    const trainerName = document.createElement('h3');
    trainerName.textContent = trainer.name;

    const trainerId = document.createElement('span');
    trainerId.textContent = `ID: ${trainer.id}`;

    const trainerGroup = document.createElement('h3');
    trainerGroup.textContent = `Grupo: ${trainer.group}`;

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
    trainerCard.appendChild(trainerGroup);
    trainerCard.appendChild(assignButton);
    trainerCard.appendChild(pokemonList);

    return trainerCard;
}

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
