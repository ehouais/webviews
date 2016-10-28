define(['d3'], function(d3) {
    return function(container, params) {
        var data,
            svg = d3.select('body').append('svg'),
            chart = svg.append('g'),
            color = d3.scaleOrdinal(d3.schemeCategory10),
            arc = d3.arc().innerRadius(0),
            pie = d3.pie().value(function(d) { return d.value; }),
            path,
            ticks,
            labels;

        var resize = function(left, top, width, height) {
                var radius = Math.min(width, height)/2,
                    fs = Math.max(Math.min(radius/10, 20), 11),
                    heights = [];

                svg
                    .attr('width', container.clientWidth)
                    .attr('height', container.clientHeight);

                chart
                    .attr('transform', 'translate('+(left+width/2)+','+(top+height/2)+')');

                arc
                    .outerRadius(radius);

                paths
                    .attr('d', arc);

                ticks
                    .attr('d', function(d) {
                        var angle = (d.startAngle+d.endAngle)/2-Math.PI/2,
                            cos = Math.cos(angle),
                            sin = Math.sin(angle),
                            dr = fs/2+Math.tan(angle);
                        return 'M'+(radius+2)*cos+' '+(radius+2)*sin+'l'+dr*cos+' '+dr*sin+'l'+radius*0.2*(cos > 0 ? 1 : -1)+' 0';
                    });

                labels
                    .style('font-size', fs+'px')
                    .attr('text-anchor', function(d) {
                        var angle = (d.startAngle+d.endAngle)/2-Math.PI/2,
                            cos = Math.cos(angle);

                        return cos > 0 ? 'start' : 'end';
                    })
                    .attr('transform', function(d) {
                        var angle = (d.startAngle+d.endAngle)/2-Math.PI/2,
                            cos = Math.cos(angle),
                            sin = Math.sin(angle),
                            dr = fs/2+Math.tan(angle);

                        return 'translate('+((radius+2+dr)*cos+radius*0.21*(cos > 0 ? 1 : -1))+','+(radius+2+dr)*sin+')';
                    });

                return svg._groups[0][0].getBBox();
            };

        return {
            update: function(rows) {
                data = pie(rows.map(function(row) {
                    return {label: row[params.labels], value: row[params.values]};
                }));

                paths = chart.selectAll('path')
                    .data(data)
                    .enter()
                    .append('path')
                    .attr('fill', function(d, i) { return color(i); });

                ticks = chart.selectAll('.tick')
                    .data(data)
                    .enter()
                    .append('path')
                    .attr('class', 'tick');

                labels = chart.selectAll('text')
                    .data(data)
                    .enter()
                    .append('text')
                    .attr('class', 'label')
                    .attr('dy', '0.35em')
                    .attr('text-anchor', 'middle')
                    .text(function(d) { return d.data.label; });

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
