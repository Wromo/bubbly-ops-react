import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { Card, Row, Popconfirm, Typography, Icon, Button, Input, Badge, Divider, List, Drawer, Tag, Timeline, Steps } from 'antd';
import dateFormat from 'dateformat';
import moment from 'moment'
import axios from 'axios'

const { Text } = Typography;
const { CheckableTag } = Tag
const { TextArea } = Input
const { Step } = Steps

export class JobCard extends Component {
  state = {
    isVisible: false,
    visible: false,
    isCompleted: false,
    input: '',
  }

componentDidUpdate(prevProps) {
  if (prevProps.isLoading !== this.props.isLoading) {
      this.setState({ isLoading: this.props.isLoading })
  }
}

// formats the event date to display only time
formatDate = () => {
  const { job } = this.props

  if (job.currentStep === 3) {
    return [moment(job.end).calendar(), moment(job.start).calendar()]
  } else if (job.currentStep === 2) {
    return [moment(job.start).calendar(), `Expected: ${moment(job.jobData.end.dateTime).calendar()}`];
  } else if (job.currentStep === 1 ) {
    const startTime = job.jobData.start.dateTime;
    const endTime = job.jobData.end.dateTime;
    const date = [`Expected: ${moment(startTime).calendar()}`, `Expected: ${moment(endTime).calendar()}`];
  
    return date
  }
}

// formats vehicle information to display only the vehicle make & model
formatVehicleInfo = () => {
  const { job } = this.props
  if (job.currentStep === 3) return `${job.jobData.vehicleType.make} ${job.jobData.vehicleType.model}`
  if (job.isCompleted) return `${job.vehicleType.make} ${job.vehicleType.model}`

  if (!job.jobData.description) return "Not Provided";
  const regex = /\s\w*/g;
  let str = job.jobData.description.match(regex);

  const car = str.slice(12, 14);
  if (car.length > 0 ) return car;
  return "Not Provided"
}

// formats the summary property of event to display only the service name and the customer's name
formatSummary = () => {
  const { job } = this.props
  if (!job.jobData.summary) return "not found"
  const regex = /[^0-9]/g;
  const summary = job.jobData.summary.match(regex);

  return summary;
}

// formats the location property of event
formatLocation = () => {
  const { event } = this.props;
  return <span><i style={{ color: "#2c3e50" }} className="fas fa-map-marker-alt"></i> <span> {event.location}</span></span>
}

formatPrice = () => {
  const { job } = this.props
  if (job.serviceType) return `$${job.serviceType.price}`
  else return "$0"
}

getCurrentLabel = () => {
  const { job } = this.props
  if (job.currentStep === 1) {
    return (
      <div>
        <h4 style={{ fontWeight: 700, marginBottom: -2 }}>On the way</h4>
        <Text style={{ fontSize: 12 }} type="secondary">{moment(job.start).fromNow()}</Text> 
      </div>
    )
  } else if (job.currentStep === 2) {
    return (
      <div>
        <h4 style={{ fontWeight: 700, marginBottom: -2 }}>Service Began</h4>
        <Text style={{ fontSize: 12 }} type="secondary">{moment(job.start).fromNow()}</Text> 
      </div>
    )
  } else {
    return (
      <div>
        <h4 style={{ fontWeight: 700, marginBottom: -2 }}>Completed</h4>
        <Text style={{ fontSize: 12 }} type="secondary">{moment(job.end).fromNow()}</Text> 
      </div>
    )
  }
}

  render() {
    const { job, isMobile, i, progress, handleBegin } = this.props;
    console.log(job)

    if (job.currentStep === 0) return null

    if (isMobile) {
      return (
        <React.Fragment>
          <Card size="small" type="plus-circle" theme="outlined" style={cardStyle} >
            <div style={{ padding: 10 }}>
              <div>
                <p style={{ fontWeight: 700 }} >{this.formatSummary()}</p>
                <Icon type="environment" style={{ marginRight: 5 }} /><Text type="secondary" style={{ fontSize: 12 }} >{job.jobData.location}</Text>
                <br />
                <Icon type="clock-circle" style={{ marginRight: 5 }} /><Text type="secondary" style={{ fontSize: 12 }} >{this.formatDate()}</Text> 
                <br />
                <Icon type="car" style={{ marginRight: 5 }} /><Text type="secondary" style={{ fontSize: 12 }} >{this.formatVehicleInfo()}</Text>
              </div>
              {job.isCompleted || i !== 0 ? null : <Button onClick={() => handleBegin(job)} style={{ marginTop: 10, width: "100%" }} type="primary" >Begin</Button>}
            </div>
          </Card>
        </React.Fragment>
      )
    } 

    else if (progress) {
      return (
        <React.Fragment>
          <Card size="small" type="plus-circle" theme="outlined" style={cardStyle} >
            <div style={{ padding: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "50% 50%" }} >
              <div>
                <h3 style={{ fontWeight: 700, display: "inline" }} >{this.formatSummary()} </h3>
                <br />
                <Icon type="calendar" style={{ marginRight: 5 }} /><Text type="secondary" style={{ fontSize: 12 }} >{moment(job.jobData.start.dateTime).format('L')}</Text> 
                <br />
                <Icon type="car" style={{ marginRight: 5 }} /><Text type="secondary" style={{ fontSize: 12 }} >{this.formatVehicleInfo()}</Text> 
                <div>
                <div style={{ marginTop: 20 }} >
                  {this.getCurrentLabel()}
                </div>
                  <div style={{ marginTop: 15, marginLeft: "-4.2rem", width: "70%" }}>
                  <Steps current={job.currentStep - 1} progressDot size="small">
                    <Step />
                    <Step />
                    <Step />
                  </Steps>
                 </div> 
                </div>
              </div>
              <div style={{ margin: "auto", fontSize: 16 }} >
                <div style={{ color: "black" }} >
                  <i className="fas fa-arrow-circle-up" />
                  <Text> Start</Text>
                  <br/>
                  <Text style={{ fontSize: 12 }} type="secondary">{this.formatDate()[0]}</Text>
                </div>
                <div style={{ color: "#1890ff", marginTop: 10 }}>
                <i className="fas fa-arrow-circle-down" />
                  <Text> End</Text>
                  <br/>
                  <Text style={{ fontSize: 12 }} type="secondary">{this.formatDate()[1]}</Text>
                </div>
              </div>
              </div>
            </div>
          </Card>
        </React.Fragment>
      )
    }
    else return (
        <React.Fragment>
            <Card size="small" type="plus-circle" theme="outlined" style={cardStyle} >
              <div style={{ padding: 10 }}>
               <div style={{ display: "grid", gridTemplateColumns: "50% 30% 20%" }} >
                <div>
                  <span>
                    <h3 style={{ fontWeight: 700, display: "inline" }} >{job.summary} </h3>
                    {job.distances.rows.length === 0 ? <Icon type="exclamation-circle" theme="filled" style={{ display: "inline", color: "red" }} /> : null}
                  </span>
                  <br />
                  <Icon type="clock-circle" style={{ marginRight: 5 }} /><Text type="secondary" style={{ fontSize: 12 }} >{this.formatDate()}</Text> 
                  <br />
                  <Icon type="calendar" style={{ marginRight: 5 }} /><Text type="secondary" style={{ fontSize: 12 }} >{moment(job.jobData.start.dateTime).format('L')}</Text> 
                  <br />
                  <Icon type="car" style={{ marginRight: 5 }} /><Text type="secondary" style={{ fontSize: 12 }} >{job.vehicleType.make} {job.vehicleType.model}</Text> 
                </div>
                <div style={{ justifyContent: "center", alignItems: "center", display: "flex" }} >
                  <p type="secondary" style={{ fontSize: 24, marginTop: "16%" }} >{this.formatPrice()}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center" }} >
                  <Button shape="round" onClick={() => this.props.handleEdit(job, i)} style={{ marginRight: 4 }}>Edit</Button>
                  <Popconfirm title="Are you sure?" onConfirm={() => this.props.handleDelete(job)} onCancel={null}>
								    <Button shape="circle" icon="delete" />
	              	</Popconfirm>
                </div>
                </div>
              </div>
            </Card>
         </React.Fragment>
      )
  }
}



const badgeStyle = {
  fontSize: 12,
  padding: 5
}

const cardStyle = {
  minHeight: 150,
  border: 0,
  borderRadius: 5,
  borderBottom: "2px solid #f7f7f7",
  marginBottom: 10
}

export default JobCard