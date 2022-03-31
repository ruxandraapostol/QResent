import React from "react"
import {Col, Form, Row} from "react-bootstrap";

interface ProfileState{
    ldap: string;
    userRole: string;
    firstName: string;
    lastName: string;
    clazz: string;
    currentYear: string;
    contact: string;
    role: string;
}

class Profile extends React.Component<any, ProfileState> {
    constructor(props: any) {
        super(props);
        this.state = {
            ldap: props.ldap,
            userRole: "",
            firstName: "",
            lastName: "",
            clazz: "",
            currentYear: "",
            contact: "",
            role: ""
        }
    }

    async componentDidMount() {
        const serverResponse = await fetch('/QResent/getUserByLdap/' + this.state.ldap);
        const body = await serverResponse.json();

        this.setState({
            ...this.state,
            userRole: body.userRole,
            firstName: body.firstName,
            lastName: body.lastName,
            clazz: body.clazz,
            currentYear: body.currentYear,
            contact: body.contact});

        if(this.state.userRole === "a") {
            this.setState({
                ...this.state,
                role: "admin"});
        } else if(this.state.userRole === "p") {
            this.setState({
                ...this.state,
                role: "professor"});
        } else {
            this.setState({
                ...this.state,
                role: "student"});
        }
    }

    render() {
        const StudentFields = () => {
            if(this.state.userRole === "s") {
                return <>
                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column sm="2">
                            <b>Contact Info</b>
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control plaintext readOnly defaultValue={this.state.contact} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column sm="2">
                            <b>Class</b>
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control plaintext readOnly defaultValue={this.state.clazz} />
                        </Col>
                    </Form.Group>


                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column sm="2">
                            <b>Current Year</b>
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control plaintext readOnly defaultValue={this.state.currentYear} />
                        </Col>
                    </Form.Group>

                </>
            }
            return <></>
        }

        return <>
            <div className="title">
                My Profile
            </div>
            <div className="formContainer">
                <Form style={{width: "50%"}}>

                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column sm="2">
                            <b>Role</b>
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control plaintext readOnly defaultValue={this.state.role} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column sm="2">
                            <b>Ldap</b>
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control plaintext readOnly defaultValue={this.state.ldap} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column sm="2">
                            <b>First Name</b>
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control plaintext readOnly defaultValue={this.state.firstName} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column sm="2">
                            <b>Last Name</b>
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control plaintext readOnly defaultValue={this.state.lastName} />
                        </Col>
                    </Form.Group>

                    <StudentFields/>
                </Form>
            </div>
            <p style={{marginTop: "5rem"}}>** If there is any mistake do not hesitate to contact the site administrator via email.(<i>admin@acs.upb.ro</i>)**</p>
        </>
    }
}

export default Profile