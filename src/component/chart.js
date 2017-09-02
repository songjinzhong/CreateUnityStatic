import React, { Component } from 'react'
import { Tabs, WhiteSpace, Toast } from 'antd-mobile'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import 'whatwg-fetch'
import moment from 'moment'

const domain = `//127.0.0.1:8080`
const TabPane = Tabs.TabPane
const dateFormat = 'MM-DD HH:mm'
const x_date = 'mm:ss'

class Chart extends Component {
  constructor (props) {
    super(props)
    this.state = {
      lineData: [],
      width: 0,
      times: [],
    }
    this.db = {
      times: [],
      tabPanes: []
    }
  }
  componentDidMount () {
    const chart = this.refs.chart
    const style = window.getComputedStyle(chart)
    const width = parseInt(style['width'], 10)
    this.setState({
      width
    })
    const getAll = `${domain}/getAll`
    this._fetch(getAll).then(data => {
      data.sort((a, b) => {
        return b - a
      })
      data.splice(10)
      const tabPanes = data.map(v => {
        return moment(v).format(dateFormat)
      })
      this.db = {
        times: data,
        tabPanes
      }
      this._getLineData(data[0])
    }, err => {
      Toast.info(err)
    })
  }
  render () {
    const { lineData, width } = this.state
    return (
      <div id='chart-body' ref='chart'>
        <Tabs defaultActiveKey='0' onChange={this._onChange} pageSize={5}>
          {this._makeMultiTabPane()}
        </Tabs>
        <WhiteSpace />
        <LineChart width={width} height={200} data={lineData}
          margin={{ top: 15, right: 0, left: 0, bottom: 5 }}>
          <XAxis dataKey='index' />
          <YAxis yAxisId='l' />
          <YAxis yAxisId='r' orientation='right' />
          <CartesianGrid strokeDasharray='3 3' />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Line type='monotone' dataKey='speed' stroke='#8884d8' name='速度(m/s)' yAxisId='l' unit='m/s' />
          <Line type='monotone' dataKey='distance' stroke='#82ca9d' name='距离(m)' yAxisId='r' unit='m' />
        </LineChart>
      </div>
    )
  }
  _fetch = (url, param) => {
    param = Object.assign({
      method: 'get'
    }, param)
    return fetch(url, param).then(data => {
      return data.json()
    }, err => {
      return Promise.reject(err)
    }).catch(e => {
      return Promise.reject(e.message)
    })
  }
  _makeMultiTabPane = () => {
    return this.db.tabPanes.map((v, index) => {
      return (
        <TabPane tab={v} key={index} />
      )
    })
  }
  _onChange = (value) => {
    this._getLineData(this.db.times[value])
  }
  _getLineData = (timer) => {
    const searchUrl = `${domain}/timer/${timer}`
    this._fetch(searchUrl).then(data => {
      const lineData = data.map((value, index) => {
        const { speed, distance } = value
        return {
          speed,
          distance,
          index: moment(index * 20 * 1000).format(x_date)
        }
      })
      this.setState({
        lineData
      })
    }, err => {
      Toast.info(err)
    }) 
  }
}

export default Chart