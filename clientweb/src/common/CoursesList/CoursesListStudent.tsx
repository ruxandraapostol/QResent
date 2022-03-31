import React from "react";
import './CoursesList.css';
import CourseLine from "../CourseLine/CourseLineStudent";
import {withRouter} from "react-router-dom"

interface CoursesListState{
    currentUser: any;
    title: string;
    courses: any[];
}

class CoursesListStudent extends React.Component<any, CoursesListState>{
    constructor(props: any) {
        super(props);
        this.state = {
            title: "My Courses",
            courses: [],
            currentUser: props.currentUser,
        }
    }

    async componentDidMount() {
        const serverResponse = await fetch('/QResent/subjects');
        const body = await serverResponse.json();

        this.setState({...this.state, courses: body});
    }

    render() {
        const ContentRendered = (passedObject: any) => {
            return <>
                {passedObject.courses.map((course: any) => (
                    <CourseLine
                        key={course.id}
                        course={course}
                        ldap={this.state.currentUser.ldap}
                    />)
                )}
            </>
        }

        return (
                <div className="body">
                    <div className="title">
                        {this.state.title}
                    </div>
                    <div style={{margin: "auto"}}>
                        <ContentRendered {...this.state}/>
                    </div>

                </div>
            );
    }
}

export default withRouter(CoursesListStudent)