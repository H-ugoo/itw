document.addEventListener('DOMContentLoaded', function () {
    const favoritesKey = 'favorites_c'; // Key used in localStorage
    const apiBaseUrl = 'http://192.168.160.58/Paris2024/API/coaches/'; // Replace with the actual API endpoint
    const favoritesTable = document.getElementById('favoritesTable');
    const noFavoritesAlert = document.getElementById('noFavorites');

    console.log("Initializing favorites display...");

    // Function to fetch athlete details from API
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
            const coache = await fetchCoachesDetails(id);
            if (coache) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${coache.Id}</td>
                    <td>${coache.Name}</td>
                    <td>${coache.Function}</td>
                    <td>${coache.Sex || 'N/A'}</td>
                    <td><a href="./coachesDetails.html?id=${coache.Id}" class="btn btn-primary">View Details</a></td>
                `;
                favoritesTable.appendChild(row);
            }
        }
    }

    // Initialize the page by displaying favorites
    displayFavorites();
});
