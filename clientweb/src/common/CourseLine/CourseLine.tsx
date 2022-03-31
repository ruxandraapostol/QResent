import React from 'react';
import './CourseLine.css'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import {AiFillDelete} from 'react-icons/ai';
import {AiFillEdit} from 'react-icons/ai';
import {AiOutlineSearch} from 'react-icons/ai'
import {withRouter} from "react-router-dom"

interface CourseLineState{
    ldap: any;
    course: any;
    deleteCourse: (courseId: any) => void
    editCourse: (course: any, edit: boolean) => void
}

class CourseLine extends React.Component<any, CourseLineState> {
    constructor(props: any) {
        super(props);
        this.state = {
            course: props.course,
            deleteCourse: props.deleteCourse,
            editCourse: props.editCourse,
            ldap: props.ldap
        }
    }

    viewCourse() {
        this.props.history.push('/courseDetails/' + this.state.course.id);
    }

    render(){
        return <>
            <Row>
                <Col sm={8} style={{paddingLeft: "25%"}}>
                    <div className="lineFont">{this.state.course.name}</div>
                </Col>
                <Col sm={4} style={{paddingTop: "1.2rem"}}>
                    <AiOutlineSearch
                        size={30}
                        style={{cursor: "pointer"}}
                        onClick={() => {this.viewCourse()}}
                    />
                    <AiFillEdit
                        size={30}
                        style={{cursor: "pointer"}}
                        onClick={() => {this.state.editCourse(this.state.course, true)}}
                    />
                    <AiFillDelete
                        size={30}
                        style={{cursor: "pointer"}}
                        onClick={() => {this.state.deleteCourse(this.state.course.name)}}
                    />
                </Col>
            </Row>
            </>
    }
}

export default withRouter(CourseLine);