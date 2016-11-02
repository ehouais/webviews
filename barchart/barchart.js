define(['d3'], function(d3) {
    return function(container, params) {
        var dgroups,
            slabels,
            lcol,
            nb_series,
            nb_rows,
            grouping,
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
            ltexts;

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
                    .padding(nb_series > 1 ? 0.2 : 0.1);

                var colwidth = xScale.bandwidth()/grouping.length;

                xx
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(xAxis)
                    .selectAll('text')
                    .style('font-size', fs+'px')
                    .each(function(d, i) {
                        var text = d3.select(this).text(null);
                        dgroups[i].label.split('-').forEach(function(line) {
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
                    .attr('x', function(d, i) { return d.col*colwidth; })
                    .attr('y', function(d) { return yScale(d.top); })
                    .attr('width', colwidth)
                    .attr('height', function(d) { return height-yScale(d.height); });

                if (slabels) {
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

                return svg._groups[0][0].getBBox();
            };

        return {
            //  data = [
            //      [val, val, ...]
            //      , ...
            //  ]
            update: function(rows) {
                lcol = params.labels || 0;
                nb_series = rows[0].length-1;
                grouping = params.grouping || d3.range(nb_series).map(function(index) {
                    return [index+1];
                });

                slabels = [];
                grouping.forEach(function(stack) {
                    stack.forEach(function(col_index) {
                        slabels.push(rows[0][col_index].replace(/_/g, ' '));
                    });
                });

                rows.shift();
                nb_rows = rows.length;

                // Pre-compute bar dimensions according to values and grouping
                var max = 0;
                dgroups = rows.map(function(row) {
                    var group = {label: row[lcol], values: []};
                    grouping.forEach(function(stack, i) {
                        var height = 0;
                        stack.forEach(function(col_index) {
                            group.values.push({
                                col: i,
                                height: value = +row[col_index],
                                top: height += value
                            });
                        });
                        max = Math.max(max, height);
                    });
                    return group;
                });

                // Nb of ticks on x-axis
                xScale.domain(d3.range(nb_rows)),

                // Compute max bar height to set y-axis range, taking grouping into account
                yScale.domain([0, max]);

                group = groups
                    .selectAll('.group')
                    .data(dgroups)
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

                if (slabels) {
                    legend = chart.append('g').selectAll('.legend')
                        .data(slabels)
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

                this.resize();
            },
            resize: function() {
                var width = container.clientWidth,
                    height = container.clientHeight,
                    bbox = resize(0, 0, width, height),
                    absmargin = params.margin*Math.min(width, height);

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
