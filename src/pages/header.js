import React from 'react'
import { Menu, Layout } from 'antd'
import { Link, withRouter } from 'react-router-dom'
const Header = Layout.Header
class HeadComp extends React.Component{
  render(){

    return (
      <Header>
        <Menu
          theme='dark'
          mode='horizontal'
        //   defaultSelectedKeys={[this.props.location.pathname]}
          style={{lineHeight:'64px'}}
        >
          <Menu.Item >
            <Link >Home</Link>
          </Menu.Item>
          <Menu.Item >
            <Link >About Us</Link>
          </Menu.Item>
          <Menu.Item >
            <Link >Contact Us</Link>
          </Menu.Item>
        </Menu>
      </Header>
    )
  }
}

export default HeadComp