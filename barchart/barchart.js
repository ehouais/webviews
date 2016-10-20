define(['d3'], function(d3) {
    return function(container, margin) {
        var data,
            svg = d3.select(container).append('svg'),
            chart = svg.append('g'),
            yScale = d3.scaleLinear(),
            yAxis = d3.axisLeft(yScale),
            yy = chart.append('g')
                .attr('class', 'y axis'),
            groups = chart.append('g'),
            xScale = d3.scaleBand(),
            xAxis = d3.axisBottom(xScale)
                .tickSizeOuter(0),
            xx = chart.append('g')
                .attr('class', 'x axis'),
            cScale = d3.scaleOrdinal(d3.schemeCategory10),
            legend,
            lrects,
            ltexts,
            unitl;

        var resize = function(left, top, width, height) {
                var fs = Math.max(Math.min(Math.min(width, height)/20, 20), 11),
                    heights = [];

                svg
                    .attr('width', container.clientWidth)
                    .attr('height', container.clientHeight);

                chart
                    .attr('transform', 'translate('+left+','+top+')');

                xScale
                    .range([0, width])
                    .padding(data.nb > 1 ? 0.2 : 0.1);

                var colwidth = xScale.bandwidth()/data.grouping.length;

                xx
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(xAxis)
                    .selectAll('text')
                    .style('font-size', fs+'px')
                    .each(function(d, i) {
                        var text = d3.select(this).text(null);
                        data.values[i].label.forEach(function(line, l) {
                            text.append('tspan').text(line).attr('x', 0).attr('dy', fs);
                        });
                    });

                yScale
                    .range([height, 0]);

                yAxis
                    .ticks(Math.min(11, height/25))
                    .tickSize(-width);

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
                    .attr('x', function(d, i) { return d.index*colwidth; })
                    .attr('y', function(d) { return yScale(d.top); })
                    .attr('width', colwidth)
                    .attr('height', function(d) { return height-yScale(d.height); });

                if (data.labels) {
                    legend
                        .attr('transform', function(d, i) { return 'translate(0,'+(-(i+2)*fs)+')'; });

                    lrects
                        .attr('x', width-18)
                        .attr('height', fs*0.9);

                    ltexts
                        .attr('x', width-24)
                        .attr('y', fs/2)
                        .style('font-size', fs+'px');
                }

                if (unitl) {
                    unitl
                        .style('font-size', fs+'px');
                }

                return svg._groups[0][0].getBBox();
            };

        return {
            //  data = {
            //      values: [{
            //          values: [{{float}}, ...]
            //          label: {{string}}        : optional
            //      }, ...]
            //      labels: [{{string}}, ...]    : optional
            //      grouping: []                 : optional
            //      unit: {{string}}             : optional
            //  }
            update: function(newdata) {
                data = newdata;

                data.nb = (data.labels || data.values[0].values).length; // nb. of series
                data.grouping = data.grouping || d3.range(data.nb); // grouping layout

                // Pre-transform data according to grouping
                var max = 0;
                data.values.forEach(function(group) {
                    var index = 0;
                    data.grouping.forEach(function(stack, i) {
                        for (var height = 0, value; stack--; index++) {
                            group.values[index] = {
                                index: i,
                                height: value = group.values[index],
                                top: height += value
                            };
                        }
                        max = Math.max(max, height);
                    });
                });

                // Nb of ticks on x-axis
                xScale.domain(d3.range(data.values.length)),

                // Compute max bar height to set y-axis range, taking grouping into account
                yScale.domain([0, max]);

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
                    .text(function(d) { return d.height; });

                if (data.labels) {
                    legend = chart.append('g').selectAll('.legend')
                        .data(data.labels)
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

                if (data.unit) {
                    unitl = chart.append('text')
                        .attr('dy', '-1em')
                        .style('text-anchor', 'end')
                        .text(data.unit);
                }

                this.resize();
            },
            resize: function() {
                var width = container.clientWidth,
                    height = container.clientHeight,
                    bbox = resize(0, 0, width, height),
                    absmargin = margin*Math.min(width, height);

                resize(
                    -bbox.x+absmargin,
                    -bbox.y+absmargin,
                    2*width-bbox.width-2*absmargin,
                    2*height-bbox.height-2*absmargin
                );
            }
        };
    };
})
