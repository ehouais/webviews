define(function() {
    return function(container, resize, margin) {
        return function() {
            var width = container.clientWidth,
                height = container.clientHeight,
                min = Math.min(width, height),
                fontsize = Math.max(Math.min(min/25, 20), 11),
                bbox = resize(0, 0, width, height, fontsize),
                absmargin = margin*min;

            resize(
                -bbox.x+absmargin,
                -bbox.y+absmargin,
                2*width-bbox.width-2*absmargin,
                2*height-bbox.height-2*absmargin,
                fontsize
            );
        };
    };
});
