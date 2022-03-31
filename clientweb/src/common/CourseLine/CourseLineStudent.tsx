import React from 'react';
import './CourseLine.css'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import {AiOutlineSearch} from 'react-icons/ai'
import {withRouter} from "react-router-dom"

interface CourseLineState{
    ldap: any;
    course: any;
    deleteCourse: (courseId: any) => void
}

class CourseLineStudent extends React.Component<any, CourseLineState> {
    constructor(props: any) {
        super(props);
        this.state = {
            course: props.course,
            deleteCourse: props.deleteCourse,
            ldap: props.ldap
        }
    }

    viewCourse() {
        this.props.history.push('/courseDetailsStudent/' + this.state.course.id);
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
                </Col>
            </Row>
        </>
    }
}

export default withRouter(CourseLineStudent);