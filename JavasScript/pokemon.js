import { getTypeColor } from './utils.js';

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

    createPokemonCard(pokemon, expandable = true, showRemoveButton = false) {
        const pokemonCard = document.createElement('div');
        pokemonCard.className = `pokemon-card ${pokemon.types[0].type.name}`;
        pokemonCard.style.backgroundColor = getTypeColor(pokemon.types[0].type.name);

        if (expandable) {
            pokemonCard.addEventListener('click', (event) => {
                event.stopPropagation();
                this.expandCard(pokemonCard);
            });
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
            this.selectPokemon(pokemonCard);
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

        return pokemonCard;
    }

    render() {
        return this.createPokemonCard(this);
    }

    async expandCard(card) {
        if (card.classList.contains('expanded')) {
            card.classList.remove('expanded');
            card.style.width = '';
            card.style.height = '';
            const details = card.querySelector('.details');
            if (details) {
                details.remove();
            }
            card.querySelector('.select-btn').style.display = 'none'; // Ocultar el botón cuando se contrae
            return;
        }

        // Obtener la posición actual de la tarjeta seleccionada
        const cardRect = card.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        card.classList.add('expanded');
        await this.fetchDetails();

        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'details';

        // Crear las pestañas
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'tabs-container';

        const aboutTab = document.createElement('button');
        aboutTab.className = 'tab';
        aboutTab.textContent = 'About';
        aboutTab.addEventListener('click', (event) => {
            event.stopPropagation();
            this.showTab(detailsContainer, 'about-section');
        });

        const statsTab = document.createElement('button');
        statsTab.className = 'tab';
        statsTab.textContent = 'Base Stats';
        statsTab.addEventListener('click', (event) => {
            event.stopPropagation();
            this.showTab(detailsContainer, 'stats-section');
        });

        const movesTab = document.createElement('button');
        movesTab.className = 'tab';
        movesTab.textContent = 'Moves';
        movesTab.addEventListener('click', (event) => {
            event.stopPropagation();
            this.showTab(detailsContainer, 'moves-section');
        });

        tabsContainer.appendChild(aboutTab);
        tabsContainer.appendChild(statsTab);
        tabsContainer.appendChild(movesTab);

        detailsContainer.appendChild(tabsContainer);

        // Sección Acerca de
        const aboutSection = document.createElement('div');
        aboutSection.className = 'about-section tab-content';

        const speciesItem = document.createElement('p');
        speciesItem.textContent = `Species: ${this.species} 🦸‍♂️`;
        aboutSection.appendChild(speciesItem);

        const heightItem = document.createElement('p');
        heightItem.textContent = `Height: ${this.height / 10} m 📏`;
        aboutSection.appendChild(heightItem);

        const weightItem = document.createElement('p');
        weightItem.textContent = `Weight: ${this.weight / 10} kg ⚖️`;
        aboutSection.appendChild(weightItem);

        const abilitiesItem = document.createElement('p');
        abilitiesItem.textContent = `Abilities: ${this.abilities.map(ability => ability.ability.name).join(', ')} ✨`;
        aboutSection.appendChild(abilitiesItem);

        const weaknessesItem = document.createElement('p');
        weaknessesItem.textContent = `Weaknesses: ${this.weaknesses.join(', ')} ⚔️`;
        aboutSection.appendChild(weaknessesItem);

        detailsContainer.appendChild(aboutSection);

        // Sección Stats
        const statsSection = document.createElement('div');
        statsSection.className = 'stats-section tab-content';

        const statsTitle = document.createElement('h4');
        statsTitle.textContent = '📊 Stats:';
        statsSection.appendChild(statsTitle);

        const statsList = document.createElement('ul');
        this.stats.forEach(stat => {
            const statItem = document.createElement('li');

            // Crear la barra de progreso
            const progressBarContainer = document.createElement('div');
            progressBarContainer.className = 'progress-bar-container';

            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            progressBar.style.width = `${stat.base_stat}%`;

            // Cambiar el color según el valor
            if (stat.base_stat < 50) {
                progressBar.classList.add('low');
            } else {
                progressBar.classList.add('high');
            }

            progressBarContainer.appendChild(progressBar);

            // Añadir el nombre del stat y la barra
            statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
            statItem.appendChild(progressBarContainer);

            statsList.appendChild(statItem);
        });
        statsSection.appendChild(statsList);

        detailsContainer.appendChild(statsSection);

        // Sección Moves
        const movesSection = document.createElement('div');
        movesSection.className = 'moves-section tab-content';

        const movesTitle = document.createElement('h4');
        movesTitle.textContent = '📜 Moves:';
        movesSection.appendChild(movesTitle);

        const movesList = document.createElement('ul');
        this.moves.slice(0, 5).forEach(move => {
            const moveItem = document.createElement('li');
            moveItem.textContent = move.move.name;
            movesList.appendChild(moveItem);
        });
        movesSection.appendChild(movesList);

        detailsContainer.appendChild(movesSection);

        card.appendChild(detailsContainer);

        card.querySelector('.select-btn').style.display = 'block'; // Mostrar el botón cuando se expande

        // Ajustar el scroll para que la tarjeta expandida esté visible
        const expandedCardRect = card.getBoundingClientRect();
        const scrollTarget = scrollTop + (expandedCardRect.top - cardRect.top);

        window.scrollTo({
            top: scrollTarget,
            behavior: 'smooth' // O 'auto' para desplazamiento instantáneo
        });

        // Forzar un reflow para activar la animación de la barra de progreso
        setTimeout(() => {
            const progressBars = card.querySelectorAll('.progress-bar');
            progressBars.forEach(bar => {
                bar.style.width = bar.style.width; // Reaplicar el ancho para activar la animación
            });
        }, 0);

        // Mostrar la primera pestaña por defecto
        this.showTab(detailsContainer, 'about-section');
    }

    showTab(container, tabClass) {
        const tabs = container.querySelectorAll('.tab-content');
        tabs.forEach(tab => {
            tab.style.display = 'none';
        });
        const activeTab = container.querySelector(`.${tabClass}`);
        if (activeTab) {
            activeTab.style.display = 'block';
        }
    }

    selectPokemon(card) {
        const selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons')) || [];
        const messageElement = document.getElementById('messages');
        const gifContainer = document.getElementById('gif-container');

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

            
            gifContainer.style.display = 'block';
            gifContainer.style.animation = 'none';
            gifContainer.offsetHeight; 

            setTimeout(() => {
                gifContainer.style.display = 'none';     
                showAlert('Pokémon seleccionado correctamente.');
            }, 3000);
      
            setTimeout(() => {
                
                location.reload();
            }, 6000);
            this.renderSelectedPokemons();
        } else if (selectedPokemons.some(pokemon => pokemon.id === this.id)) {

            
            gifContainer.style.display = 'block';
            gifContainer.style.animation = 'none';
            gifContainer.offsetHeight; 
            setTimeout(() => {
                gifContainer.style.display = 'none'; 
                
                showAlert('Este Pokémon ya está seleccionado.');
            }, 3000);

            setTimeout(() => {
                
                location.reload();
            }, 6000);
            

        } else {
            showAlert('Ya has seleccionado 6 Pokémon.');
        }
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
            const pokemonCard = pokemonInstance.createPokemonCard(pokemon, false, true); // No expandible, mostrar botón de eliminación
            selectedContainer.appendChild(pokemonCard);
        });
    }
}

export default Pokemon;
