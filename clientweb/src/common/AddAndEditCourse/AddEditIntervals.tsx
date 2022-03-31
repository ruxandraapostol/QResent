import React from 'react'
import {Button, Form} from "react-bootstrap";
import {withRouter} from "react-router-dom"

interface AddEditIntervalsState{
    title: any;
    interval: any;
    parentCallBack: () => any;
}

class AddEditIntervals extends React.Component<any, AddEditIntervalsState>{
    constructor(props: any) {
        super(props);
        this.state={
            title: props.title,
            interval: props.interval,
            parentCallBack: props.parentCallBack,
        }
        this.HandleDateChange = this.HandleDateChange.bind(this);
        this.HandleNameChange = this.HandleNameChange.bind(this);
        this.HandleHoursChange = this.HandleHoursChange.bind(this);
        this.SaveInterval = this.SaveInterval.bind(this);
    }

    HandleNameChange(event: any){
        this.setState({
            ...this.state,
            interval: {
                ... this.state.interval,
                name: event.target.value
            }
        })
    }

    HandleDateChange(event: any){
        this.setState({
            ...this.state,
            interval: {
                ... this.state.interval,
                date: event.target.value
            }
        })
    }

    HandleHoursChange(event: any){
        this.setState({
            ...this.state,
            interval: {
                ... this.state.interval,
                hours: event.target.value
            }
        })
    }

    async SaveInterval(event : any) {
        event.preventDefault();

        if(this.state.interval.id) {
            const interval = {
                "name": this.state.interval.name,
                "date": this.state.interval.date,
                "hours": this.state.interval.hours,
                "subjectName": this.state.interval.subjectName,
            }
            const body = JSON.stringify(interval);
            const url = "/QResent/editInterval/" + this.state.interval.subjectName
                + "/" + this.state.interval.name;

                await fetch(
                    url,
                    {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: body}
            )
        } else {
            const interval = {
                "name": this.state.interval.name,
                "date": this.state.interval.date,
                "hours": this.state.interval.hours,
                "subjectName": this.state.interval.subjectName,
            }
            const body = JSON.stringify(interval);
            await fetch(
                "/QResent/addInterval/" + this.state.interval.subjectName,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: body
                }
            )
        }

        this.state.parentCallBack()
    }

    render() {
        return <>
            <div className="title">
                {this.state.title}
            </div>
            <div className="formContainer">
                <Form style={{width: "80%"}}>
                    <Form.Group className="mb-3">
                        <Form.Label>Interval Name</Form.Label>
                        <Form.Control
                            onChange={this.HandleNameChange}
                            value={this.state.interval.name}
                            type="text"
                            placeholder="Enter the interval name" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Interval Date</Form.Label>
                        <Form.Control
                            onChange={this.HandleDateChange}
                            value={this.state.interval.date}
                            as="textarea"
                            type="text"
                            placeholder="Enter the interval date" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Interval Hours</Form.Label>
                        <Form.Control
                            onChange={this.HandleHoursChange}
                            value={this.state.interval.hours}
                            as="textarea"
                            type="text"
                            placeholder="Enter the interval hours" />
                    </Form.Group>

                    <div className="formButtons">
                        <Button variant="dark"
                                type="submit"
                                onClick={this.SaveInterval}>
                            Save
                        </Button>

                        <Button
                            style={{marginLeft:"1rem"}}
                            variant="dark"
                            type="submit"
                            onClick={() => this.state.parentCallBack()}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    }
}

export default withRouter(AddEditIntervals);