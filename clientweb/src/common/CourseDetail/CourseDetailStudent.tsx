import React from 'react';
import './CourseDetail.css';
import {withRouter} from "react-router-dom"
import SubjectIntervalsStudent from "./SubjectIntervalsStudent";
import {Button, Col, Form, Row} from "react-bootstrap";

interface CourseDetailState{
    currentUser: any;
    course: any;
}

class CourseDetailStudent extends React.Component<any, CourseDetailState> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentUser: props.currentUser,
            course: {},
        };
    }

    async componentDidMount() {
        const id = this.props.match.params.id;

        const serverResponse = await fetch('/QResent/subjects');
        const body = await serverResponse.json();

        const wantedCourse = body.filter((courses: any) => courses.id == id)
        this.setState({...this.state, course: wantedCourse[0]});
    }


    render() {
        if(this.state.course) {
            const Intervals = () => {
                if(Array.isArray(this.state.course.intervals)) {
                    return <>
                        {this.state.course.intervals.map((interval: any) => (
                            <SubjectIntervalsStudent
                                ldap={this.state.currentUser.ldap}
                                key={interval.id}
                                interval={interval}
                            />)
                        )}
                    </>
                }
                return <></>
            }

            return <>
                <div className="title">{this.state.course.name}</div>
                <div className="formContainer">
                    <Form style={{width: "80%", fontSize:"1.5rem"}}>

                        <Form.Group as={Row} className="mb-3" >
                            <Form.Label column sm="2">
                                <b>Details</b>
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    plaintext
                                    as="textarea"
                                    type="text"
                                    rows={3}
                                    readOnly
                                    defaultValue={this.state.course.name} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" >
                            <Form.Label column sm="2">
                                <b>Points</b>
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    plaintext
                                    as="textarea"
                                    type="text"
                                    rows={3}
                                    readOnly
                                    defaultValue={this.state.course.points} />
                            </Col>
                        </Form.Group>
                    </Form>
                </div>
                <br/>

                  <div className="detailContainer" style={{width: "80%"}}>
                    <hr/>
                    <Intervals/>
                </div>
            </>;
        } else {
            return <></>
        }
    }
}

export default withRouter(CourseDetailStudent);