(function() {
    'use strict';

    var baseUrl = 'http://localhost:8000/api/v1/streams/',
        console = window.console,
        LOG = false;

    window.onload = function() {
        addEventListeners();
        getAllStreams();
    };

    var addEventListeners = function() {
        document.getElementById('btnCreate').addEventListener('click', doCreate);
        document.getElementById('btnUpdate').addEventListener('click', doUpdate);
        document.getElementById('btnDelete').addEventListener('click', doDelete);
    }

    var callHttp = function(method, options, callback) {
        options = options || {};
        var url = baseUrl + (options.id || ''),
            okStatus = options.okStatus || 200,
            toSend;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState != 4) {
                return;
            }
            var responseText = xmlhttp.responseText,
                response = responseText ? JSON.parse(responseText) : '';
            if (LOG) console.log('%s %s %d (%s)', method, url, xmlhttp.status, xmlhttp.statusText);
            if (xmlhttp.status == okStatus) {
                if (LOG) console.log('%o', response);
                if (callback) {
                    callback(response);
                }
            } else {
                console.error(response);
            }
        };
        xmlhttp.open(method, url, true);
        if (options.reqBody) {
            xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            toSend = JSON.stringify(options.reqBody);
        }
        xmlhttp.send(toSend);
    };

    var clearTable = function(table) {
        var i = table.rows.length;
        while (--i) {
            table.deleteRow(i);
        }
    };

    var fillTable = function(table, list) {
        for (var i = 0, len = list.length; i < len; i++) {
            var item = list[i],
                row = table.insertRow(-1),
                j = 0;
            for (var attr in item) {
                row.insertCell(j).innerHTML = item[attr];
                j++;
            }
        }
    };

    var getAllStreams = function() {
        callHttp('GET', {}, function(streams) {
            var streamsTable = document.getElementById('streams');
            clearTable(streamsTable);
            fillTable(streamsTable, streams);
        });
    };

    var clearInput = function() {
        var inFormElements = document.forms.inForm.elements;
        for (var i = 0, len = inFormElements.length; i < len; i++) {
            inFormElements[i].value = '';
        }
    };

    var refreshView = function() {
        getAllStreams();
        clearInput();
    };

    var postStream = function(stream) {
        callHttp('POST', {
            reqBody: stream,
            okStatus: 201
        }, refreshView);
    };

    var putStream = function(id, stream) {
        callHttp('PUT', {
            id: id,
            reqBody: stream
        }, refreshView);
    };

    var deleteStream = function(id) {
        callHttp('DELETE', {
            id: id,
            okStatus: 204
        }, refreshView);
    };

    var capitalizeFirstChar = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    var getValFromInputForm = function(list, attr) {
        return list['in' + capitalizeFirstChar(attr)].value;
    };

    var createObjFromInputForm = function(inForm) {
        var obj = {},
            inFormElements = inForm.elements,
            attrs = ['name', 'description', 'url', 'state'];
        for (var i = 0, len = attrs.length; i < len; i++) {
            var attr = attrs[i],
                val = getValFromInputForm(inFormElements, attr);
            if (val) {
                obj[attr] = val;
            }
        }
        return obj;
    };

    var doCreate = function() {
        postStream(createObjFromInputForm(document.forms.inForm));
    };

    var doUpdate = function() {
        var inForm = document.forms.inForm,
            id = inForm.elements.inId.value,
            update = createObjFromInputForm(inForm);
        putStream(id, update);
    };

    var doDelete = function() {
        deleteStream(document.forms.inForm.elements.inId.value);
    };

}());