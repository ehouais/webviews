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
                    lastModified,
                    cipher = (function() {
                        var password;

                        return {
                            in: function(data, cb) {
                                try {
                                    var obj = JSON.parse(data);
                                    if (obj.iv && obj.v && obj.iter && obj.ks && obj.ts && obj.mode && obj.cipher && obj.salt && obj.ct) {
                                        $(function() {
                                            var $overlay = $('<div>').css({
                                                    backgroundImage: 'url(data:image/png;base64,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)',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'center',
                                                    zIndex: 100,
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                    cursor: 'pointer'
                                                }).appendTo(document.body),
                                                lock = function() {
                                                    password = null;
                                                    $overlay.css({
                                                        width: '100%',
                                                        height: '100%',
                                                        backgroundSize: ''
                                                    }).off('dblclick').on('dblclick', function() {
                                                        try {
                                                            cb(sjcl.decrypt(password = password || prompt('Enter password for data \''+dataUri+'\''), data));
                                                            unlock();
                                                        } catch(e) {
                                                            alert(e.message);
                                                        }
                                                    });
                                                },
                                                unlock = function() {
                                                    $overlay.css({
                                                        width: '32px',
                                                        height: '32px',
                                                        backgroundSize: '70%'
                                                    }).off('dblclick').on('dblclick', function() {
                                                        cb();
                                                        lock();
                                                    });
                                                };
                                            lock();
                                        });
                                        return;
                                    }
                                } catch(e) {
                                    // hide non significant error that only means that data is not JSON (and thus, not ciphered)
                                }
                                cb(data);
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
                            cipher.in(uriData(dataUri), publish);
                        } else {
                            $.ajax({
                                url: dataUri,
                                dataType: 'text',
                                xhrFields: {withCredentials: true}
                            }).done(function(data, status, xhr) {
                                // Detect resource modification without interfering with browser cache management
                                var lm = xhr.getResponseHeader("Last-Modified");
                                if (lm != lastModified) {
                                    lastModified = lm;
                                    cipher.in(data, publish);
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
