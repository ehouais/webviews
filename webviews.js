(function() {
	var Webviews = {
			data: function() {
				var local,
					handlers = [],
					promise,
					d = {
						save: (function() {
							var delay_,
								tid,
								save_ = $.Deferred().resolve(),
								cache;
							return function(data) {
								// Send update request to server when (eventual) previous one has succeeded and a 5 seconds delay has passed since function call
								cache = data;
								if (tid) {
									clearTimeout(tid);
								} else {
									delay_ = $.Deferred();
									$.when(delay_, save_).done(function() {
										save_ = $.ajax({url: dataUri, type: 'PUT', contentType: 'text/plain', data: cache, xhrFields: {withCredentials: true}});
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
                    dataUri = (function(str) {
                        var a = document.createElement('a');
                        a.href = str;
                        return a.search.replace(/^\?/, '').split('&').reduce(function(obj, pair) {
                            var tokens = pair.split('=');
                            obj[tokens[0]] = tokens[1];
                            return obj;
                        }, {});
                    })(window.location.href).datauri;

                promise = $.ajax({url: dataUri, dataType: 'text', xhrFields: dataUri.substr(0, 5) == 'data:' ? {} : {withCredentials: true}}).done(function(data) {
					local = data;
					d.trigger();
				});

				return d;
			}
		};

	if (window.define) {
		define(function() {
			return Webviews;
		});
	} else {
		window.Webviews = Webviews;
	}
})();
