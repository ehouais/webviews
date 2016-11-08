define(function() {
    return {
        parseParams: function(str) {
            return {offset: +str};
        },
        parseData: function(str) {
            var offset = new Date().getTimezoneOffset()*60000;
            // get serie values
            return str.split('|').map(function(series, i) {
                var match = series.match(/^([^:]+):/);
                return {
                    label: match ? match[1] : 'series '+i,
                    values: series.split(';').map(function(pair) {
                        var tokens = pair.split(','),
                            year = (new Date()).getFullYear(),
                            match = tokens[0].match(/(\d{2})\/(\d{2})(\/(\d{2}))?/);

                        return {
                            date: new Date((match[3] ? +match[4]+2000 : year)+'-'+match[2]+'-'+match[1])/* + offset*/,
                            value: +tokens[1]
                        };
                    })
                };
            });
        }
    };
});
