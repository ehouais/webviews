var Webviews = {
	data: function() {
		var local,
			handlers = [],
			a = document.createElement('a'),
			dataUri,
			promise,
			d = {
				update: function() {
					d.trigger();
					$.ajax({url: dataUri, type: 'PUT', contentType: 'text/plain', data: JSON.stringify(local), xhrFields: {withCredentials: true}});
				},
				bind: function(handler) {
					local && handler(local);
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