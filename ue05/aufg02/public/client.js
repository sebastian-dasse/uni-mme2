(function() {
    'use strict';

    var baseUrl = 'http://localhost:8000/api/v1/streams/',
        console = window.console,
        queryString = '',
        LOG = true;

    window.onload = function() {
        addEventListeners();
        getAllStreams();
    };

    var addEventListeners = function() {
        document.getElementById('btnCreate').addEventListener('click', doCreateStream);
        document.getElementById('btnUpdate').addEventListener('click', doUpdateStream);
        document.getElementById('btnDelete').addEventListener('click', doDeleteStream);
        document.getElementById('btnFilter').addEventListener('click', filterOn);
        document.getElementById('btnNoFilter').addEventListener('click', filterOff);
    };

    var callHttp = function(method, options, callback) {
        options = options || {};
        var url = baseUrl + (options.id || options.query || ''),
            okStatus = options.okStatus || 200,
            toSend = null,
            xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState != 4) {
                return;
            }
            var responseText = xmlhttp.responseText,
                response = responseText ? JSON.parse(responseText) : '(no response)';
            if (xmlhttp.status == okStatus) {
                if (LOG) {
                    console.log('%s %s %d (%s) with response:', method, url, xmlhttp.status, xmlhttp.statusText);
                    console.log(response);
                }
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
        callHttp('GET', {
            query: queryString
        }, function(streams) {
            var streamsTable = document.getElementById('streams');
            clearTable(streamsTable);
            fillTable(streamsTable, streams);
        });
    };

    var clearForm = function(form) {
        var formElements = document.forms[form].elements;
        for (var i = 0, len = formElements.length; i < len; i++) {
            formElements[i].value = '';
        }
    };

    var refreshView = function() {
        getAllStreams();
        clearForm('inForm');
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

    var getValFrom = function(inFormElements, attr) {
        var val = inFormElements['in' + capitalizeFirstChar(attr)].value;
        return isNaN(val) ? val : parseInt(val);
    };

    var setAttributesFromInputFormFor = function(obj) {
        var inFormElements = document.forms.inForm.elements;
        return function(attr) {
            var val = getValFrom(inFormElements, attr);
            if (val) {
                obj[attr] = val;
            }
        };
    };

    var createObjFromInputForm = function() {
        var attrs = ['name', 'description', 'url', 'state'],
            obj = {},
            setAttr = setAttributesFromInputFormFor(obj);
        for (var i = 0, len = attrs.length; i < len; i++) {
            setAttr(attrs[i]);
        }
        return obj;
    };

    var doCreateStream = function() {
        postStream(createObjFromInputForm());
    };

    var doUpdateStream = function() {
        var id = document.forms.inForm.elements.inId.value;
        putStream(id, createObjFromInputForm());
    };

    var doDeleteStream = function() {
        var id = document.forms.inForm.elements.inId.value;
        deleteStream(id);
    };

    var createQueryFromFilterForm = function() {
        var filterFormElements = document.forms.filterForm.elements,
            filterSelect = filterFormElements.filterSelect,
            selected = filterSelect.options[filterSelect.selectedIndex],
            searchString = filterFormElements.filterFilter.value;
        if (selected && searchString) {
            return '?' + selected.value.toLowerCase() + '=' + searchString.replace(/\s+/g, '+').toLowerCase();
        }
    };

    var setQuery = function() {
        queryString = createQueryFromFilterForm();
    };

    var clearQuery = function() {
        queryString = '';
    };

    var filterOn = function() {
        setQuery();
        getAllStreams();
    };

    var filterOff = function() {
        clearForm('filterForm');
        clearQuery();
        getAllStreams();
    };

}());