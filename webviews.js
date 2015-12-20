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
                                                        width: '28px',
                                                        height: '28px',
                                                        backgroundSize: '24px'
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
                                return password ? sjcl.encrypt(password, data, {ks: 256}) : data;
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
