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

export { getTypeColor };
