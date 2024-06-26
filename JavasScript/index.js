import Pokedex from './pokedex.js';
import Pokemon from './pokemon.js';

document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;

    if (currentPage.includes('pokemon.html')) {
        // Lógica para la página principal
        const pokedex = new Pokedex();
        pokedex.drawPokedex();
        
    } else if (currentPage.includes('companions.html')) {
        // Lógica para la página de acompañantes
        Pokemon.prototype.renderSelectedPokemons();
    }
});
