(function() {
    var uriParams = function(uri) {
            var a = document.createElement('a');
            a.href = uri;
            return a.search.replace(/^\?/, '').split('&').reduce(function(obj, pair) {
                var tokens = pair.split('=');
                obj[tokens[0]] = decodeURIComponent(tokens[1]);
                return obj;
            }, {});
        },
        uriData = function(uri) {
            return decodeURIComponent(uri.replace(/^data:[^,]+,/, ''));
        },
        debounce = function(fn, delay) {
            var timer = null;
            return function () {
                var context = this, args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function() {
                    fn.apply(context, args);
                }, delay);
            };
        },
        Webviews = {
            data: function() {
                var local,
                    handlers = [],
                    dataUri = uriParams(window.location.href).datauri,
                    dataScheme = dataUri.substr(0, 5) == 'data:',
                    cipher = (function() {
                        var password;

                        return {
                            in: function(data) {
                                try {
                                    var obj = JSON.parse(data);
                                    if (obj.iv && obj.v && obj.iter && obj.ks && obj.ts && obj.mode && obj.cipher && obj.salt && obj.ct) {
                                        try {
                                            data = sjcl.decrypt(password = prompt('Enter password for data \''+dataUri+'\''), data);
                                        } catch(e) {
                                            alert(e.message);
                                            return;
                                        }
                                    }
                                } catch(e) {
                                    // hide non significant error that only means that data is not JSON (and thus, not ciphered)
                                }
                                return data;
                            },
                            out: function(data) {
                                return password ? sjcl.encrypt(password, data) : data;
                            }
                        };
                    })(),
                    d = {
                        save: (function() {
                            var delay_,
                                tid,
                                save_ = $.Deferred().resolve();

                            return function(data) {
                                // Send update request to server when (eventual) previous one has succeeded and a 5 seconds delay has passed since function call
                                local = data;
                                if (tid) {
                                    clearTimeout(tid);
                                } else {
                                    delay_ = $.Deferred();
                                    $.when(delay_, save_).done(function() {
                                        local = cipher.out(local);
                                        save_ = $.ajax({
                                            url: dataUri,
                                            type: 'PUT',
                                            contentType: 'text/plain',
                                            data: local,
                                            xhrFields: {withCredentials: true}
                                        });
                                    });
                                }
                                tid = setTimeout(function() {
                                    delay_.resolve();
                                    tid = null;
                                }, 1000);
                            }
                        })(),
                        bind: function(handler) {
                            handlers.push(handler);
                            if (local) handler(local); // publish data if already fetched
                            return d;
                        },
                        unbind: function(handler) {
                            handlers = handlers.filter(function(item) {
                                return item !== handler;
                            });
                            return d;
                        },
                        trigger: function() {
                            handlers.forEach(function(handler) {
                                handler(local);
                            });
                            return d;
                        }
                    },
                    publish = function(data) {
                        local = data;
                        d.trigger();
                    },
                    load = function() {
                        if (dataScheme) {
                            // data: URIs are (for now...) parsed and not fetched because browsers have difficulties handling them in a CORS context
                            publish(cipher(uriData(dataUri), dataUri));
                        } else {
                            $.ajax({
                                url: dataUri,
                                dataType: 'text',
                                ifModified: true,
                                xhrFields: {withCredentials: true}
                            }).done(function(data, status, xhr) {
                                if (xhr.status != 304) { // "Not Modified"
                                    publish(cipher.in(data));
                                }
                            }).always(function() {
                                !dataScheme && setNextLoad();
                            });
                        }
                    },
                    setNextLoad = debounce(load, 5*60*1000); // in 5 minutes

                load();
                return d;
            },
            resize: function(cb) {
                return window.onresize = function() {
                    var width = window.innerWidth,
                        height = window.innerHeight,
                        dl = dt = dr = db = margin = Math.min(width, height)/20,
                        bbox,
                        ml = mt = mr = mb = 0;

                    while (dl || dt || dr || db) {
                        bbox = cb(width, height, {left: ml += dl, top: mt += dt, right: mr += dr, bottom: mb += db});
                        dl = Math.max(0, margin-ml+margin-bbox.x);
                        dt = Math.max(0, margin-mt+margin-bbox.y);
                        dr = Math.max(0, margin-mr+bbox.x+bbox.width-(width-margin));
                        db = Math.max(0, margin-mb+bbox.y+bbox.height-(height-margin));
                    }
                }
            },
            uriParams: uriParams,
            debounce: debounce
        };

    if (window.define) {
        define(function() {
            return Webviews;
        });
    } else {
        window.Webviews = Webviews;
    }
})();
