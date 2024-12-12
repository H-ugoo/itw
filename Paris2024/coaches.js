var vm = function () {
    console.log('ViewModel initiated...');
    var self = this;

    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/API/coaches');
    self.displayName = 'Paris2024 Coaches List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.Coaches = ko.observableArray([]);
    self.favourites_c = ko.observableArray([]);  // Lista de favoritos dos treinadores
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.previousPage = ko.computed(function () {
        return self.currentPage() * 1 - 1;
    }, self);
    self.nextPage = ko.computed(function () {
        return self.currentPage() * 1 + 1;
    }, self);
    self.fromRecord = ko.computed(function () {
        return self.previousPage() * self.pagesize() + 1;
    }, self);
    self.toRecord = ko.computed(function () {
        return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
    }, self);
    self.totalPages = ko.observable(0);

    self.pageArray = function () {
        var list = [];
        var size = Math.min(self.totalPages(), 9);
        var step;
        if (size < 9 || self.currentPage() === 1)
            step = 0;
        else if (self.currentPage() >= self.totalPages() - 4)
            step = self.totalPages() - 9;
        else
            step = Math.max(self.currentPage() - 5, 0);

        for (var i = 1; i <= size; i++)
            list.push(i + step);
        return list;
    };

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getCoaches...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();

            // Carregar os favoritos para garantir que os dados estão corretos
            self.loadFavorites(); // Carrega os favoritos do localStorage

            // Atualiza o estado de isFavorite para cada treinador
            data.Coaches.forEach(function (coache) {
                coache.isFavorite = ko.observable(self.favourites_c.indexOf(coache.Id) !== -1);
            });

            // Atualiza os dados dos treinadores
            self.Coaches(data.Coaches);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize);
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalCoaches);
        });
    };

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }

    function sleep(milliseconds) {
        const start = Date.now();
        while (Date.now() - start < milliseconds);
    }

    function showLoading() {
        $("#myModal").modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }

    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    self.loadFavorites = function () {
        let storedFavs = localStorage.getItem('favorites_c');
        if (storedFavs) {
            self.favourites_c(JSON.parse(storedFavs));
        }
    };

    self.saveFavorites = function () {
        localStorage.setItem('favorites_c', JSON.stringify(self.favourites_c()));
    };

    // Função que lida com a alternância de favoritos
    self.toggleFavorite = function (coache) {
        if (self.favourites_c.indexOf(coache.Id) === -1) {
            self.favourites_c.push(coache.Id); // Adiciona aos favoritos
            coache.isFavorite(true); // Marca o coache como favorito
            alert(coache.Name + " foi adicionado aos favoritos!");
        } else {
            self.favourites_c.remove(coache.Id); // Remove dos favoritos
            coache.isFavorite(false); // Marca o coache como não favorito
            alert(coache.Name + " foi removido dos favoritos!");
        }
        self.saveFavorites(); // Salva favoritos no localStorage
    };

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        console.log("sPageURL=", sPageURL);
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    //--- start .... 
    showLoading();
    var pg = getUrlParameter('page');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());  // Certifique-se de que o ViewModel é inicializado corretamente
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
});
