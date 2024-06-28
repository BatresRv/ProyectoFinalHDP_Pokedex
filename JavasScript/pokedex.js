import Pokemon from './pokemon.js'; // Importando la clase Pokemon 

class Pokedex {
    constructor() {
        this.pokemons = []; // Inicializando un arreglo vacío para almacenar los Pokémon
    }

    // Método para obtener datos de los primeros 150 Pokémon
    async fetchPokemons() {
        const promises = []; // Arreglo para almacenar las promesas de fetch

        // Iterando del 1 al 150 para crear promesas de fetch para cada Pokémon
        for (let i = 1; i <= 150; i++) {
            promises.push(
                fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
                    .then(response => response.json()) // Convierte la respuesta en JSON
            );
        }

        // Esperando a que todas las promesas se resuelvan y almacene los resultados
        const results = await Promise.all(promises);

        // Mapeando los resultados para crear instancias de la clase Pokemon y almacenarlas en this.pokemons
        this.pokemons = results.map(pokeData => {
            const types = pokeData.types; // Obtiene los tipos del Pokémon
            return new Pokemon(pokeData.id, pokeData.name, pokeData.sprites, types); // Creando una nueva instancia de Pokemon
        });
    }

    // Método para dibujar la Pokédex en la página
    async dibujarPokedex() {
        await this.fetchPokemons(); // Llamando al método fetchPokemons para obtener los datos de los Pokémon

        const container = document.createElement('div'); // Creando un nuevo div para contener la Pokédex
        container.className = 'pokedex-container'; // Asignando una clase al contenedor

        // Iterando sobre los Pokémon y agregando su representación al contenedor
        this.pokemons.forEach(pokemon => {
            container.appendChild(pokemon.render());
        });

        document.body.appendChild(container); // Agregando el contenedor 
    }

    // Método para renderizar los Pokémon seleccionados desde el localStorage
    renderSelectedPokemons() {
        // Obteniedno los Pokémon seleccionados desde el localStorage o un arreglo vacío si no hay ninguno
        const selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons')) || [];
        const selectedContainer = document.querySelector('.selected-pokemons'); // Seleccionando el contenedor para los Pokémon seleccionados

        selectedContainer.innerHTML = ''; // Limpiando el contenedor

        // Iterando sobre los Pokémon seleccionados y agregando su representación al contenedor
        selectedPokemons.forEach(pokemon => {
            const pokemonInstance = new Pokemon(pokemon.id, pokemon.name, pokemon.sprites, pokemon.types); // Creando una nueva instancia de Pokemon
            const pokemonCard = pokemonInstance.render(false, true); // Renderizando el Pokémon 
            selectedContainer.appendChild(pokemonCard); // Agregando la tarjeta del Pokémon al contenedor
        });
    }
}

export default Pokedex; 
