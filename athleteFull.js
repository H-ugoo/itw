var vm = function () {
    console.log('ViewModel initiated...');
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/API/athletes/');
    self.displayName = 'Athlete Full Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.Id = ko.observable('');                        //
    self.Name = ko.observable('');                      //
    self.NameShort = ko.observable('');                 //
    self.NameTv = ko.observable('');                    //
    self.BirthCountry = ko.observable('');              //
    self.BirthDate = ko.observable('');                 //
    self.BirthPlace = ko.observable('');                //
    self.Sex = ko.observable('');                       //
    self.Photo = ko.observable('');                     //
    self.Height = ko.observable('');                    //
    self.Weight = ko.observable('');                    //
    self.Lang = ko.observable('');
    self.Function = ko.observable('');
    self.Country_code = ko.observable('');
    self.Country = ko.observable('');
    self.Nationality_code = ko.observable('');
    self.Residence_place = ko.observable('');
    self.Residence_country = ko.observable('');
    self.Nickname = ko.observable('');
    self.Hobbies = ko.observable('');
    self.Occupation = ko.observable('');
    self.Education = ko.observable('');
    self.Family = ko.observable('');
    self.Reason = ko.observable('');
    self.Hero = ko.observable('');
    self.Influence = ko.observable('');
    self.Philosophy = ko.observable('');
    self.SportingRelatives = ko.observable('');
    self.Ritual = ko.observable('');
    self.OtherSports = ko.observable('');
    self.Url = ko.observable('');
    self.Medals = ko.observable('');
    self.Sports = ko.observable('');
    self.Competitions = ko.observable('');

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getAthlete...');
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id) ;
            self.Name(data.Name);
            self.NameShort(data.NameShort);
            self.NameTv(data.NameTv);
            self.BirthCountry(data.BirthCountry);
            self.BirthDate(data.BirthDate.split('T')[0]);
            self.BirthPlace(data.BirthPlace);
            self.Sex(data.Sex);
            self.Photo(data.Photo);
            self.Height(data.Height);
            self.Weight(data.Weight);
            self.Lang(data.Lang);
            self.Function(data.Function);
            self.Country_code(data.Country_code);
            self.Country(data.Country);
            self.Nationality_code(data.Nationality_code);
            self.Residence_place(data.Residence_place);
            self.Residence_country(data.Residence_country);
            self.Nickname(data.Nickname);
            self.Hobbies(data.Hobbies);
            self.Occupation(data.Occupation);
            self.Education(data.Education);
            self.Family(data.Family);
            self.Reason(data.Reason);
            self.Hero(data.Hero);
            self.Influence(data.Influence);
            self.Philosophy(data.Philosophy);
            self.SportingRelatives(data.SportingRelatives);
            self.Ritual(data.Ritual);
            self.OtherSports(data.OtherSports);
            self.Url(data.Url);
            self.Medals(data.Medals);
            self.Sports(data.Sports);
            self.Competitions(data.Competitions);
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
