import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import '../styles/map.css'

const findPercentChange = (countryItem, stockData) => {
  let geo_country_name = countryItem.properties.name
  let stockItem = stockData.find((item) => {
    return item[0] === geo_country_name
  })
  if (!stockItem) {
    stockItem = [0, 0]
  }
  return stockItem
}

const getCountryName = (data) => {
  return data.properties.name
}

const findPercentChangeV2 = (country_name, stockData) => {
  let stockItem = stockData.find((item) => {
    return item[0] === country_name
  })
  let response = ''
  if (!stockItem) {
    response = 'no data'
  } else {
    response = stockItem[1] + '%'
  }
  return response
}

const Map = ({ stockData, worldData }) => {
  let ReferenceD3 = 'world-map'
  ReferenceD3 = useRef()
  let Legend = 'legend'
  Legend = useRef()
  const width = window.innerWidth * 0.7
  const height = window.innerHeight * 0.6
  const margin = { top: 10, right: 10, bottom: 10, left: 10 }

  const projection = d3
    .geoMercator()
    .scale(width / 6.7)
    .translate([width / 2, height / 1.5])
  const path = d3.geoPath(projection)
  const tooldiv = d3
    .select('#ReferenceD3')
    .append('div')
    .style('visibility', 'hidden')
    .style('position', 'absolute')
    .style('background-color', '#ffa07a')
    .style('color', 'white')
    .style('width', width * 0.1)
    .style('padding', '2px')
    .style('font-size', width * 0.1)

  let mouseOver = function (e, d) {
    let country_name = getCountryName(d)
    let percent_change = findPercentChangeV2(country_name, stockData)

    d3.selectAll('.country').transition().duration(200).style('opacity', 0.8)
    d3.select(this.parentNode.appendChild(this))
      .transition()
      .duration(200)
      .style('opacity', 1)
      .style('stroke', 'black')

    tooldiv
      .style('visibility', 'visible')
      .text(country_name + ': ' + percent_change)
      .style('top', e.pageY - height * 0.085 + 'px')
      .style('left', e.pageX - width * 0.045 + 'px')
  }

  let mouseLeave = function (e, d) {
    d3.selectAll('.country')
      .transition()
      .duration(200)
      .style('opacity', 1)
      .style('stroke', '#999')
    d3.select(this).transition().duration(200).style('stroke', '#999')
    tooldiv.style('visibility', 'hidden')
  }
  const colors = [
    '#ff0000',
    '#cc0033',
    '#990066',
    '#660099',
    '#3300cc',
    '#0000ff',
  ]
  const colorText = ['<3%', '<1.5%', '<0%', '>0%', '>1.5%', '>3%']
  const legend = d3.select(Legend.current)
  legend.selectAll('*').remove()
  legend
    .attr('width', width * 0.11)
    .attr('height', height + margin.top + margin.bottom)
    .style('background', '#f7f7f7')
  legend
    .selectAll('mydots')
    .data(colors)
    .enter()
    .append('circle')
    .attr('cx', width * 0.015)
    .attr('cy', function (d, i) {
      return height * 0.08 + i * height * 0.08
    })
    .attr('r', width * 0.011)
    .style('fill', function (d) {
      return d
    })
  legend
    .selectAll('mylabels')
    .data(colorText)
    .enter()
    .append('text')
    .attr('x', width * 0.03)
    .attr('y', function (d, i) {
      return height * 0.0801 + i * height * 0.0801
    })
    .text(function (d) {
      return d
    })
    .attr('text-anchor', 'left')
    .style('alignment-baseline', 'middle')

  useEffect(() => {
    const svg = d3.select(ReferenceD3.current)
    svg.selectAll('*').remove()

    svg
      .attr('width', width * 0.9 + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('background', '#f7f7f7')

    svg
      .selectAll('path')
      .data(worldData)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path)
      .attr('fill', (countryItem) => {
        let stockItem = findPercentChange(countryItem, stockData)
        let percentChange = +stockItem[1]
        if (percentChange <= -3) {
          return '#ff0000'
        } else if (percentChange > -3 && percentChange <= -1.5) {
          return '#cc0033'
        } else if (percentChange > -1.5 && percentChange < 0) {
          return '#990066'
        } else if (percentChange > 0 && percentChange <= 1.5) {
          return '#660099'
        } else if (percentChange > 1.5 && percentChange <= 3) {
          return '#3300cc'
        } else if (percentChange > 3) {
          return '#0000ff'
        } else {
          return '#d3d3d3'
        }
      })
      .on('mouseover', mouseOver)
      .on('mouseleave', mouseLeave)
  }, [stockData])

  return (
    <div className='world-map-container'>
      <div className='legend'>
        <svg ref={Legend} />
      </div>
      <div id='ReferenceD3'>
        <svg ref={ReferenceD3} />
      </div>
    </div>
  )
}

export default Map
