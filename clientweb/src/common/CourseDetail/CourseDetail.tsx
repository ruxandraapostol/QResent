import React from 'react';
import './CourseDetail.css';
import QRCodeGenerate from "./QRCode";
import {Button, Col, Form, Row} from "react-bootstrap";
import SubjectIntervals from "./SubjectIntervals";
import AddEditIntervals from "../AddAndEditCourse/AddEditIntervals";

interface CourseDetailState{
    currentUser: any
    course: any;
    tokenInterval: string;
    showModal: boolean;
    edit: boolean
    addOrEdit: boolean;
    addOrEditInterval: any;
}

class CourseDetail extends React.Component<any, CourseDetailState> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentUser: props.currentUser,
            course: {},
            showModal: false,
            tokenInterval: "",
            edit: false,
            addOrEdit: false,
            addOrEditInterval: {}
        };
        this.displayModal = this.displayModal.bind(this);
        this.SaveCallBack = this.SaveCallBack.bind(this);
        this.AddNewInterval = this.AddNewInterval.bind(this);
    }

    displayModal(status: boolean, token: string) {
        this.setState({
            ...this.state,
            showModal: status,
            tokenInterval: token,
        })
    }

    async componentDidMount() {
        const id = this.props.match.params.id;

        const serverResponse = await fetch('/QResent/subjects');
        const body = await serverResponse.json();

        const wantedCourse = body.filter((courses: any) => courses.id == id)
        this.setState(
            {
                ...this.state,
                course: wantedCourse[0],
                addOrEditInterval: {
                    ...this.state.addOrEditInterval,
                    subjectName: wantedCourse[0].name
                }
            });
    }



    async SaveCallBack() {
        const serverResponse = await fetch('/QResent/getIntervals/' + this.state.course.name);
        const body = await serverResponse.json();

        this.setState({
            ...this.state,
            course: {
                ...this.state.course,
                intervals: body
            },
            addOrEditInterval: {},
            addOrEdit: false});
    }

    AddNewInterval(interval: any, edit: boolean) {
        this.setState({
            ...this.state,
            edit: edit,
            addOrEdit: true,
            addOrEditInterval: interval,
        })
    }

    render() {
        if(this.state.course) {
            const Modal = () => {
                if(this.state.showModal) {
                    return <QRCodeGenerate
                        tokenInterval={this.state.tokenInterval}
                        subjectName={this.state.course.name}
                        displayModal={this.displayModal}
                    />
                }
                return <></>
            }

            const Intervals = () => {
                if(Array.isArray(this.state.course.intervals)) {
                    return <>
                        {this.state.course.intervals.map((interval: any) => (
                            <SubjectIntervals
                                key={interval.id}
                                subjectName={this.state.course.name}
                                deleteInterval={this.SaveCallBack}
                                editInterval={this.AddNewInterval}
                                tokenDisplay={this.displayModal}
                                interval={interval}
                            />)
                        )}
                    </>
                }
                return <></>
            }

            if(this.state.addOrEdit) {
                return <AddEditIntervals
                    title="Add a new interval"
                    interval={this.state.addOrEditInterval}
                    parentCallBack={this.SaveCallBack}
                />
            } else {
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
                                            readOnly defaultValue={this.state.course.name} />
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
                                            readOnly defaultValue={this.state.course.points} />
                                    </Col>
                                </Form.Group>
                            </Form>
                    </div>
                    <br/>

                    <div className="detailContainer" style={{width: "80%"}}>
                        <hr/>
                        <Button
                                variant="dark"
                                onClick={() => this.AddNewInterval(this.state.addOrEditInterval, false)}
                        >Add Interval</Button>
                        <Intervals/>
                        <Modal/>
                    </div>
                </>;
            }
        } else {
            return <></>
        }
    }
}

export default CourseDetail;