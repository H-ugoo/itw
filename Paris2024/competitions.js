// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //--- Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/API/competitions');
    self.displayName = 'Paris2024 Competitions List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.Competitions = ko.observableArray([]);
    self.favourites_comp = ko.observableArray([]);
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
        console.log('CALL: getCompetitions...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.loadFavorites();
            data.Competitions.forEach(function (competition) {
                competition.isFavorite = ko.observable(
                    self.favourites_comp().some(fav => fav.SportId === competition.SportId && fav.Name === competition.Name)
                );
            });
            self.Competitions(data.Competitions);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize);
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalCompetitions);
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

    function showLoading() {
        $("#myModal").modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }

    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        });
    }

    self.loadFavorites = function () {
        let storedFavs = localStorage.getItem('favorites_comp');
        if (storedFavs) {
            try {
                self.favourites_comp(JSON.parse(storedFavs));
            } catch (e) {
                console.error("Error parsing favorites from localStorage:", e);
                self.favourites_comp([]);
            }
        }
    };

    self.saveFavorites = function () {
        localStorage.setItem('favorites_comp', JSON.stringify(self.favourites_comp()));
    };

    // Função que lida com a alternância de favoritos
    self.toggleFavorite = function (competition) {
        const existingIndex = self.favourites_comp().findIndex(fav => fav.SportId === competition.SportId && fav.Name === competition.Name);
        if (existingIndex === -1) {
            // Adiciona o favorito
            self.favourites_comp.push({ SportId: competition.SportId, Name: competition.Name });
            competition.isFavorite(true); // Marca como favorito
            alert(competition.Name + " foi adicionado aos favoritos!");
        } else {
            // Remove dos favoritos
            self.favourites_comp.splice(existingIndex, 1);
            competition.isFavorite(false); // Marca como não favorito
            alert(competition.Name + " foi removido dos favoritos!");
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
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
});
