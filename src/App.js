import { useState, useEffect } from 'react'
import Map from './components/Map'
import axios from 'axios'
import * as topojson from 'topojson'

const urlStocks = 'https://7hcpr5.deta.dev/'

const getData = async (url, setStockData) => {
  await axios.get(url).then((res) => setStockData(res.data))
}

function App() {
  const [stockData, setStockData] = useState('')
  const [worldData, setWorldData] = useState('')

  useEffect(() => {
    getData(urlStocks, setStockData)
    const topodata = require('./data/world_topo.json')
    setWorldData(
      topojson.feature(topodata, topodata.objects.countries).features
    )
  }, [])

  return (
    <div>
      <h1>Weekly Percent Change to financial markets</h1>
      <Map stockData={stockData} worldData={worldData} />
      <p>
        All the data is scrapped from{' '}
        <a
          href='https://tradingeconomics.com/stocks'
          rel='noreferrer'
          target='_blank'
        >
          https://tradingeconomics.com/stocks
        </a>
        {''} and the results are current
      </p>
    </div>
  )
}

export default App
