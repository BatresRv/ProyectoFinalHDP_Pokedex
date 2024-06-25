function crearEntrenador(entrenador) {
    const divEntrenador = document.createElement('div');
    divEntrenador.classList.add('entrenador'); // Clase CSS para estilos

    // Construir el contenido del entrenador con todos los datos
    divEntrenador.innerHTML = `
        <h3><i class="fas fa-user"></i> ${entrenador.nombre} ${entrenador.apellido}</h3>
        <p><i class="fas fa-birthday-cake"></i> Edad: ${entrenador.edad}</p>
        <p><i class="fas fa-graduation-cap"></i> Carrera: ${entrenador.carrera}</p>
        <p><i class="fas fa-hiking"></i> Hobby: ${entrenador.hobby}</p>
        <button class="asignar-pokemon-btn"><i class="fas fa-paw"></i> Asignar Pokémon</button>
    `;

    // Agregar el entrenador al contenedor
    const contenedorEntrenadores = document.getElementById('entrenadores-container');
    contenedorEntrenadores.appendChild(divEntrenador);
}

document.addEventListener('DOMContentLoaded', function() {
    const entrenadores = [
        { nombre: 'Yoss', apellido: 'Joya', edad: 25, carrera: 'Ingeniería Informática', hobby: 'Pintar' },
        { nombre: 'Anto', apellido: 'Retana', edad: 23, carrera: 'Ingeniería Informática', hobby: 'Leer' },
        { nombre: 'Carlos', apellido: 'Martínez', edad: 28, carrera: 'Ingeniería Informática', hobby: 'Deportes' },
        { nombre: 'Alii', apellido: 'Rodríguez', edad: 24, carrera: 'Ingeniería Informática', hobby: 'Cocinar' },
        { nombre: 'Marvin', apellido: 'Batrez', edad: 27, carrera: 'Ingeniería Informática', hobby: 'Viajar' }
    ];

    // Iterar sobre cada entrenador y llamar a crearEntrenador
    entrenadores.forEach(entrenador => {
        crearEntrenador(entrenador);
    });
});
