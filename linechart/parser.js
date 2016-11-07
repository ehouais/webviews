define(function() {
    return {
        parseParams: function(str) {
        },
        parseData: function(str) {
            /*var str = str.replace(/_/g, ' ');*/

            // get serie labels
            /*offset = 0;
            if (res = str.match(/^\{([^\}|]*)(\|([^\}]+))?\}(.*)/)) {
                if (res[1]) labels = res[1].split(',');
                if (res[3]) offset = res[3];
                str = res[4];
            }*/

            var offset = new Date().getTimezoneOffset()*60000;
            // get serie values
            return str.split('|').map(function(series) {
                return {
                    label: 'toto',
                    values: series.split(';').map(function(pair) {
                        var tokens = pair.split(','),
                            year = (new Date()).getFullYear(),
                            match = tokens[0].match(/(\d{2})\/(\d{2})(\/(\d{2}))?/);

                        return {
                            date: Date.parse((match[3] ? match[4] : year)+'-'+match[2]+'-'+match[1]) + offset,
                            value: +tokens[1]
                        };
                    })
                };
            });
        }
    };
});
