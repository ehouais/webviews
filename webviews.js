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
                    dataUri = uriParams(window.location.href).datauri,
					load = function() {
						var dataScheme = dataUri.substr(0, 5) == 'data:';

						$.ajax({
							url: dataUri,
							dataType: 'text',
							ifModified: true,
							xhrFields: dataUri.substr(0, 5) == 'data:' ? {} : {withCredentials: true}
						}).done(function(data) {
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
							}
							local = data;
							d.trigger();
							!dataScheme && setNextLoad();
						}).fail(function() {
							!dataScheme && setNextLoad();
						});
					},
					setNextLoad = (function() {
						var timer;

						return function() {
							if (timer) {
								clearTimeout(timer);
							}
							timer = setTimeout(load, 5*60*1000) // in 5 minutes
						};
					})();

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
