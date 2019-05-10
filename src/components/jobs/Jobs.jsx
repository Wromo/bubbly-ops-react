import React, { Component } from 'react'
import UncompletedJobs from './uncompletedJobs/UncompletedJobs';
import CompletedJobs from './completedJobs/CompletedJobs'
import UpcomingJobs from './upcomingJobs/UpcomingJobs'
import { Divider, PageHeader } from 'antd';

export class Jobs extends Component {
    state = {
        completedJobs: [],
        uncompletedJobs: []
    }

    componentDidMount() {
        this.setState({ completedJobs: this.props.completedJobs, uncompletedJobs: this.props.uncompletedJobs })

        const activeJob = JSON.parse(localStorage.getItem("activeJob"))
        if (!activeJob) return
        else this.props.history.push(`/jobs/${activeJob.jobData.id}`)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.completedJobs !== this.props.completedJobs) {
            this.setState({ completedJobs: this.props.completedJobs })
        } else if (prevProps.uncompletedJobs !== this.props.uncompletedJobs) {
            this.setState({ uncompletedJobs: this.props.uncompletedJobs })
        }
    }

  render() {
      const { isGapiReady, user } = this.props
      const { uncompletedJobs, completedJobs } = this.props
    return (
        <div style={{ overflowX: "hidden", minWidth: "100%" }} >
          <h1 style={{ fontSize: 32, fontWeight: 700 }}>Your Jobs</h1>
          <p>Here you can find all your jobs scheduled for today.</p>
          <Divider />
          <CompletedJobs completedJobs={completedJobs} uncompletedJobs={uncompletedJobs} user={user} />
          <UncompletedJobs {...this.props} handleRefresh={this.props.handleRefresh} user={user} uncompletedJobs={uncompletedJobs} isGapiReady={isGapiReady} />
          <UpcomingJobs user={user} />
        </div>
    )
  }
}

export default Jobs
