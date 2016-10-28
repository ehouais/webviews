define(function() {
    return {
        parseParams: function(str) {
            var tokens = str.split(':');

            return {
                labels: +tokens[0]-1,
                values: +tokens[1]-1
            }
        },
        parseData: function(str) {
            return str.replace(/;/g, '\n').split('\n').map(function(row) { return row.split(','); });
        }
    };
});
