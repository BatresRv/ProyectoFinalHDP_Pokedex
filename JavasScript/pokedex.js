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

    async drawPokedex() {
        await this.fetchPokemons();
        this.#renderPokedex();
    }

    #renderPokedex() {
        const container = document.createElement('div');
        container.className = 'pokedex-container';

        this.pokemons.forEach(pokemon => {
            container.appendChild(pokemon.render());
        });

        document.body.appendChild(container);
    }
}

export default Pokedex;
