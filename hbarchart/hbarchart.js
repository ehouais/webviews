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
            vScale = d3.scaleLinear(),
            bScale = d3.scaleBand(),

            xAxis = d3.axisBottom(vScale),
            yAxis = d3.axisLeft(bScale)
                .tickSizeOuter(0),

            xx = chart.append('g')
                .attr('class', 'x axis'),
            yy = chart.append('g')
                .attr('class', 'y axis'),
            groups = chart.append('g'),

            cScale = d3.scaleOrdinal(d3.schemeCategory10),
            legend,
            lrects,
            ltexts,
            unitl;

        var resize = function(left, top, width, height, fontsize) {
                var heights = [];

                svg
                    .attr('width', container.clientWidth)
                    .attr('height', container.clientHeight);

                chart
                    .attr('transform', 'translate('+left+','+top+')');

                bScale
                    .range([0, height])
                    .padding(nb_series > 1 ? 0.2 : 0.1);

                var rowheight = bScale.bandwidth()/grouping.length;

                vScale
                    .range([0, width]);

                xAxis
                    .ticks(Math.min(11, width/25))
                    .tickSize(-height);

                xx
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(xAxis)
                    .selectAll('text')
                    .style('font-size', fontsize+'px')
                    .attr('dy', fontsize);

                xx
                    .selectAll('g')
                    .filter(function(d) { return d; })
                    .classed('minor', true);

                yy
                    .call(yAxis)
                    .selectAll('text')
                    .style('font-size', fontsize+'px')
                    .each(function(d, i) {
                        var text = d3.select(this).text(null);
                        dgroups[i].label.split('-').forEach(function(line) {
                            text.append('tspan').text(line).attr('y', 0).attr('dx', -fontsize/3);
                        });
                    });

                group
                    .attr('transform', function(d, i) {
                        return 'translate(0,'+(bScale(i))+')';
                    });

                rects
                    .attr('x', function(d, i) { return vScale(d.left); })
                    .attr('y', function(d) { return d.row*rowheight; })
                    .attr('width', function(d) { return vScale(d.width); })
                    .attr('height', rowheight);

                if (slabels) {
                    legend
                        .attr('transform', function(d, i) { return 'translate(0,'+(-(i+2)*fontsize)+')'; });

                    lrects
                        .attr('x', width-18)
                        .attr('height', fontsize*0.9);

                    ltexts
                        .attr('x', width-24)
                        .attr('y', fontsize/2)
                        .style('font-size', fontsize+'px');
                }

                if (unitl) {
                    unitl
                        .attr('dy', '-'+fontsize+'px')
                        .style('font-size', fontsize+'px');
                }

                return svg._groups[0][0].getBBox();
            };

        return {
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

                if (rows[0][0]) {
                    unitl = chart.append('text')
                        .style('text-anchor', 'end')
                        .text(rows[0][0]);
                }

                rows.shift();
                nb_rows = rows.length;

                // Pre-compute bar dimensions according to values and grouping
                var max = 0;
                dgroups = rows.map(function(row) {
                    var group = {label: row[lcol], values: []};
                    grouping.forEach(function(stack, i) {
                        var width = 0;
                        stack.forEach(function(col_index) {
                            var value = (row[col_index] || '').split('+').reduce(function(sum, term) {
                                return +term+sum;
                            }, 0);
                            group.values.push({
                                row: i,
                                left: width,
                                width: value
                            });
                            width += value;
                        });
                        max = Math.max(max, width);
                    });
                    return group;
                });

                // Nb of ticks on x-axis
                bScale.domain(d3.range(nb_rows)),

                // Compute max bar height to set y-axis range, taking grouping into account
                vScale.domain([0, max]);

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
})
