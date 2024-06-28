import Pokedex from './pokedex.js';

document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;

    if (currentPage.includes('pokemon.html')) {
        const pokedex = new Pokedex();
        pokedex.dibujarPokedex();
        
    } else if (currentPage.includes('companions.html')) {
        const pokedex = new Pokedex();
        pokedex.renderSelectedPokemons();
    }
});
