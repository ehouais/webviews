parser = {
    parseParams: function(str) {
        var tokens = str.split(':'),
            cols = tokens[1].split(',');

        return {
            labels: +tokens[0]-1,
            grouping: cols.map(function(stack) {
                return stack.split('+').map(function(index) {
                    return +index-1;
                });
            })
        }
    },
    parseData: function(str) {
        return str.replace(/;/g, '\n').split('\n').map(function(row) { return row.split(','); });
    }
};
