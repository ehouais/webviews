define(['d3'], function(d3) {
    return function(container) {
        var data,
            svg = d3.select(container).append('svg'),
            chart = svg.append('g')
                .attr('font-family', 'gotham'),
            yScale = d3.scaleLinear(),
            yAxis = d3.axisLeft(yScale),
            yy = chart.append('g')
                .attr('class', 'y axis'),
            groups = chart.append('g'),
            xScale = d3.scaleOrdinal(),
            xAxis = d3.axisBottom(xScale)
                .tickSizeOuter(0),
            xx = chart.append('g')
                .attr('class', 'x axis'),
            cScale = d3.scaleOrdinal(d3.schemeCategory10);

        return {
            //  data = {
            //      values: [{
            //          label: {{string}},       : optional
            //          values: [{{float}}, ...]
            //      }, ...]
            //      labels: [{{string}}, ...]    : optional
            //      grouping: []                 : optional
            //      unit: {{string}}             : optional
            //  }
            update: function(newdata) {
                data = newdata;

                data.nb = (data.labels || data.values[0].values).length; // nb. of series
                data.grouping = data.grouping || d3.range(nb); // grouping layout

                // Nb of ticks on x-axis
                xScale.domain(d3.range(data.values.length)),
                // Y-axis range
                yScale.domain([0, d3.max(data.values, function(d) {
                    return d3.max(d.values.reduce(function(stacks, value, i) {
                        var index = indexes[i];
                        stacks[index] = (stacks[index] || 0) + value;
                        return stacks;
                    }, []));
                })]);

                group = groups
                    .selectAll('.group')
                    .data(data.values)
                    .enter()
                    .append('g')
                    .attr('class', 'group');

                bars = group.selectAll('g')
                    .data(function(d) { return d.values; })
                    .enter()
                    .append('g');

                rects = bars.append('rect')
                    .attr('fill', function(d, i) { return cScale(i); });

                rects.append('title')
                    .text(function(d) { return d; });

                if (labels) {
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
                }

                if (unit) {
                    unitl = chart.append('text')
                        .attr('dy', '-1em')
                        .style('text-anchor', 'end')
                        .text(unit);
                }
            },
            resize: function(margin) {
                var cwidth = width-margins.left-margins.right,
                    cheight = height-margins.top-margins.bottom,
                    fs = Math.max(Math.min(Math.min(cwidth, cheight)/20, 20), 11),
                    heights = [];

                svg
                    .attr('width', width)
                    .attr('height', height);

                chart
                    .attr('transform', 'translate('+margins.left+','+margins.top+')');

                xScale
                    .rangeRoundBands([0, cwidth], nb > 1 ? 0.2 : 0.1);

                xx
                    .attr('transform', 'translate(0,' + cheight + ')')
                    .call(xAxis)
                    .selectAll('text')
                    .style('font-size', fs+'px')
                    .each(function(d, i) {
                        var text = d3.select(this).text(null).attr('y', 4);
                        (values[i].label || '').split('  ').forEach(function(line, l) {
                            text.append('tspan').text(line).attr({x: 0, dy: fs});
                        });
                    });

                yScale
                    .range([cheight, 0]);

                yAxis
                    .ticks(cheight/25)
                    .tickSize(-cwidth);

                yy
                    .call(yAxis)
                    .selectAll('text')
                    .style('font-size', fs+'px');

                yy
                    .selectAll('g')
                    .filter(function(d) { return d; })
                    .classed('minor', true);

                group
                    .attr('transform', function(d, i) { return 'translate('+xScale(i)+',0)'; });

                rects
                    .attr('x', function(d, i) { return indexes[i]*Math.ceil(xScale.rangeBand()/nb); })
                    .attr('y', function(d, i) {
                        var index = d3.select(this.parentNode.parentNode).datum().index;

                        heights[index] = heights[index] || [];
                        heights[index][indexes[i]] = (heights[index][indexes[i]] || 0) + d;
                        return yScale(heights[index][indexes[i]]);
                    })
                    .attr('width', Math.ceil(xScale.rangeBand()/nb))
                    .attr('height', function(d) { return cheight-yScale(d); });

                if (labels) {
                    legend
                        .attr('transform', function(d, i) { return 'translate(0,'+(-(i+2)*fs)+')'; });

                    lrects
                        .attr('x', cwidth-18)
                        .attr('height', fs*0.9);

                    ltexts
                        .attr('x', cwidth-24)
                        .attr('y', fs/2)
                        .style('font-size', fs+'px');
                }

                if (unitl) {
                    unitl
                        .style('font-size', fs+'px');
                }

                //return svg[0][0].getBBox();
            }
        };
    };
})
