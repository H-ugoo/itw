var vm = function () {
    console.log('ViewModel initiated...');
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/API/competitions'); 
    self.displayName = 'Competitions Full Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.SportId = ko.observable('');
    self.Name = ko.observable('');
    self.Tag = ko.observable('');
    self.Photo = ko.observable('');
    self.SportInfo = ko.observable('');
    self.Athletes = ko.observableArray([]);
    self.activate = function (sportId, name) {
        console.log('CALL: getCompetitionDetails...');
        
        if (!sportId || !name) {
            self.error('sportId ou name está ausente.');
            hideLoading();
            return;
        }

        var composedUri = `${self.baseUri()}?sportId=${sportId}&name=${encodeURIComponent(name)}`;
        console.log('Fetching data from:', composedUri);
        
        ajaxHelper(composedUri, 'GET')
            .done(function (data) {
                console.log('Data fetched:', data);
                if (data && data.SportId) {
                    console.log('Data fetched successfully:', data);
                    self.SportId(data.SportId);
                    self.Name(data.Name);
                    self.Tag(data.Tag);
                    self.Photo(data.Photo || 'https://via.placeholder.com/300');
                    self.SportInfo(data.SportInfo ? data.SportInfo.Name : 'No Info Available');
                    self.Athletes(data.Athletes || []);
                } else {
                    console.error('No valid data returned from API');
                    self.error('Dados não encontrados para a competição.');
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error('AJAX Call failed:', textStatus, errorThrown);
                self.error(`Erro ao carregar os dados: ${textStatus}`);
            })
            .always(function () {
                console.log('AJAX Request finished');
                hideLoading();
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
                console.error("AJAX Call failed for URL: " + uri);
                self.error(`Erro de conexão: ${textStatus}`);
            }
        });
    }
function showLoading() {
        $('#myModal').modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }


    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return null;
    }

    showLoading();
    var sportId = getUrlParameter('sportId');
    var name = getUrlParameter('name');
    console.log('URL Parameters - sportId:', sportId, 'name:', name);

    if (sportId && name) {
        self.activate(sportId, name);
    } else {
        hideLoading();
        console.error("Parâmetros obrigatórios ausentes: sportId ou name.");
        self.error("Não foi possível carregar os detalhes da competição. sportId ou name ausentes.");
    }

    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    console.log('AJAX complete');
    $("#myModal").modal('hide');
});
