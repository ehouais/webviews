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
		Webviews = {
			data: function() {
				var local,
					handlers = [],
					promise,
					ciphered = false,
					password = (function() {
						var password,
							hint;
						return function(str) {
							hint = hint || str;
							return (password = password || prompt('Enter password for data \''+dataUri+'\''+(hint ? ' ("'+hint+'")' : '')));
						}
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
										if (ciphered) {
											local = sjcl.encrypt(password(), local);
										}
										save_ = $.ajax({url: dataUri, type: 'PUT', contentType: 'text/plain', data: local, xhrFields: {withCredentials: true}});
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
                    dataUri = uriParams(window.location.href).datauri;

                promise = $.ajax({url: dataUri, dataType: 'text', xhrFields: dataUri.substr(0, 5) == 'data:' ? {} : {withCredentials: true}}).done(function(data) {
					var obj;
					try {
						obj = JSON.parse(data);
						if (obj.iv && obj.v && obj.iter && obj.ks && obj.ts && obj.mode && obj.cipher && obj.salt && obj.ct) {
							ciphered = true;
							try {
								data = sjcl.decrypt(password(obj.label), data);
							} catch(e) {
								alert(e.message);
								return;
							}
						}
					} catch(e) {
						// hide non significant error
					} finally {
						local = data;
						d.trigger();
					}
				});

				return d;
			},
			resize: function(params, cb) {
				return window.onresize = function() {
					var width = window.innerWidth,
		                height = window.innerHeight;
					    factor = 20

		            width && height && cb(width, height, {
	                    top     : Math.max(   params.top[0], Math.min(   params.top[1], height/factor)),
	                    right   : Math.max( params.right[0], Math.min( params.right[1],  width/factor)),
	                    bottom  : Math.max(params.bottom[0], Math.min(params.bottom[1], height/factor)),
	                    left    : Math.max(  params.left[0], Math.min(  params.left[1],  width/factor))
	                });
				}
			},
			uriParams: uriParams
		};

	if (window.define) {
		define(function() {
			return Webviews;
		});
	} else {
		window.Webviews = Webviews;
	}
})();
