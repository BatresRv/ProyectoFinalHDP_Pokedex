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

    render() {
        const pokemonCard = document.createElement('div');
        pokemonCard.className = `pokemon-card ${this.types[0].type.name}`;
        pokemonCard.addEventListener('click', () => this.expandCard(pokemonCard));

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
        selectButton.addEventListener('click', (event) => {
            event.stopPropagation();
            this.selectPokemon();
        });

        pokemonCard.appendChild(pokemonImage);
        pokemonCard.appendChild(pokemonName);
        pokemonCard.appendChild(idContainer);
        pokemonCard.appendChild(typesContainer);
        pokemonCard.appendChild(selectButton);

        return pokemonCard;
    }

    async expandCard(card) {
        if (card.classList.contains('expanded')) {
            card.classList.remove('expanded');
            card.style.width = '150px';
            card.style.height = 'auto';
            card.querySelector('.details').remove();
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
    }

    selectPokemon() {
        console.log(`¡Has seleccionado a ${this.name}!`);
    }
}

export default Pokemon;

