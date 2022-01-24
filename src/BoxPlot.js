import * as d3 from 'd3';
import React, {useRef, useEffect} from 'react';

function BoxPlot({width, height, margin}) {
    const ref = useRef();

    useEffect(() => {
        draw();
    }, []);

    const draw = () => {

        const svg = d3.select(ref.current);
        d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv", data => {
            // compute quartiles, median, innter quantile range min and max
            let sumstat = d3.nest() // nest function allwos to group the calculation per level of
                .key(d => d.Species)
                .rollup(d => {
                    let q1 = d3.quantile(d.map(g => g.Sepal_Length)
                        .sort(d3.ascending), .25)
                    let median = d3.quantile(d.map(function (g) {
                        return g.Sepal_Length;
                    }).sort(d3.ascending), .5)
                    let q3 = d3.quantile(d.map(function (g) {
                        return g.Sepal_Length;
                    }).sort(d3.ascending), .75)
                    let interQuantileRange = q3 - q1
                    let min = q1 - 1.5 * interQuantileRange
                    let max = q3 + 1.5 * interQuantileRange
                    return ({
                        q1: q1,
                        median: median,
                        q3: q3,
                        interQuantileRange: interQuantileRange,
                        min: min,
                        max: max
                    })
                }).entries(data)
            let xScale = d3.scaleBand()
                .range([0, width])
                .domain(["setosa", "versicolor", "virginica"])
                .paddingInner(1)
                .paddingOuter(.5)
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(xScale))
            let yScale = d3.scaleLinear()
                .domain([3, 9])
                .range([height, 0])
            svg.append("g").call(d3.axisLeft(yScale))
            // Show the main vertical line
            svg
                .selectAll("vertLines")
                .data(sumstat)
                .enter()
                .append("line")
                .attr("x1", function (d) {
                    return (xScale(d.key))
                })
                .attr("x2", function (d) {
                    return (xScale(d.key))
                })
                .attr("y1", function (d) {
                    return (yScale(d.value.min))
                })
                .attr("y2", function (d) {
                    return (yScale(d.value.max))
                })
                .attr("stroke", "black")
                .style("width", 40)
            // rectangle for the main box
            let boxWidth = 100
            svg
                .selectAll("boxes")
                .data(sumstat)
                .enter()
                .append("rect")
                .attr("x", function (d) {
                    return (xScale(d.key) - boxWidth / 2)
                })
                .attr("y", function (d) {
                    return (yScale(d.value.q3))
                })
                .attr("height", function (d) {
                    return (yScale(d.value.q1) - yScale(d.value.q3))
                })
                .attr("width", boxWidth)
                .attr("stroke", "black")
                .style("fill", "#69b3a2")
            // Show the median
            svg
                .selectAll("medianLines")
                .data(sumstat)
                .enter()
                .append("line")
                .attr("x1", function (d) {
                    return (xScale(d.key) - boxWidth / 2)
                })
                .attr("x2", function (d) {
                    return (xScale(d.key) + boxWidth / 2)
                })
                .attr("y1", function (d) {
                    return (yScale(d.value.median))
                })
                .attr("y2", function (d) {
                    return (yScale(d.value.median))
                })
                .attr("stroke", "black")
                .style("width", 80)
        })

    }


    return (
        <div className="chart">
            <svg height={height + margin.left + margin.right} width={width + margin.left + margin.right}>
                <g ref={ref} transform="translate(40,10)">
                </g>
            </svg>
        </div>

    )

}

export default BoxPlot;