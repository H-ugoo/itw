document.addEventListener('DOMContentLoaded', function () {
    const favoritesKey = 'favorites'; // Chave usada no localStorage
    const apiBaseUrl = 'http://192.168.160.58/Paris2024/API/athletes/'; // Substitua pelo endpoint da API real
    const favoritesTable = document.getElementById('favoritesTable');
    const noFavoritesAlert = document.getElementById('noFavorites');

    console.log("Inicializando a exibição dos favoritos...");

    // Função para buscar detalhes do atleta a partir da API
    async function fetchAthleteDetails(id) {
        try {
            const response = await fetch(`${apiBaseUrl}${id}`);
            if (!response.ok) throw new Error(`Falha ao buscar dados para o ID: ${id}`);
            const data = await response.json();
            console.log(`Dados buscados para o atleta ${id}:`, data);
            return data;
        } catch (error) {
            console.error(`Erro ao buscar o atleta ${id}:`, error);
            return null;
        }
    }

    // Função para obter os IDs dos favoritos do localStorage
    function getFavoriteIds() {
        try {
            const favorites = localStorage.getItem(favoritesKey);
            if (!favorites) {
                console.log("Não há favoritos no localStorage.");
                return [];
            }
            const parsed = JSON.parse(favorites);
            console.log("IDs dos favoritos obtidos do localStorage:", parsed);
            return parsed;
        } catch (error) {
            console.error("Erro ao analisar os favoritos do localStorage:", error);
            return [];
        }
    }

    // Função para remover um atleta dos favoritos
    function removeFavorite(event) {
        const athleteId = event.target.getAttribute('data-sportid'); // Acessa o atributo 'data-sportid'
        const favorites = getFavoriteIds(); // Obtém os IDs dos favoritos do localStorage
        const index = favorites.indexOf(athleteId); // Encontra o índice do ID

        if (index !== -1) {
            // Se o favorito for encontrado, remove-o
            favorites.splice(index, 1);
            localStorage.setItem(favoritesKey, JSON.stringify(favorites)); // Atualiza o localStorage
            event.target.closest('tr').remove(); // Remove a linha da tabela
        }

        alert(`Atleta com ID ${athleteId} foi removido dos favoritos.`);
    }

    // Função para exibir os atletas favoritos na tabela
    async function displayFavorites() {
        const favoriteIds = getFavoriteIds(); // Obtém os IDs dos favoritos do localStorage

        // Verifica se não há favoritos
        if (favoriteIds.length === 0) {
            noFavoritesAlert.style.display = 'block';
            return;
        }

        // Loop pelos IDs dos favoritos e busca os detalhes dos atletas
        for (const id of favoriteIds) {
            const athlete = await fetchAthleteDetails(id); // Obtém os dados do atleta pela API
            if (athlete) {
                const row = document.createElement('tr'); // Cria uma nova linha para a tabela
                row.innerHTML = `
                    <td>${athlete.Id}</td>
                    <td>${athlete.Name}</td>
                    <td>${athlete.BirthDate ? athlete.BirthDate.split('T')[0] : 'N/A'}</td>
                    <td>${athlete.BirthCountry || 'N/A'}</td>
                    <td>${athlete.BirthPlace || 'N/A'}</td>
                    <td>${athlete.Sex || 'N/A'}</td>
                    <td><a href="./athleteDetails.html?id=${athlete.Id}" class="btn btn-primary">Ver Detalhes</a></td>
                    <td><button class="btn btn-danger removeFavorite" data-sportid="${athlete.Id}">Remover</button></td>
                `;
                favoritesTable.appendChild(row); // Adiciona a linha à tabela
            }
        }

        // Adiciona event listeners para os botões de remover
        const removeButtons = document.querySelectorAll('.removeFavorite');
        removeButtons.forEach(button => {
            button.addEventListener('click', removeFavorite);
        });
    }

    // Inicializa a exibição dos favoritos
    displayFavorites();
});
