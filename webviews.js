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
                                                    backgroundImage: 'url(data:image/gif;base64,R0lGODlhKAAoAPcAABmEtf///wiEpd7m7+a95hmUxWOtpe8Q3mveEO8QWq0Q3ineEK0QWu8QnGucEO8QGa0QnCmcEK0QGZS1pUrvpe+lEK2lEGuMpc4Q3kreEM4QWowQ3gjeEIwQWs4QnEqcEM4QGYwQnAicEIwQGZSUpUrOpc6lEIylEGut3kKMpdbmnEKtpbW15hnvtRnFtUqt5krv5u/mEK3mEJTmteactZTv5rWU5hnvlBnFlEqM5krO5s7mEIzmEJTmlOaclAjv5gjF5tac5iGcpWtr3u9z3mvvY+9zWmtrWu8x3mveMe8xWilr3ilrWq0x3ineMa0xWmsp3q1z3invY61zWmspWikp3ikpWu8xnGucMe8xGa0xnCmcMa0xGWtrnO9znGutY+9zGWtrGSlrnClrGWspnK1znCmtY61zGWspGSkpnCkpGbW1pWvvpe+lMa2lMe+1Y621Y0pr3s5z3krvY85zWkprWghr3ghrWkop3oxz3gjvY4xzWkopWggp3ggpWkprnM5znEqtY85zGUprGQhrnAhrGUopnIxznAitY4xzGUopGQgpnAgpGc61Y4y1Y2tK3u9S3mvOY+9SWmtKWs4x3kreMc4xWilK3ilKWowx3gjeMYwxWmsI3q1S3inOY61SWmsIWikI3ikIWs4xnEqcMc4xGYwxnAicMYwxGWtKnO9SnGuMY+9SGWtKGSlKnClKGWsInK1SnCmMY61SGWsIGSkInCkIGbWUpWvOpc6lMYylMe+UY62UY0pK3s5S3krOY85SWkpKWghK3ghKWkoI3oxS3gjOY4xSWkoIWggI3ggIWkpKnM5SnEqMY85SGUpKGQhKnAhKGUoInIxSnAiMY4xSGUoIGQgInAgIGc6UY4yUY4y13pTO3giU79bmzrXv5mvv5u/mc+/mMa3mMa3mc7Xmtea9tc7mc4zmc2uM5oyU5mvO5u/mUs7mMYzmMa3mUrXmlOa9lM7mUozmUvfmnCnv5inF5vec5rXW3imU7/fmzgicnCGEnP/m7yGEtf//7ywAAAAAKAAoAAAI/wADCBxIsOAAfAb8+RPgTwiKAQUjSpwokJuBAgAAFNjnr8BCAQVQ4KNIcuA/FAAECADgj2PDl0L4MSwwsqREbh89Fpi50KMQjS0XpoBoU2C/FwI4elQKMyhDIQp3CuBWdMBOhVBh8owKFaQQkAtRlPy3E+q+jF07fjybtW1HlWInWlWodqlaAUJepHixUCPYoF2pSkSBFzA/jwuFcOs30Bvhp4UxtiRUkyA3hn/Bfn3BOCI+xIjN+tNIdOBXqKhfAhBC9B83bpXxqUT9d5+AuAIJK2TJ0a+AmgM+3v4ncAVLoFA9MvRmGuRqnS8LEF2h8uM2gfgAcPyqcPvtigwbpv8ULWCFwAErfZbHnlHtz7sF/p2cufVtDvbJF94PMIB3ULtfjZSYVgV0ZR5/KqWk0oHosRRaVGHJ5tFqLGXFUVxWpVDACgXsJRBZZanlHQArGLBaUEDBJR9FxH0YXGF/7ZRDRyx119BO1xVlGmiANfSURllhtk6LVfn0kojRUeieADnqGEAKDHEUGV2FaafacE4GUCCEp3WkIU+S2dZkUWQ5lxVo23j1kksCDOnkACmIZ+VpQ7UFJpNZankVdAu9oGVha4ZFZFGpibYTN/+kiaSPYxa1U0YnNkQIRLIFdddUg5aU4UajPXpgAMbZKMROuJF5lXsLCRaAhBCmmmlJtP2RlFIBBSFlqW2l2lSmWm9VJpA3PHXlkAEooECsscUee6yGgQpggESVMqXStNRWS210PZVWkG7YQgddflsWWCFD2kb02ImpbfcfoD6+5Y+vE12WUk90vYcqU10VwFxRn2mG104A1uhjSgaUO9ZjdDXV00+P0pTnQPqgIFWC6yqYgqoPm4SPsQWEm8IKL2xjsEQBAQA7)',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'center',
                                                    zIndex: 100,
                                                    position: 'absolute',
                                                    top: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    cursor: 'pointer'
                                                }).appendTo(document.body);

                                            $overlay.on('dblclick', function() {
                                                try {
                                                    cb(sjcl.decrypt(password = password || prompt('Enter password for data \''+dataUri+'\''), data));
                                                    $overlay.css({
                                                        width: '42px',
                                                        height: '42px',
                                                        right: 0,
                                                        top: 0
                                                    });
                                                } catch(e) {
                                                    alert(e.message);
                                                }
                                            });
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
                            publish(cipher.in(uriData(dataUri), dataUri));
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
