import React from "react";
import './CoursesList.css';
import CourseLine from "../CourseLine/CourseLine";
import {Button} from "react-bootstrap";
import AddEditForm from "../AddAndEditCourse/AddEditForm";
import {withRouter} from "react-router-dom"

interface CoursesListState{
    currentUser: any;
    title: string;
    courses: any[];
    edit: boolean;
    addOrEdit: boolean;
    addOrEditCourse: any;
}

class CoursesList extends React.Component<any, CoursesListState>{
    constructor(props: any) {
        super(props);
        this.state = {
            title: "My Courses",
            courses: [],
            currentUser: props.currentUser,
            edit: false,
            addOrEdit: false,
            addOrEditCourse: {}
        }
        this.DeleteCourse = this.DeleteCourse.bind(this);
        this.SaveCallBack = this.SaveCallBack.bind(this);
        this.AddNewCourse = this.AddNewCourse.bind(this);
    }

    async componentDidMount() {
        const serverResponse = await fetch('/QResent/getSubjectByProfessor/' + this.state.currentUser.ldap);
        const body = await serverResponse.json();

        this.setState({...this.state, courses: body});
    }

    async DeleteCourse(courseName: any) {
        await fetch("/QResent/deleteSubject/" + courseName, {
            method: "DELETE",
        });

        this.setState({
            ...this.state,
            courses: this.state.courses.filter((c : any) => c.name !== courseName)
        })
    }

    async SaveCallBack() {
        const serverResponse = await fetch('/QResent/getSubjectByProfessor/' + this.state.currentUser.ldap);
        const body = await serverResponse.json();

        this.setState({
            ...this.state,
            courses: body,
            addOrEdit: false});
    }

    AddNewCourse(course: any, edit: boolean) {
        this.setState({
            ...this.state,
            edit: edit,
            addOrEdit: true,
            addOrEditCourse: course,
        })
    }

    render() {
        const ContentRendered = (passedObject: any) => {
            return <>
                {passedObject.courses.map((course: any) => (
                    <CourseLine
                        key={course.id}
                        course={course}
                        ldap={this.state.currentUser.ldap}
                        deleteCourse={this.DeleteCourse}
                        editCourse={this.AddNewCourse}
                    />)
                )}
            </>
        }

        if(this.state.addOrEdit) {
            if(this.state.edit) {
                return <AddEditForm
                    title="Edit course"
                    course={this.state.addOrEditCourse}
                    parentCallBack={this.SaveCallBack}
                    ldap={this.state.currentUser.ldap}
                />
            } else {
                return <AddEditForm
                    title="Add a new course"
                    course={this.state.addOrEditCourse}
                    parentCallBack={this.SaveCallBack}
                    ldap={this.state.currentUser.ldap}
                />
            }
        } else {
            return (
                <div className="body">
                    <div className="title">
                        {this.state.title}
                    </div>
                    <div style={{textAlign: "right"}}>
                        <Button
                            style={{marginRight: "13rem", marginTop: "2rem"}}
                            variant="dark"
                            onClick={() => this.AddNewCourse({}, false)}
                        >Add New Course</Button>
                    </div>
                    <div style={{marginLeft: "-10rem"}}>
                        <ContentRendered {...this.state}/>
                    </div>
                </div>
            );
        }
    }
}

export default withRouter(CoursesList)