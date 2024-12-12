document.addEventListener('DOMContentLoaded', function () {
    const favoritesKey = 'favorites_t'; // Key used in localStorage
    const apiBaseUrl = 'http://192.168.160.58/Paris2024/API/teams/'; // Replace with the actual API endpoint
    const favoritesTable = document.getElementById('favoritesTable');
    const noFavoritesAlert = document.getElementById('noFavorites');

    console.log("Initializing favorites display...");

    // Function to fetch athlete details from API
    async function fetchteamsDetails(id) {
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

    // Function to get favorite IDs from localStorage
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

    // Function to populate the table with athlete data
    async function displayFavorites() {
        const favoriteIds = getFavoriteIds();

        // Check if there are no favorites
        if (favoriteIds.length === 0) {
            noFavoritesAlert.style.display = 'block';
            return;
        }

        for (const id of favoriteIds) {
            const team = await fetchteamsDetails(id);
            if (team) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${team.Id}</td>
                    <td>${team.Name}</td>
                    <td>${team.Sex || 'N/A'}</td>
                    <td>${team.NOC.Name}</td>
                    <td>${team.Sport.Id}</td>
                    <td><a href="./teamsDetails.html?id=${team.Id}" class="btn btn-primary">View Details</a></td>
                `;
                favoritesTable.appendChild(row);
            }
        }
    }

    // Initialize the page by displaying favorites
    displayFavorites();
});
