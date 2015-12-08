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
                                var $overlay;

                                try {
                                    var obj = JSON.parse(data);
                                    if (obj.iv && obj.v && obj.iter && obj.ks && obj.ts && obj.mode && obj.cipher && obj.salt && obj.ct) {
                                        $(function() {
                                            var lock = function() {
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

                                            // lazy overlay initialization
                                            $overlay = $overlay || $('<div>').css({
                                                backgroundImage: 'url(data:image/png;base64,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)',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'center',
                                                zIndex: 100,
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                cursor: 'pointer'
                                            }).appendTo(document.body),
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
