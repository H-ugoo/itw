window.onload = function () {
    const favoritesKey = 'favorites_comp'; 
    const apiBaseUrl = 'http://192.168.160.58/Paris2024/API/competitions/'; 
    const favoritesTable = document.getElementById('favoritesTable');
    const noFavoritesAlert = document.getElementById('noFavorites');

    console.log("Initializing favorites display...");
    console.log(localStorage.getItem(favoritesKey));

    async function fetchCompetitionsDetails(sportId, name) {
        try {
            const response = await fetch(`${apiBaseUrl}?sportId=${sportId}&name=${encodeURIComponent(name)}`);
            if (!response.ok) throw new Error(`Failed to fetch data for sportId: ${sportId} and Name: ${name}`);           
            const data = await response.json();
            console.log(`Data fetched for competition ${sportId}:`, data);
 
            if (data && data.SportId === sportId && data.Name === name) {
                return data; 
            } else {
                console.warn("No competition data found for:", sportId, name);
                return null;
            }
        } catch (error) {
            console.error(`Error fetching competition ${sportId} - ${name}:`, error);
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

        for (const favorite of favoriteIds) {
            const competition = await fetchCompetitionsDetails(favorite.SportId, favorite.Name);

            if (competition) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${competition.SportId}</td>
                    <td>${competition.Name}</td>
                    <td>${competition.Tag || 'N/A'}</td>
                    <td><a href="./competitionsDetails.html?sportId=${competition.SportId}&name=${encodeURIComponent(competition.Name)}" class="btn btn-primary">View Details</a></td>
                    <td><button class="btn btn-danger removeFavorite" data-sportid="${competition.SportId}" data-name="${competition.Name}">Remove</button></td>
                `;
                favoritesTable.appendChild(row);
            } else {
                console.log(`Competition not found for ${favorite.SportId} - ${favorite.Name}`);
            }
        }
        const removeButtons = document.querySelectorAll('.removeFavorite');
        removeButtons.forEach(button => {
            button.addEventListener('click', removeFavorite);
    });
    }
    function removeFavorite(event) {
        const sportId = event.target.getAttribute('data-sportid');
        const name = event.target.getAttribute('data-name');
        const favorites = getFavoriteIds();
        const index = favorites.findIndex(fav => fav.SportId === sportId && fav.Name === name);
    
        if (index !== -1) {
            favorites.splice(index, 1);
            localStorage.setItem(favoritesKey, JSON.stringify(favorites));
            event.target.closest('tr').remove();
            alert(`${name} foi removido dos favoritos!`);
        }
    }

    displayFavorites();
};
