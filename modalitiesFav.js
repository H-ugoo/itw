document.addEventListener('DOMContentLoaded', function () {
    const favoritesKey = 'favorites_s'; 
    const apiBaseUrl = 'http://192.168.160.58/Paris2024/API/sports/'; 
    const favoritesTable = document.getElementById('favoritesTable');
    const noFavoritesAlert = document.getElementById('noFavorites');

    console.log("Initializing favorites display...");
    async function fetchSportsDetails(id) {
        try {
            const response = await fetch(`${apiBaseUrl}${id}`);
            if (!response.ok) throw new Error(`Failed to fetch data for ID: ${id}`);
            const data = await response.json();
            console.log(`Data fetched for team ${id}:`, data);
            return data;
        } catch (error) {
            console.error(`Error fetching team ${id}:`, error);
            return null;
        }
    }

    function getFavoriteIds() {
        try {
            const favorites = localStorage.getItem(favoritesKey);
            if (!favorites) {
                console.log("No favorites in localStorage.");
                return [];
            }
            const parsed = JSON.parse(favorites);
            console.log("Favorite IDs fetched from localStorage:", parsed);
            return parsed;
        } catch (error) {
            console.error("Error parsing favorites from localStorage:", error);
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
            const sport = await fetchSportsDetails(id);
            if (sport) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${sport.Id}</td>
                    <td>${sport.Name}</td>
                    <td>${sport.Competitions.length || 'N/A'}</td>
                    <td>${sport.Teams.length}</td>
                    <td>${sport.Athletes.length}</td>
                    <td class="align-middle">
                    <img src="${sport.Pictogram}" alt="Pictogram" style="max-width: 50px; max-height: 50px;">
                    </td>
                    <td><a href="./modalitiesDetails.html?id=${sport.Id}" class="btn btn-primary">View Details</a></td>
                    <td><button class="btn btn-danger removeFavorite" data-id="${sport.Id}">Remover</button></td>
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
        const index = favorites.indexOf(Id);
        
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
});
