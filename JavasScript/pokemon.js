// Clase base para Pokémon
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
  
    // Método para dibujar el Pokémon individual en el DOM
    render() {
      const pokemonCard = document.createElement('div');
      pokemonCard.className = `pokemon-card ${this.types[0].type.name}`;
      pokemonCard.addEventListener('click', () => this.expandCard(pokemonCard));
  
      const pokemonImage = document.createElement('img');
      pokemonImage.src = this.sprites.front_default;
      pokemonImage.alt = this.name;
  
      const pokemonName = document.createElement('h3');
      pokemonName.textContent = this.name;
  
      // Contenedor para el ID del Pokémon
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
  
      pokemonCard.appendChild(pokemonImage);
      pokemonCard.appendChild(pokemonName);
      pokemonCard.appendChild(idContainer);
      pokemonCard.appendChild(typesContainer);
  
      return pokemonCard;
    }
  
    // Método para expandir la tarjeta al hacer clic
    async expandCard(card) {
      // Si ya se ha expandido, no hacer nada
      if (card.classList.contains('expanded')) {
        card.classList.remove('expanded');
        card.style.width = '150px'; // Revertir el tamaño original
        card.style.height = 'auto';
        card.querySelector('.details').remove();
        return;
      }
  
      // Marcar la tarjeta como expandida
      card.classList.add('expanded');
  
      // Obtener detalles del Pokémon
      await this.fetchDetails();
  
      // Crear el contenedor para los detalles
      const detailsContainer = document.createElement('div');
      detailsContainer.className = 'details';
  
      // Mostrar especie, altura, peso, tipos, habilidades y debilidades
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
  
      // Mostrar estadísticas
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
  
      // Mostrar movimientos
      const movesTitle = document.createElement('h4');
      movesTitle.textContent = 'Moves:';
      detailsContainer.appendChild(movesTitle);
  
      const movesList = document.createElement('ul');
      this.moves.slice(0, 5).forEach(move => { // Mostrar solo los primeros 5 movimientos
        const moveItem = document.createElement('li');
        moveItem.textContent = move.move.name;
        movesList.appendChild(moveItem);
      });
      detailsContainer.appendChild(movesList);
  
      // Añadir el contenedor de detalles a la tarjeta
      card.appendChild(detailsContainer);
    }
  
    // Método para obtener detalles del Pokémon
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
  
        // Obtener debilidades a partir del tipo
        const weaknessesResponse = await Promise.all(this.types.map(type => fetch(type.type.url).then(res => res.json())));
        const weaknesses = weaknessesResponse.map(response => response.damage_relations.double_damage_from.map(type => type.name));
        this.weaknesses = [].concat(...weaknesses);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    }
  
    // Método adicional para obtener el nombre de la especie
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
  }
  
  // Clase Pokedex
  class Pokedex {
    constructor() {
      this.pokemons = [];
    }
  
    // Método para obtener los primeros 150 Pokémon de la API
    async fetchPokemons() {
      const promises = [];
      for (let i = 1; i <= 150; i++) {
        promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then(response => response.json()));
      }
      const results = await Promise.all(promises);
      this.pokemons = results.map(pokeData => {
        const types = pokeData.types; // Obtener todos los tipos del Pokémon
        return new Pokemon(pokeData.id, pokeData.name, pokeData.sprites, types);
      });
    }
  
    // Método público para inicializar la Pokédex
    async drawPokedex() {
      await this.fetchPokemons();
      this.renderPokedex();
    }
  
    // Método privado para renderizar la Pokédex
    renderPokedex() {
      const container = document.createElement('div');
      container.className = 'pokedex-container';
  
      this.pokemons.forEach(pokemon => {
        container.appendChild(pokemon.render());
      });
  
      document.body.appendChild(container);
    }
  }
  
  // Inicializar la Pokédex cuando el DOM esté completamente cargado
  document.addEventListener('DOMContentLoaded', () => {
    const pokedex = new Pokedex();
    pokedex.drawPokedex();
  });
  
  // Función para obtener el color correspondiente a cada tipo de Pokémon
  function getTypeColor(typeName) {
    switch (typeName) {
      case 'grass': return '#78C850';
      case 'fire': return '#F08030';
      case 'water': return '#6890F0';
      case 'electric': return '#F8D030';
      case 'psychic': return '#F85888';
      case 'ice': return '#98D8D8';
      case 'dragon': return '#7038F8';
      case 'dark': return '#705848';
      case 'fairy': return '#EE99AC';
      case 'steel': return '#B8B8D0';
      case 'bug': return '#A8B820';
      case 'rock': return '#B8A038';
      case 'ghost': return '#705898';
      case 'fighting': return '#C03028';
      case 'poison': return '#A040A0';
      case 'flying': return '#A890F0';
      case 'normal': return '#A8A878';
      case 'ground': return '#E0C068';
      default: return '#FFFFFF';
    }
  }
  