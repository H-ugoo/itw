﻿var vm = function () {
    console.log('ViewModel initiated...');
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Torch_route');
    self.displayName = 'Paris 2024 Torch Route';
    self.records = ko.observableArray([]);
    self.activate = function (id) {
        console.log('CALL: getRoutes...');
        var composedUri = self.baseUri();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            for(i=0;i<data.length;i++){
                data[i].Date_start = data[i].Date_start.split('T')[0];
                data[i].Date_end = data[i].Date_end.split('T')[0];
            }
            self.records(data);
        });
    };
    self.activate(1);
    console.log("VM initialized!");
}
function ajaxHelper(uri, method, data) {
    return $.ajax({
        type: method,
        url: uri,
        dataType: 'json',
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : null,
        error: function (jqXHR, textStatus, errorThrown) {
            alert("AJAX Call[" + uri + "] Fail...");
        }
    });
}

$('document').ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});
