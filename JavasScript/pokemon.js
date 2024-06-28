import { getTypeColor } from './utils.js'; // Importando getTypeColor 

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

    // Método para obtener los detalles del Pokémon 
    async fetchDetails() {
        if (this.stats && this.moves) return; // Si ya tiene estadísticas y movimientos no hace nada

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${this.id}`);
            const data = await response.json();

            // Asignando los detalles del Pokémon obtenidos desde la API
            this.species = await this.fetchSpecies(data.species.url);
            this.height = data.height;
            this.weight = data.weight;
            this.abilities = data.abilities;
            this.stats = data.stats;
            this.moves = data.moves;

            // Obteniendo las debilidades del Pokémon
            const weaknessesResponse = await Promise.all(this.types.map(type => fetch(type.type.url).then(res => res.json())));
            const weaknesses = weaknessesResponse.map(response => response.damage_relations.double_damage_from.map(type => type.name));
            this.weaknesses = [].concat(...weaknesses);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Método para obtener la especie del Pokémon desde la API
    async fetchSpecies(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.name;
        } catch (error) {
            console.error('Error:', error);
            return 'Unknown'; // En caso de error retorna Unknown
        }
    }

    // Método para crear la tarjeta del Pokémon
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
        selectButton.textContent = 'Seleccionar';
        selectButton.style.display = 'none'; // Ocultando botón

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

    // Método para expandir la tarjeta del Pokémon 
    async expandCard(card) {
        if (card.classList.contains('expanded')) {
            card.classList.remove('expanded');
            card.style.width = '';
            card.style.height = '';
            card.querySelector('.details').remove();
            card.querySelector('.select-btn').style.display = 'none'; // Ocultar el botón cuando se contrae
            return;
        }

        // Obteniendo la posición actual de la tarjeta seleccionada
        const cardRect = card.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        card.classList.add('expanded');
        await this.fetchDetails();

        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'details';

        // Sección About
        const aboutSection = document.createElement('div');
        aboutSection.className = 'about-section';

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

        // Sección Stats y Moves
        const statsMovesSection = document.createElement('div');
        statsMovesSection.className = 'stats-moves-section';

        const statsTitle = document.createElement('h4');
        statsTitle.textContent = '📊 Stats:';
        statsMovesSection.appendChild(statsTitle);

        const statsList = document.createElement('ul');
        this.stats.forEach(stat => {
            const statItem = document.createElement('li');

            // Creando la barra de progreso
            const progressBarContainer = document.createElement('div');
            progressBarContainer.className = 'progress-bar-container';

            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            progressBar.style.width = `${stat.base_stat}%`;

            // Cambiando el color según el valor
            if (stat.base_stat < 50) {
                progressBar.classList.add('low');
            } else {
                progressBar.classList.add('high');
            }

            progressBarContainer.appendChild(progressBar);

            // Añadiendo el nombre del stat y la barra
            statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
            statItem.appendChild(progressBarContainer);

            statsList.appendChild(statItem);
        });
        statsMovesSection.appendChild(statsList);

        const movesTitle = document.createElement('h4');
        movesTitle.textContent = '📜 Moves:';
        statsMovesSection.appendChild(movesTitle);

        const movesList = document.createElement('ul');
        this.moves.slice(0, 5).forEach(move => {
            const moveItem = document.createElement('li');
            moveItem.textContent = move.move.name;
            movesList.appendChild(moveItem);
        });
        statsMovesSection.appendChild(movesList);

        detailsContainer.appendChild(statsMovesSection);

        card.appendChild(detailsContainer);

        card.querySelector('.select-btn').style.display = 'block'; // Mostrar el botón cuando se expande

        // Ajustando el scroll para que la tarjeta expandida esté visible
        const expandedCardRect = card.getBoundingClientRect();
        const scrollTarget = scrollTop + (expandedCardRect.top - cardRect.top);

        window.scrollTo({
            top: scrollTarget,
            behavior: 'smooth' // Desplazamiento instantáneo
        });

        // Reflow para activar la animación de la barra de progreso
        setTimeout(() => {
            const progressBars = card.querySelectorAll('.progress-bar');
            progressBars.forEach(bar => {
                bar.style.width = bar.style.width; // Reaplicando el ancho para activar la animación
            });
        }, 0);
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
            }, 3000); 
        }

        // Limpiando mensajes anteriores
        messageElement.innerHTML = '';

        if (selectedPokemons.length < 6 && !selectedPokemons.some(pokemon => pokemon.id === this.id)) {
            selectedPokemons.push({
                id: this.id,
                name: this.name,
                sprites: this.sprites,
                types: this.types
            });
            localStorage.setItem('selectedPokemons', JSON.stringify(selectedPokemons));  

            // Mostrando gif 
            gifContainer.style.display = 'block';
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
    
    // Método para eliminar un Pokémon seleccionado
    removePokemon(pokemonId) {
    let selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons')) || []; // Obteniendo el arreglo de Pokémon seleccionados desde el localStorage
    selectedPokemons = selectedPokemons.filter(pokemon => pokemon.id !== pokemonId); // Filtrando el arreglo para excluir el Pokémon con el ID seleccionado

    localStorage.setItem('selectedPokemons', JSON.stringify(selectedPokemons)); // Actualizando el localStorage con el nuevo arreglo de Pokémon seleccionados
    
    this.renderSelectedPokemons();   // Vuelviendo a renderizar la lista de Pokémon 
}

    
    // Método para renderizar los Pokémon seleccionados 
    renderSelectedPokemons() {
        const selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons')) || []; // Obteniedno el arreglo de Pokémon seleccionado
        const selectedContainer = document.querySelector('.selected-pokemons'); // Seleccionando el contenedor en el que se mostrarán los Pokémon
    
        selectedContainer.innerHTML = ''; // Limpiando el contenedor
        // Iterando sobre el arreglo de Pokémon seleccionados
        selectedPokemons.forEach(pokemon => {
            // Creando una nueva instancia de la clase Pokemon para cada Pokémon seleccionado
            const pokemonInstance = new Pokemon(pokemon.id, pokemon.name, pokemon.sprites, pokemon.types);
            const pokemonCard = pokemonInstance.render(false, true); // No expandible, mostrar botón de eliminación
            
            selectedContainer.appendChild(pokemonCard);
        });
    }
    
}
export default Pokemon; 
