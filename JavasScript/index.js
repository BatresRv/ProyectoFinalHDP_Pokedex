import Pokedex from './pokedex.js'; // Importando la clase Pokedex 

document.addEventListener('DOMContentLoaded', () => {

    const currentPage = window.location.pathname; // Obtiniendo la ruta de la página actual

    if (currentPage.includes('pokemon.html')) {

        // Si la ruta de la página actual pokemon.html
        const pokedex = new Pokedex(); // Crea una nueva instancia de la clase Pokedex
        pokedex.dibujarPokedex(); // Llamando al método dibujarPokedex de la instancia para mostrar la Pokedex 

    } else if (currentPage.includes('companions.html')) {

        // Si la ruta de la página actual companions.html
        const pokedex = new Pokedex(); // Crea una nueva instancia de la clase Pokedex
        pokedex.renderSelectedPokemons(); // Llama al método renderSelectedPokemons para mostrar los Pokémon seleccionados en la página
    }
});