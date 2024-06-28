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

    // Métodopara obtener los detalles del Pokémon 
    async fetchDetails() {
        if (this.stats && this.moves) return;

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${this.id}`);
            const data = await response.json();

            // Asignado los detalles 
            this.species = await this.fetchSpecies(data.species.url);
            this.height = data.height;
            this.weight = data.weight;
            this.abilities = data.abilities;
            this.stats = data.stats;
            this.moves = data.moves;

            // Obteniendi las debilidades del Pokémon
            const weaknessesResponse = await Promise.all(this.types.map(type => fetch(type.type.url).then(res => res.json())));
            const weaknesses = weaknessesResponse.map(response => response.damage_relations.double_damage_from.map(type => type.name));
            this.weaknesses = [].concat(...weaknesses);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Método para obtener la species del Pokémon 
    async fetchSpecies(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.name;
        } catch (error) {
            console.error('Error:', error);
            return 'Error'; 
        }
    }

    // Método para crear la tarjeta de un Pokémon
    createPokemonCard(expandable = true, showRemoveButton = false) {
        const pokemonCard = document.createElement('div');
        pokemonCard.className = `pokemon-card ${this.types[0].type.name}`;
        pokemonCard.style.backgroundColor = getTypeColor(this.types[0].type.name);

        if (expandable) {
            pokemonCard.addEventListener('click', () => this.expandCard(pokemonCard));
        }

        const pokemonImage = document.createElement('img');
        pokemonImage.src = this.sprites.front_default;
        pokemonImage.alt = this.name;

        const pokemonName = document.createElement('h3');
        pokemonName.textContent = this.name;

        const idContainer = document.createElement('div');
        idContainer.className = 'id-container';
        const pokemonId = document.createElement('span');
        pokemonId.textContent = this.id;
        idContainer.appendChild(pokemonId);

        const typesContainer = document.createElement('div');
        typesContainer.className = 'types-container';

        this.types.forEach(type => {
            const typeCircle = document.createElement('div');
            typeCircle.className = 'type-circle';
            typeCircle.textContent = type.type.name;
            typeCircle.style.backgroundColor = getTypeColor(type.type.name);
            typesContainer.appendChild(typeCircle);
        });

        const selectButton = document.createElement('button');
        selectButton.className = 'select-btn';
        selectButton.textContent = 'Atrapar';
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
            removeButton.textContent = 'Liberar';
            removeButton.addEventListener('click', (event) => {
                event.stopPropagation();
                this.removePokemon(this.id);
            });
            pokemonCard.appendChild(removeButton);
        }

        return pokemonCard;
    }

    // Método para renderizar la tarjeta del Pokémon
    render(expandable = true, showRemoveButton = false) {
        return this.createPokemonCard(expandable, showRemoveButton);
    }

    // Método para expandir la tarjeta del Pokémon y mostrar detalles adicionales
    async expandCard(card) {
        if (card.classList.contains('expanded')) {
            card.classList.remove('expanded');
            card.style.width = '';
            card.style.height = '';
            card.querySelector('.details').remove();
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

    // Método para seleccionar un Pokémon
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

        // Verificamos si aún no se han seleccionado 6 Pokémon y si el Pokémon ya ha sido seleccionado 
        if (selectedPokemons.length < 6 && !selectedPokemons.some(pokemon => pokemon.id === this.id)) {
            selectedPokemons.push({
                id: this.id,
                name: this.name,
                sprites: this.sprites,
                types: this.types
            });
            localStorage.setItem('selectedPokemons', JSON.stringify(selectedPokemons));  


            gifContainer.style.display = 'block';
            gifContainer.offsetHeight; 

            setTimeout(() => {
                gifContainer.style.display = 'none';     
                showAlert('Pokémon atrapado correctamente.');
            }, 3000);

            setTimeout(() => {
                location.reload();
            }, 6000);

            this.renderSelectedPokemons();

        } else if (selectedPokemons.some(pokemon => pokemon.id === this.id)) {

            gifContainer.style.display = 'block';

            setTimeout(() => {
                gifContainer.style.display = 'none'; 
                showAlert('Este Pokémon no se pudo atrapar.');
            }, 3000);

            setTimeout(() => {
                location.reload();
            }, 6000);

        } else {
            showAlert('Ya has capturado 6 Pokémon.');
        }
        
    }
    
    // Método para eliminar un Pokémon seleccionado
    removePokemon(pokemonId) {
        // Obtenemos la lista de Pokémon 
        let selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons')) || [];

        // Filtramos el array para eliminar el Pokémon por id 
        selectedPokemons = selectedPokemons.filter(pokemon => pokemon.id !== pokemonId);

        // Guardamos el array actualizado de nuevo 
        localStorage.setItem('selectedPokemons', JSON.stringify(selectedPokemons));

        // Volvemos a renderizar los Pokémon 
        this.renderSelectedPokemons();
    }

    
    // Método para renderizar los Pokémon desde el localStorage
    renderSelectedPokemons() {
        // Obtenemos la lista de Pokémon seleccionados 
        const selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons')) || [];

        const selectedContainer = document.querySelector('.selected-pokemons');

        selectedContainer.innerHTML = '';

        // Iteramos sobre cada Pokémon 
        selectedPokemons.forEach(pokemon => {

            // Creando una instancia de la clase Pokemon con los datos del Pokémon actual
            const pokemonInstance = new Pokemon(pokemon.id, pokemon.name, pokemon.sprites, pokemon.types);
            // Usamos false para que la tarjeta no sea expanda y true para mostrar el boton
            const pokemonCard = pokemonInstance.render(false, true);

            selectedContainer.appendChild(pokemonCard);
        });
    }

}

export default Pokemon;
