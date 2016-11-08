define(['d3', '../timeline/timescale'], function(d3, Timescale) {
    return function(container, params) {
        var svg = d3.select('body').append('svg'),
            chart = svg.append('g'),
            vScale = d3.scaleLinear(),
            yAxis = d3.axisLeft(vScale),
            yy = chart.append('g')
                .attr('class', 'y axis'),
            lines = chart.append('g'),
            tScale = d3.scaleTime(),
            cScale = d3.scaleOrdinal(d3.schemeCategory10),
            line,
            marker,
            svgline,
            labels,
            legend,
            text,
            lrects,
            ltexts,
            timescale = Timescale(chart, tScale),
            resize = function(left, top, width, height, fontsize) {
                var heights = [];

                svg
                    .attr('width', container.clientWidth)
                    .attr('height', container.clientHeight);

                chart
                    .attr('transform', 'translate('+left+','+top+')');

                /**xx
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(xAxis)
                    .selectAll('text')
                    .style('font-size', fontsize+'px')
                    .each(function(d, i) {
                        var text = d3.select(this).text(null).attr('y', 4);
                        (values.labels[i]).split('  ').forEach(function(line, l) {
                            text.append('tspan').text(line).attr({x: 0, dy: fontsize});
                        });
                    });*/

                vScale
                    .range([height, 0]);

                yAxis
                    .ticks(height/25)
                    .tickSize(-width);

                yy
                    .call(yAxis)
                    .selectAll('text')
                    .style('font-size', fontsize+'px');

                yy
                    .selectAll('g')
                    .filter(function(d) { return d; })
                    .classed('minor', true);

                line
                    .attr('d', svgline)
                    .attr('stroke-width', fontsize/5);

                if (labels) {
                    legend
                        .attr('transform', function(d, i) { return 'translate(0,'+(-(i+2)*fontsize)+')'; });

                    lrects
                        .attr('x', width-18)
                        .attr('y', fontsize/2)
                        .attr('height', fontsize/5);

                    ltexts
                        .attr('x', width-24)
                        .attr('y', fontsize/2)
                        .style('font-size', fontsize+'px');
                }

                return svg._groups[0][0].getBBox();
            };

        return {
            update: function(series) {
                var start = +Infinity,
                    end = -Infinity,
                    max = 0;

                series.forEach(function(serie) {
                    serie.values.forEach(function(pair, i) {
                        start = Math.min(start, pair.date);
                        end = Math.max(end, pair.date);
                        max = Math.max(max, pair.value);
                    });
                });

                tScale.domain([start, end]);
                vScale.domain([0, max]);

                svgline = d3.line()
                    .x(function(d, i) { return tScale(i); })
                    .y(function(d) { return vScale(d); })
                    .defined(function(d) { return d != null; });

                line = lines
                    .selectAll('.line')
                    .data(series)
                    .enter()
                    .append('path')
                    .attr('class', 'line')
                    .attr('stroke', function(d, i) { return cScale(i); })
                    .attr('marker-start', function(d, i) { return 'url(#marker_'+i+')'; })
                    .attr('marker-mid', function(d, i) { return 'url(#marker_'+i+')'; })
                    .attr('marker-end', function(d, i) { return 'url(#marker_'+i+')'; });

                /*marker = svg.append('defs').selectAll('marker')
                    .data(series)
                    .enter()
                    .append('marker')
                    .attr({
                        id: function(d, i) { return 'marker_'+i; },
                        markerWidth: 8,
                        markerHeight: 8,
                        refX: 5,
                        refY: 5
                    })
                    .append('circle')
                    .attr({
                        cx: 5,
                        cy: 5,
                        r: 1.2,
                        fill: function(d, i) { return cScale(i); },
                        class: 'circleMarker'
                    });*/

                /*if (labels) {
                    legend = chart.append('g').selectAll('.legend')
                        .data(labels)
                        .enter()
                        .append('g')
                        .attr('class', 'legend');

                    lrects = legend.append('rect')
                        .attr('width', 18)
                        .style('fill', function(d, i) { return cScale(i); });

                    ltexts = legend.append('text')
                        .attr('dy', '.35em')
                        .style('text-anchor', 'end')
                        .text(function(d) { return d; });
                }*/

                this.resize();
            },
            resize: function() {
                var width = container.clientWidth,
                    height = container.clientHeight,
                    fontsize = Math.max(Math.min(Math.min(width, height)/25, 20), 11),
                    bbox = resize(0, 0, width, height, fontsize),
                    absmargin = params.margin*Math.min(width, height);

                resize(
                    -bbox.x+absmargin,
                    -bbox.y+absmargin,
                    2*width-bbox.width-2*absmargin,
                    2*height-bbox.height-2*absmargin,
                    fontsize
                );
            }
        };
    };
});
