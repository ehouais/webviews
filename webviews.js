var Webviews = {
	data: function() {
		var local,
			handlers = [],
			a = document.createElement('a'),
			dataUri,
			promise,
			d = {
				save: (function() {
					var delay_ = $.Deferred().resolve(),
						save_ = $.Deferred().resolve(),
						pending = false;
					return function(data) {
						// Send update request to server when (eventual) previous one has succeeded and a 5 seconds delay has passed since last request
						local = data;
						if (!pending) {
							pending = true;
							$.when(delay_, save_).done(function() {
								delay_ = $.Deferred();
								setTimeout(function() {
									delay_.resolve();
								}, 5000);
								save_ = $.ajax({url: dataUri, type: 'PUT', contentType: 'text/plain', data: JSON.stringify(data), xhrFields: {withCredentials: true}});
								pending = false;
							});
						}
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
			};

		a.href = window.location.href;
		dataUri = a.search.replace(/^\?/,'').split('&').reduce(function(obj, pair) {
			var tokens = pair.split('=');
			obj[tokens[0]] = tokens[1];
			return obj;
		}, {}).datauri;
		promise = $.ajax({url: dataUri, dataType: 'json', xhrFields: {withCredentials: true}}).done(function(data) {
			local = data;
			d.trigger();
		});

		return d;
	}
}