function extractCoordinatesFromURL() {
    const url = window.location.href; // Obtem a URL atual Bueda fixe
    const regex = /long=([-+]?[0-9]*\.?[0-9]+)lat=([-+]?[0-9]*\.?[0-9]+)/;
    const match = url.match(regex);

    if (match) {
        return { longitude: parseFloat(match[1]), latitude: parseFloat(match[2]) };
    }
    return null;
}
async function getCityName(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Erro ao obter os dados da cidade.");
        }

        const data = await response.json();
        return data.address.city || data.address.town || data.address.village || "Local desconhecido";
    } catch (error) {
        console.error("Erro na API Nominatim:", error);
        return "Erro ao obter o nome da cidade";
    }
}
const coordinates = extractCoordinatesFromURL();
if (coordinates) {
    const { latitude, longitude } = coordinates;
    const map = L.map('map').setView([latitude, longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    getCityName(latitude, longitude).then((cityName) => {
        document.getElementById('title').textContent = `Cidade: ${cityName}`;
        L.marker([latitude, longitude]).addTo(map)
            .bindPopup(`${cityName}`)
            .openPopup();
    });
} else {
    console.error("Não foi possível extrair as coordenadas.");
    document.getElementById('title').textContent = "Erro ao carregar o mapa";
    document.getElementById('details').textContent = "(coordenadas vazias)";
}