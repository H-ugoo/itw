var vm = function () {
    console.log('ViewModel initiated...');
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/API/coaches/');
    self.displayName = 'Coaches Full Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.Id = ko.observable('');                        //
    self.Name = ko.observable('');                      //
    self.Sex = ko.observable('');                       //
    self.BirthDate = ko.observable('');                 //
    self.Function = ko.observable('');                    //
    self.Photo = ko.observable('');                     //
    self.Country_code = ko.observable('');
    self.Country = ko.observable('');
    self.Url = ko.observable('');
    self.Sports = ko.observable('');

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getCoaches...');
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id) ;
            self.Name(data.Name);
            self.BirthDate(data.BirthDate.split('T')[0]);
            self.Photo(data.Photo);
            self.Sex(data.Sex);
            self.Function(data.Function);
            self.Country_code(data.Country_code);
            self.Country(data.Country);
            self.Url(data.Url);
            self.Sports(data.Sports);
        });
    };

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); 
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

    //--- start ....
    showLoading();
    var pg = getUrlParameter('id');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})
