document.addEventListener('DOMContentLoaded', function () {
    const favoritesKey = 'favorites_c'; 
    const apiBaseUrl = 'http://192.168.160.58/Paris2024/API/coaches/'; 
    const favoritesTable = document.getElementById('favoritesTable');
    const noFavoritesAlert = document.getElementById('noFavorites');

    console.log("Initializing favorites display...");


    async function fetchCoachesDetails(id) {
        try {
            const response = await fetch(`${apiBaseUrl}${id}`);
            if (!response.ok) throw new Error(`Failed to fetch data for ID: ${id}`);
            const data = await response.json();
            console.log(`Data fetched for coache ${id}:`, data);
            return data;
        } catch (error) {
            console.error(`Error fetching coache ${id}:`, error);
            return null;
        }
    }

    function getFavoriteIds() {
        try {
            const favorites = localStorage.getItem(favoritesKey);
            if (!favorites) {
                console.log("Não há favorites na localStorage.");
                return [];
            }
            const parsed = JSON.parse(favorites);
            console.log("Favorite IDs sacados da localStorage (we good):", parsed);
            return parsed;
        } catch (error) {
            console.error("Error a sacar favorites da localStorage (we not so good):", error);
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
            const coache = await fetchCoachesDetails(id);
            if (coache) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${coache.Id}</td>
                    <td>${coache.Name}</td>
                    <td>${coache.Function}</td>
                    <td>${coache.Sex || 'N/A'}</td>
                    <td><a href="./coachesDetails.html?id=${coache.Id}" class="btn btn-primary">View Details</a></td>
                    <td><button class="btn btn-danger removeFavorite" data-id="${coache.Id}">Remover</button></td>
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
            console.log(`nao quero ID: ${Id}`);
            localStorage.setItem(favoritesKey, JSON.stringify(favorites));
            event.target.closest('tr').remove();
            alert(`ID: ${Id} foi removido dos favoritos!`);
        } else {
            console.error(`ID ${Id} not found in favoritos.`);
        }
        
    }   
    displayFavorites();
});
