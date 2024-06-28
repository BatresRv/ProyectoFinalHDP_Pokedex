import Pokemon from './pokemon.js';

class Pokedex {
    constructor() {
        this.pokemons = [];
    }

    async fetchPokemons() {
        const promises = [];
        for (let i = 1; i <= 150; i++) {
            promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then(response => response.json()));
        }
        const results = await Promise.all(promises);
        this.pokemons = results.map(pokeData => {
            const types = pokeData.types;
            return new Pokemon(pokeData.id, pokeData.name, pokeData.sprites, types);
        });
    }

    async dibujarPokedex() {
        await this.fetchPokemons();
        const container = document.createElement('div');
        container.className = 'pokedex-container';

        this.pokemons.forEach(pokemon => {
            container.appendChild(pokemon.render());
        });

        document.body.appendChild(container);
    }

    renderSelectedPokemons() {
        const selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons')) || [];
        const selectedContainer = document.querySelector('.selected-pokemons');

        selectedContainer.innerHTML = '';

        selectedPokemons.forEach(pokemon => {
            const pokemonInstance = new Pokemon(pokemon.id, pokemon.name, pokemon.sprites, pokemon.types);
            const pokemonCard = pokemonInstance.render(false, true); // No expandible, mostrar botón de eliminación
            selectedContainer.appendChild(pokemonCard);
        });
    }
}

export default Pokedex;