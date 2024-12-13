window.onload = function () {
    const favoritesKey = 'favorites'; 
    const apiBaseUrl = 'http://192.168.160.58/Paris2024/API/athletes/';
    const favoritesTable = document.getElementById('favoritesTable');
    const noFavoritesAlert = document.getElementById('noFavorites');

    console.log("Initializing favorites display...");

    async function fetchAthleteDetails(Id) {
        try {
            const response = await fetch(`${apiBaseUrl}${Id}`);
            if (!response.ok) throw new Error(`Failed to fetch data for ID: ${Id}`);
            const data = await response.json();
            console.log(`Data fetched for ${Id}:`, data);
            if (data && data.Id === Id) {
                return data; 
            } else {
                console.warn("No athlete data found for:", Id);
                return null;
            }
        } catch (error) {
            console.error(`Erro ao buscar o atleta ${Id}:`, error);
            return null;
        }
    }

    // Função para sacar os IDs dos favoritos do localStorage
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
    async function displayFavorites() {
        const favoriteIds = getFavoriteIds(); 

        if (favoriteIds.length === 0) {
            noFavoritesAlert.style.display = 'block';
            return;
        }
        for (const id of favoriteIds) {
            const athlete = await fetchAthleteDetails(id);
            if (athlete) {
                const row = document.createElement('tr'); 
                row.innerHTML = `
                    <td>${athlete.Id}</td>
                    <td>${athlete.Name}</td>
                    <td>${athlete.BirthDate ? athlete.BirthDate.split('T')[0] : 'N/A'}</td>
                    <td>${athlete.BirthCountry || 'N/A'}</td>
                    <td>${athlete.BirthPlace || 'N/A'}</td>
                    <td>${athlete.Sex || 'N/A'}</td>
                    <td><a href="./athleteDetails.html?id=${athlete.Id}" class="btn btn-primary">Ver Detalhes</a></td>
                    <td><button class="btn btn-danger removeFavorite" data-id="${athlete.Id}">Remover</button></td>

                `;
                favoritesTable.appendChild(row); 
            }
        }
        const removeButtons = document.querySelectorAll('.removeFavorite');
        removeButtons.forEach(button => {
            
            button.addEventListener('click', removeFavorite);
        });
    }
    
    function removeFavorite(event) {
        const Id = event.target.getAttribute('data-id'); 
        const favorites = getFavoriteIds(); 
        const index = favorites.indexOf(Number(Id));  
        if (index !== -1) { 
            favorites.splice(index, 1);
            console.log(`na quero ID: ${Id}`);
            localStorage.setItem(favoritesKey, JSON.stringify(favorites));
            event.target.closest('tr').remove();
            alert(`ID ${Id} foi removido dos favoritos!`);
        } else {
            console.error(`ID ${Id} not found in favorites.`);
        }
        
    }
    
    displayFavorites();
};
