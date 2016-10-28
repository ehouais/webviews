define(function() {
    var parseHeaders = function(headers) {
            return headers.split('\n').reduce(function(map, line) {
                var tokens = line.match(/([^\:]+)\:(.*)/);
                if (tokens) map[tokens[1]] = tokens[2];
                return map;
            }, {});
        };

    return {
        uriParams: function(uri) {
            var a = document.createElement('a');
            a.href = uri;
            return a.search.replace(/^\?/, '').split('&').reduce(function(obj, pair) {
                var tokens = pair.split('=');
                obj[tokens[0]] = decodeURIComponent(tokens[1]);
                return obj;
            }, {});
        },
        fetch: function(uri, cb) {
            if (uri.substr(0, 5) == 'data:') {
                cb(decodeURIComponent(uri.replace(/^data:[^,]+,/, '')));
            } else {
                var xhr = new XMLHttpRequest();

                if ('withCredentials' in xhr) {
                    // Check if the XMLHttpRequest object has a "withCredentials" property.
                    // "withCredentials" only exists on XMLHTTPRequest2 objects.
                    xhr.withCredentials = true;
                    xhr.open('GET', uri, true);
                } else if (typeof XDomainRequest != 'undefined') {
                    // Otherwise, check if XDomainRequest.
                    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
                    xhr = new XDomainRequest();
                    xhr.open('GET', uri);
                } else {
                    // Otherwise, CORS is not supported by the browser.
                    throw new Error('CORS not supported');
                }

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        cb(xhr.responseText, xhr.status, parseHeaders(xhr.getAllResponseHeaders()));
                    }
                }
                xhr.send();
            }
        }
    }
});
