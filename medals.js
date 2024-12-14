var vm = function () {
    console.log('ViewModel initiated...');
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/API/CountryMedals');
    self.displayName = 'Paris2024 Medals List';
    self.error = ko.observable('');
    self.Medals = ko.observableArray([]); 
    self.favourites = ko.observableArray([]); 
    self.loadMedals = function () {
        console.log('Chamando API para carregar todos os esportes...');
        ajaxHelper(self.baseUri(), 'GET').done(function (data) {
            console.log('Dados recebidos:', data);
            self.Medals(data);
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

    self.loadMedals(); 
};

$(document).ready(function () {
    console.log('Aplicando bindings...');
    ko.applyBindings(new vm());
});
