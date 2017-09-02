import React, { Component } from 'react'
import './App.css'
import Chart from './component/chart.js'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <h2>运动信息</h2>
        </div>
        <Chart />
      </div>
    )
  }
}

export default App
