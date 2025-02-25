// Archivo: assets/app.js

$(document).ready(function() {
    const accessToken = 'd2bfe1c6f55b0dd613d19dc680f41bdd';
    const apiUrl = `https://www.superheroapi.com/api.php/${accessToken}/`;

    $('#search-form').on('submit', function(event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        const heroId = $('#hero-id').val().trim(); // Obtener y limpiar el valor del input

        // Validación: comprobar que el ID es un número entero positivo
        if (!/^\d+$/.test(heroId)) {
            showAlert('Por favor, ingresa un ID válido (número entero positivo).', 'danger');
            return;
        }

        // Realizar la solicitud AJAX a la API
        $.ajax({
            url: apiUrl + heroId,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.response === 'success') {
                    renderHeroInfo(data); // Mostrar la información del héroe
                } else {
                    showAlert('No se encontró un superhéroe con ese ID.', 'warning');
                }
            },
            error: function() {
                showAlert('Ocurrió un error al conectar con la API. Por favor, intenta nuevamente más tarde.', 'danger');
            }
        });
    });

    // Función para mostrar alertas en la página
    function showAlert(message, type) {
        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        $('#hero-info').html(alertHtml);
    }

    // Función para renderizar la información del superhéroe
    function renderHeroInfo(hero) {
        const stats = hero.powerstats;
        const biography = hero.biography;
        const appearance = hero.appearance;
        const work = hero.work;
        const connections = hero.connections;
        const image = hero.image.url;

        const heroHtml = `
            <div class="col-md-8">
                <div class="card mb-4">
                    <div class="row g-0">
                        <div class="col-md-4 text-center align-self-center">
                            <img src="${image}" class="img-fluid rounded-start" alt="${hero.name}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${hero.name}</h5>
                                <p class="card-text"><strong>Nombre Completo:</strong> ${biography['full-name'] || 'Desconocido'}</p>
                                <p class="card-text"><strong>Alias:</strong> ${biography.aliases.join(', ') || 'Desconocidos'}</p>
                                <p class="card-text"><strong>Ocupación:</strong> ${work.occupation || 'Desconocida'}</p>
                                <p class="card-text"><strong>Primera Aparición:</strong> ${biography['first-appearance'] || 'Desconocida'}</p>
                                <p class="card-text"><strong>Conexiones:</strong> ${connections['relatives'] || 'Desconocidas'}</p>
                                <p class="card-text"><strong>Editorial:</strong> ${biography.publisher || 'Desconocida'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="hero-stats" class="card p-4">
                    <h5 class="text-center mb-4">Estadísticas de Poder</h5>
                    <div id="statsChart" style="height: 370px; width: 100%;"></div>
                </div>
            </div>
        `;

        $('#hero-info').html(heroHtml);

        renderStatsChart(stats, hero.name); // Renderizar el gráfico de estadísticas
    }

    // Función para renderizar el gráfico de estadísticas con CanvasJS
    function renderStatsChart(stats, heroName) {
        const dataPoints = [];

        for (let stat in stats) {
            if (stats[stat] !== 'null') {
                dataPoints.push({
                    label: capitalizeFirstLetter(stat),
                    y: parseInt(stats[stat])
                });
            }
        }

        const chart = new CanvasJS.Chart("statsChart", {
            animationEnabled: true,
            theme: "light2",
            title: {
                text: `Poderes de ${heroName}`
            },
            data: [{
                type: "pie",
                indexLabel: "{label}: {y}",
                startAngle: -90,
                dataPoints: dataPoints
            }]
        });

        chart.render();
    }

    // Función para capitalizar la primera letra de una palabra
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});
