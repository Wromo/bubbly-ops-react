import React, { Component } from 'react'
import { Card, List, Button, Icon } from 'antd'
import axios from 'axios';

export class Settings extends Component {
  state = {
    employees: [],
    services: []
  }

  async componentDidMount() {
    const employees = await axios.get(`${process.env.REACT_APP_BACKEND_API}/employees`)
    const services = await axios.get(`${process.env.REACT_APP_BACKEND_API}/services`)
    this.setState({ employees: employees.data, services: services.data })
  }

  render() {
    if (this.state.employees.length < 0) return null
    return (
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 700 }}>Settings</h1>
        <p>Welcome to Bubbly Operations Center, please login or register to get started.</p>
        <div style={{ padding: 24, margin: "auto", backgroundColor: "#fff", borderRadius: 5 }} >
          <Card bordered={false} title="Employees" extra={<Icon type="plus" /> }>
            <List itemLayout="horizontal" dataSource={this.state.employees} renderItem={item => (
              <List.Item actions={[<Icon style={fontSize} type="edit" />, <Icon style={fontSize} type="delete" />]}>
                <List.Item.Meta title={item.name} description={`Total Services: ${item.jobs.length}`} /> 
              </List.Item> 
            )}
          />
          </Card>
        </div>
        <br />
        <div style={{ padding: 24, margin: "auto", backgroundColor: "#fff", borderRadius: 5 }} >
          <Card bordered={false} title="Services" extra={<Icon style={fontSize} type="plus" /> } >
            <List itemLayout="horizontal" dataSource={this.state.services} renderItem={item => (
              <List.Item actions={[<Icon style={fontSize} type="edit" />, <Icon style={fontSize} type="delete" />]}>
                <List.Item.Meta title={item.name} description={(
                <div>
                <Icon type="dollar" /> {item.price}
                <Icon type="hourglass" style={{ marginLeft: 10 }} /> {item.duration} hours
                <Icon type="car" style={{ marginLeft: 10 }} /> {item.vehicleType}
              </div>
                )} /> 
              </List.Item> 
            )}
          />
          </Card>
        </div>
      </div>
    )
  }
}

const fontSize = {
  fontSize: 16,
  color: "#2c3e50"
}

export default Settings
