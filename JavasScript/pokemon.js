import { getTypeColor } from './utils.js';

const dbName = 'PokedexDB';
const storeName = 'trainers';
let db;

class Pokemon {
    constructor(id, name, sprites, types) {
        this.id = id;
        this.name = name;
        this.sprites = sprites;
        this.types = types;
        this.species = null;
        this.height = null;
        this.weight = null;
        this.abilities = null;
        this.weaknesses = null;
        this.stats = null;
        this.moves = null;
    }

    async fetchDetails() {
        if (this.stats && this.moves) return;

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${this.id}`);
            const data = await response.json();

            this.species = await this.fetchSpecies(data.species.url);
            this.height = data.height;
            this.weight = data.weight;
            this.abilities = data.abilities;
            this.stats = data.stats;
            this.moves = data.moves;

            const weaknessesResponse = await Promise.all(this.types.map(type => fetch(type.type.url).then(res => res.json())));
            const weaknesses = weaknessesResponse.map(response => response.damage_relations.double_damage_from.map(type => type.name));
            this.weaknesses = [].concat(...weaknesses);
        } catch (error) {
            console.error('Error fetching details:', error);
        }
    }

    async fetchSpecies(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.name;
        } catch (error) {
            console.error('Error fetching species:', error);
            return 'Unknown';
        }
    }

    createPokemonCard(pokemon, expandable = true, showRemoveButton = false, showAddCompanionButton = false) {
        const pokemonCard = document.createElement('div');
        pokemonCard.className = `pokemon-card ${pokemon.types[0].type.name}`;
        pokemonCard.style.backgroundColor = getTypeColor(pokemon.types[0].type.name);

        if (expandable) {
            pokemonCard.addEventListener('click', () => this.expandCard(pokemonCard));
        }

        const pokemonImage = document.createElement('img');
        pokemonImage.src = pokemon.sprites.front_default;
        pokemonImage.alt = pokemon.name;

        const pokemonName = document.createElement('h3');
        pokemonName.textContent = pokemon.name;

        const idContainer = document.createElement('div');
        idContainer.className = 'id-container';
        const pokemonId = document.createElement('span');
        pokemonId.textContent = pokemon.id;
        idContainer.appendChild(pokemonId);

        const typesContainer = document.createElement('div');
        typesContainer.className = 'types-container';

        pokemon.types.forEach(type => {
            const typeCircle = document.createElement('div');
            typeCircle.className = 'type-circle';
            typeCircle.textContent = type.type.name;
            typeCircle.style.backgroundColor = getTypeColor(type.type.name);
            typesContainer.appendChild(typeCircle);
        });

        const selectButton = document.createElement('button');
        selectButton.className = 'select-btn';
        selectButton.textContent = 'Seleccionar';
        selectButton.style.display = 'none'; // Inicialmente oculto

        selectButton.addEventListener('click', (event) => {
            event.stopPropagation();
            this.selectPokemon();
        });

        pokemonCard.appendChild(pokemonImage);
        pokemonCard.appendChild(pokemonName);
        pokemonCard.appendChild(idContainer);
        pokemonCard.appendChild(typesContainer);
        pokemonCard.appendChild(selectButton);

        if (showRemoveButton) {
            const removeButton = document.createElement('button');
            removeButton.className = 'remove-btn';
            removeButton.textContent = 'Eliminar';
            removeButton.addEventListener('click', (event) => {
                event.stopPropagation();
                this.removePokemon(pokemon.id);
            });
            pokemonCard.appendChild(removeButton);
        }

        if (showAddCompanionButton) {
            const addCompanionButton = document.createElement('button');
            addCompanionButton.className = 'add-companion-btn';
            addCompanionButton.textContent = 'Agregar a acompañante';
            addCompanionButton.addEventListener('click', (event) => {
                event.stopPropagation();
                this.addCompanion(pokemon.id);
            });
            pokemonCard.appendChild(addCompanionButton);
        }

        return pokemonCard;
    }

    createTrainerCard(trainer) {
        const trainerCard = document.createElement('div');
        trainerCard.className = 'trainer-card';
        trainerCard.dataset.trainerId = trainer.id;

        const trainerName = document.createElement('h3');
        trainerName.textContent = `Entrenador ${trainer.id}`;
        trainerCard.appendChild(trainerName);

        const pokemonList = document.createElement('div');
        pokemonList.className = 'pokemon-list';

        trainer.pokemon.forEach(pokemon => {
            const pokemonInstance = new Pokemon(pokemon.id, pokemon.name, pokemon.sprites, pokemon.types);
            const pokemonCard = pokemonInstance.createPokemonCard(pokemon, false, true); // No expandible, mostrar botón de eliminación
            pokemonList.appendChild(pokemonCard);
        });

        trainerCard.appendChild(pokemonList);

        return trainerCard;
    }

    render() {
        return this.createPokemonCard(this);
    }

    async expandCard(card) {
        if (card.classList.contains('expanded')) {
            card.classList.remove('expanded');
            card.style.width = '150px';
            card.style.height = 'auto';
            card.querySelector('.details').remove();
            card.querySelector('.select-btn').style.display = 'none'; // Ocultar el botón cuando se contrae
            return;
        }

        card.classList.add('expanded');
        await this.fetchDetails();

        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'details';

        const speciesItem = document.createElement('p');
        speciesItem.textContent = `Species: ${this.species}`;
        detailsContainer.appendChild(speciesItem);

        const heightItem = document.createElement('p');
        heightItem.textContent = `Height: ${this.height / 10} m`;
        detailsContainer.appendChild(heightItem);

        const weightItem = document.createElement('p');
        weightItem.textContent = `Weight: ${this.weight / 10} kg`;
        detailsContainer.appendChild(weightItem);

        const abilitiesItem = document.createElement('p');
        abilitiesItem.textContent = `Abilities: ${this.abilities.map(ability => ability.ability.name).join(', ')}`;
        detailsContainer.appendChild(abilitiesItem);

        const weaknessesItem = document.createElement('p');
        weaknessesItem.textContent = `Weaknesses: ${this.weaknesses.join(', ')}`;
        detailsContainer.appendChild(weaknessesItem);

        const statsTitle = document.createElement('h4');
        statsTitle.textContent = 'Stats:';
        detailsContainer.appendChild(statsTitle);

        const statsList = document.createElement('ul');
        this.stats.forEach(stat => {
            const statItem = document.createElement('li');
            statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
            statsList.appendChild(statItem);
        });
        detailsContainer.appendChild(statsList);

        const movesTitle = document.createElement('h4');
        movesTitle.textContent = 'Moves:';
        detailsContainer.appendChild(movesTitle);

        const movesList = document.createElement('ul');
        this.moves.slice(0, 5).forEach(move => {
            const moveItem = document.createElement('li');
            moveItem.textContent = move.move.name;
            movesList.appendChild(moveItem);
        });
        detailsContainer.appendChild(movesList);

        card.appendChild(detailsContainer);

        card.querySelector('.select-btn').style.display = 'block'; // Mostrar el botón cuando se expande
    }

    selectPokemon() {
        const selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons')) || [];
        const messageElement = document.getElementById('messages');

        function showAlert(message) {
            messageElement.innerHTML = message;
            messageElement.classList.add('show');
            setTimeout(() => {
                messageElement.classList.remove('show');
            }, 3000); // Ocultar después de 3 segundos
        }

        // Limpiar mensajes previos
        messageElement.innerHTML = '';

        if (selectedPokemons.length < 6 && !selectedPokemons.some(pokemon => pokemon.id === this.id)) {
            selectedPokemons.push({
                id: this.id,
                name: this.name,
                sprites: this.sprites,
                types: this.types
            });
            localStorage.setItem('selectedPokemons', JSON.stringify(selectedPokemons));
            this.renderSelectedPokemons();
            showAlert('Pokémon seleccionado correctamente.');
        } else if (selectedPokemons.some(pokemon => pokemon.id === this.id)) {
            showAlert('Este Pokémon ya está seleccionado.');
        } else {
            showAlert('Ya has seleccionado 6 Pokémon.');
        }

        // Mostrar u ocultar el botón 'Agregar a acompañante' basado en la cantidad de Pokémon seleccionados
        const addCompanionButtons = document.querySelectorAll('.add-companion-btn');
        if (selectedPokemons.length === 6) {
            addCompanionButtons.forEach(button => {
                button.style.display = 'block';
            });
        } else {
            addCompanionButtons.forEach(button => {
                button.style.display = 'none';
            });
        }
    }

    async addCompanion(pokemonId) {
        const trainerId = prompt('Ingresa el ID del entrenador para agregar este Pokémon:');
        if (!trainerId) return;

        const transaction = db.transaction([storeName], 'readwrite');
        const objectStore = transaction.objectStore(storeName);

        const getTrainerRequest = objectStore.get(Number(trainerId));

        getTrainerRequest.onsuccess = (event) => {
            const trainer = event.target.result;
            if (!trainer) {
                alert('Entrenador no encontrado.');
                return;
            }

            trainer.pokemon.push({
                id: this.id,
                name: this.name,
                sprites: this.sprites,
                types: this.types
            });

            const updateTrainerRequest = objectStore.put(trainer);

            updateTrainerRequest.onsuccess = (event) => {
                console.log(`Se ha agregado ${this.name} al entrenador.`);
                displayTrainers();
            };

            updateTrainerRequest.onerror = (event) => {
                console.error('Error al actualizar el entrenador:', event.target.errorCode);
            };
        };

        getTrainerRequest.onerror = (event) => {
            console.error('Error al obtener el entrenador:', event.target.errorCode);
        };
    }

    removePokemon(pokemonId) {
        let selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons')) || [];
        selectedPokemons = selectedPokemons.filter(pokemon => pokemon.id !== pokemonId);
        localStorage.setItem('selectedPokemons', JSON.stringify(selectedPokemons));
        this.renderSelectedPokemons();
    }

    renderSelectedPokemons() {
        const selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons')) || [];
        const selectedContainer = document.querySelector('.selected-pokemons');

        selectedContainer.innerHTML = '';

        selectedPokemons.forEach(pokemon => {
            // Crea una nueva instancia de Pokemon para usar el método createPokemonCard
            const pokemonInstance = new Pokemon(pokemon.id, pokemon.name, pokemon.sprites, pokemon.types);
            const pokemonCard = pokemonInstance.createPokemonCard(pokemon, false, true, true); // No expandible, mostrar botón de eliminación y botón de agregar a acompañante
            selectedContainer.appendChild(pokemonCard);
        });

        // Ocultar el botón 'Agregar a acompañante' en los Pokémon que no están seleccionados
        const allPokemonCards = document.querySelectorAll('.pokemon-card');
        allPokemonCards.forEach(card => {
            const pokemonId = parseInt(card.querySelector('.id-container span').textContent);
            const found = selectedPokemons.some(pokemon => pokemon.id === pokemonId);
            if (!found) {
                card.querySelector('.add-companion-btn').style.display = 'none';
            }
        });
    }
}

function openDB() {
    const request = indexedDB.open(dbName, 1);

    request.onerror = (event) => {
        console.error('Error al abrir la base de datos:', event.target.errorCode);
    };

    request.onsuccess = (event) => {
        console.log('Base de datos abierta exitosamente.');
        db = event.target.result;
        displayTrainers();
    };

    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('pokemon', 'pokemon', { unique: false });

        console.log(`Base de datos ${dbName} creada y lista para su uso.`);
    };
}

function displayTrainers() {
    const transaction = db.transaction([storeName], 'readonly');
    const objectStore = transaction.objectStore(storeName);

    const trainersList = document.getElementById('trainers-list');
    trainersList.innerHTML = '';

    const request = objectStore.getAll();

    request.onsuccess = (event) => {
        const trainers = event.target.result;
        trainers.forEach(trainer => {
            const trainerInstance = new Pokemon(trainer.id, `Entrenador ${trainer.id}`, [], []); // Crear instancia de entrenador con datos mínimos
            const trainerCard = trainerInstance.createTrainerCard(trainer);
            trainersList.appendChild(trainerCard);
        });
    };

    request.onerror = (event) => {
        console.error('Error al obtener los entrenadores:', event.target.errorCode);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    openDB();
});
export default Pokemon;
