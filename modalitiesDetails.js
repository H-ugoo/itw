var vm = function () {
    console.log('ViewModel initiated...');
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/API/Sports/');
    self.displayName = 'Sports Full Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');  
    self.Id = ko.observable('');
    self.Name = ko.observable('');
    self.Sport_url = ko.observable('');
    self.Pictogram = ko.observable('');
    self.Athletes = ko.observableArray([]);
    self.Coaches = ko.observable('');
    self.Competitions = ko.observable('');
    self.Teams = ko.observable('');
    self.Technical_officials = ko.observable('');
    self.Venues = ko.observable('');
    self.activate = function (Id) {
        console.log('CALL: getSportsDetails...');
        
        if (!Id) {
            self.error('Id está ausente.');
            hideLoading();
            return;
        }
    
        var composedUri = self.baseUri() + Id; 
        console.log('Fetching data from:', composedUri);
        
        ajaxHelper(composedUri, 'GET')
            .done(function (data) {
                console.log('Data fetched:', data);
                if (data && data.Id) {
                    console.log('Data fetched successfully:', data);
                    self.Id(data.Id);
                    self.Name(data.Name);
                    self.Sport_url(data.Sport_url);
                    self.Pictogram(data.Pictogram || 'https://via.placeholder.com/300');
                    self.Athletes(data.Athletes || []);
                    self.Coaches(data.Coaches || []);
                    self.Competitions(data.Competitions || []);
                    self.Teams(data.Teams || []);
                    self.Technical_officials(data.Technical_officials || []);
                    self.Venues(data.Venues || []);
                } else {
                    console.error('No valid data returned from API');
                    self.error('No valid data returned from API');
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error('AJAX Call failed:', textStatus, errorThrown);
                self.error(`AJAX Call failed: ${textStatus}`);
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
    };

    showLoading();
    var pg = getUrlParameter('id');
    console.log('URL Parameters - Id:', pg);

    if (pg) {
        self.activate(pg);
    } else {
        hideLoading();
        console.error("Parâmetros obrigatórios ausentes.");
        self.error("No valid data returned from API");
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
