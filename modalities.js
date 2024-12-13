var vm = function () {
    console.log('ViewModel initiated...');
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/API/sports');
    self.displayName = 'Paris2024 Modalities List';
    self.error = ko.observable('');
    self.Sports = ko.observableArray([]); 
    self.favourites = ko.observableArray([]); 
    self.loadSports = function () {
        console.log('Chamando API para carregar todos os esportes...');
        ajaxHelper(self.baseUri(), 'GET').done(function (data) {
            console.log('Dados recebidos:', data);
            data.forEach(function (sport) {
                sport.isFavorite = ko.computed(function () {
                    return self.favourites().includes(sport.Id);
                });
            });
            self.Sports(data);
        });
    };

    function ajaxHelper(uri, method, data) {
        self.error(''); 
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`AJAX Call[${uri}] Falhou...`);
                self.error(errorThrown);
            }
        });
    }


    self.loadFavorites = function () {
        let storedFavs = localStorage.getItem('favorites_s');
        if (storedFavs) {
            self.favourites(JSON.parse(storedFavs));
        }
    };

    self.saveFavorites = function () {
        localStorage.setItem('favorites_s', JSON.stringify(self.favourites()));
    };

    self.toggleFavorite = function (sport) {
        if (self.favourites.indexOf(sport.Id) === -1) {
            self.favourites.push(sport.Id);
            alert(`${sport.Name} foi adicionado aos favoritos!`);
        } else {
            self.favourites.remove(sport.Id);
            alert(`${sport.Name} foi removido dos favoritos!`);
        }
        self.saveFavorites();
    };


    self.loadFavorites(); 
    self.loadSports(); 
};

$(document).ready(function () {
    console.log('Aplicando bindings...');
    ko.applyBindings(new vm());
});
