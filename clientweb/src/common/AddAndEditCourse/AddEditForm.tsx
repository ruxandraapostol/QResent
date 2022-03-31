import React from 'react'
import {Button, Form} from "react-bootstrap";
import {withRouter} from "react-router-dom"

interface AddEditFormState{
    title: any;
    course: any;
    parentCallBack: () => any;
}

class AddEditForm extends React.Component<any, AddEditFormState>{
    constructor(props: any) {
        super(props);
        this.state={
            title: props.title,
            course: {
                id: props.course.id,
                name: props.course.name,
                description: props.course.description,
                points: props.points,
                professorLdap: props.ldap,
            },
            parentCallBack: props.parentCallBack,
        }
        this.HandleDescriptionChange = this.HandleDescriptionChange.bind(this);
        this.HandleNameChange = this.HandleNameChange.bind(this);
        this.HandlePointsChange = this.HandlePointsChange.bind(this);
        this.SaveCourse = this.SaveCourse.bind(this);
    }

    HandleNameChange(event: any){
        this.setState({
            ...this.state,
            course: {
                ... this.state.course,
                name: event.target.value
            }
        })
    }

    HandleDescriptionChange(event: any){
        this.setState({
            ...this.state,
            course: {
                ... this.state.course,
                description: event.target.value
            }
        })
    }

    HandlePointsChange(event: any){
        this.setState({
            ...this.state,
            course: {
                ... this.state.course,
                points: event.target.value
            }
        })
    }

    async SaveCourse(event : any) {
        event.preventDefault();
        const body = JSON.stringify(this.state.course);

        if(this.state.course.id) {
            await fetch(
                "/QResent/editSubject/" + this.state.course.name,
                {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: body}
            )
        } else {
            await fetch(
                "/QResent/addSubject",
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
                        <Form.Label>Course Name</Form.Label>
                        <Form.Control
                            onChange={this.HandleNameChange}
                            value={this.state.course.name}
                            type="text"
                            placeholder="Enter the course name" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Course Points</Form.Label>
                        <Form.Control
                            onChange={this.HandlePointsChange}
                            value={this.state.course.points}
                            as="textarea"
                            type="text"
                            placeholder="Enter the course points" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Course Description</Form.Label>
                        <Form.Control
                            onChange={this.HandleDescriptionChange}
                            value={this.state.course.description}
                            as="textarea"
                            type="text"
                            placeholder="Enter the course description" />
                    </Form.Group>

                    <div className="formButtons">
                        <Button variant="dark"
                                type="submit"
                                onClick={this.SaveCourse}>
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

export default withRouter(AddEditForm);