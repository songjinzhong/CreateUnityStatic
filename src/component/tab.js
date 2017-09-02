import { Tabs, WhiteSpace } from 'antd-mobile'
import React from 'react'

const TabPane = Tabs.TabPane

function callback (key) {
  console.log('onChange', key)
}
function handleTabClick (key) {
  console.log('onTabClick', key)
}
const makeTabPane = key => {
  return (
    <TabPane tab={`Option${key}`} key={key} />
  )
}

const makeMultiTabPane = (count) => {
  const result = []
  for (let i = 0; i <= count; i++) {
    result.push(makeTabPane(i))
  }
  return result
}

const TabExample = (props) => {
  return (
    <div>
      <Tabs defaultActiveKey='0' onChange={callback} pageSize={5} onTabClick={handleTabClick}>
        {makeMultiTabPane(11)}
      </Tabs>
      <WhiteSpace />
    </div>
  )
}
export default TabExample
