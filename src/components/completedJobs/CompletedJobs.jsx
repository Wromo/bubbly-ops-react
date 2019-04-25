import React, { Component } from 'react'
import { getDistances } from '../../services/eventsService'
import { Empty, Icon, Button, Modal, Progress, Divider } from 'antd'
import Axios from 'axios';

export class CompletedJobs extends Component {
    state = {
			completedJobs: [],
			uncompletedJobs: [],
			isLoading: false,
			progress: 0,
			isCompleted: false,
		}

	componentDidMount() {
		const progress = this.calculateProgress()
		console.log(progress)
		this.setState({ progress })
	}
		
	componentDidUpdate(prevProps) {
		if (prevProps.completedJobs !== this.props.completedJobs) {
			this.setState({ completedJobs: this.props.completedJobs })
			const progress = this.calculateProgress()
			this.setState({ progress, isCompleted: false })
		} else if (prevProps.uncompletedJobs !== this.props.uncompletedJobs) {
			this.setState({ uncompletedJobs: this.props.uncompletedJobs })
			const progress = this.calculateProgress()
			this.setState({ progress, isCompleted: false })
		}
	}

	formatSummary = (job) => {
		if (!job.jobData.summary) return "not found"
		const regex = /[^0-9]/g;
		const summary = job.jobData.summary.match(regex);
		
		return summary;
	}

	handleCompletion = async() => {
		try {
				this.setState({ isLoading: true })
				const jobsWithDistances = this.props.completedJobs.map(async(job, i) => await getDistances(job, i, this.props.completedJobs))
				const jobs = await Promise.all(jobsWithDistances)

				console.log(jobs)

				const res = jobs.map(async(item) => {
						const response = await Axios.post(`${process.env.REACT_APP_BACKEND_API}/jobs/saveJob/${this.props.user.employeeId}`, item)
						return response
				})
				const final = await Promise.all(res)
				this.setState({ isCompleted: true })
				console.log(final)
		} catch (ex) {
				console.log(ex)
		} finally {
				this.setState({ isLoading: false })
				Modal.success({ title: "Success!", content: "Your jobs have been saved to the database!" })
		}
	}

	calculateProgress = () => {
		const { uncompletedJobs, completedJobs } = this.props
		const complete = completedJobs.length
		const fullBar = uncompletedJobs.length + complete
		const total = Math.floor(complete/fullBar * 100)

		if (completedJobs.length === 0) return 0
		if (uncompletedJobs.length === 0) return 100

		return total
	}
      
  render() {
			const { completedJobs } = this.props
			const { progress, isCompleted } = this.state
    return (
			<React.Fragment>
				<div style={{ display: "grid", gridTemplateColumns: "90% 10%", backgroundColor: "#fff", borderRadius: 5, marginBottom: 2 }} >
					<div style={{ padding: 15 }} >
						<Icon style={{ fontSize: 18 }}  type="file-protect" />
						<h4 style={{ marginLeft: 10, display: "inline", fontWeight: 400 }} >Completed Jobs</h4>
					</div>
				</div> 
				<div style={{ width: "100%", padding: 24, margin: "auto", backgroundColor: "#fff", borderRadius: 5 }} >
					<p>Progress</p>
					<Progress percent={progress} style={{ marginBottom: 5 }} />
					<Divider />
					{completedJobs.length > 0 ? completedJobs.map(job => {
						return (
							<div style={{ display: "grid", gridTemplateColumns: "90% 10%" }} >
								<p>{this.formatSummary(job)}</p>
							</div>
						)
					}) : <Empty image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original" />}
					{progress === 100 && !isCompleted ? <span><Divider /><Button onClick={this.handleCompletion}  style={{ width: "100%", backgroundColor: "#52c41a", color: "#fff", borderColor: "#52c41a" }} type="primary"  >Done</Button></span>  : null}
				</div>
			</React.Fragment>
    )
  }
}

export default CompletedJobs