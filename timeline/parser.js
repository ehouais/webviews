define(['ext_parser'], function(parser) {
    return {
        parseParams: function(str) {
        },
        parseData: function(str) {
            return parser.parse(str);
        }
    };
});
