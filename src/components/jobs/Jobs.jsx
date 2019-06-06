import React, { Component } from 'react'
import UncompletedJobs from './uncompletedJobs/UncompletedJobs';
import CompletedJobs from './completedJobs/CompletedJobs'
import UpcomingJobs from './upcomingJobs/UpcomingJobs'
import { Divider, PageHeader } from 'antd';
import axios from 'axios';

export class Jobs extends Component {
    state = {
        completedJobs: [],
        uncompletedJobs: []
    }

    async componentDidMount() {
        const { user } = this.props
        this.setState({ completedJobs: this.props.completedJobs, uncompletedJobs: this.props.uncompletedJobs })

        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_API}/employees/${user.employeeId}`)
        const jobInProgress = data.jobInProgress ? data.jobInProgress : null

        if (!jobInProgress) return
        else if (jobInProgress.currentStep !== 3) this.props.history.push(`/jobs/${jobInProgress.jobData.id}`)
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
