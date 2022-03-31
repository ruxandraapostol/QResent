import React from "react";
import {Button, Form, Alert} from "react-bootstrap";

interface RegisterState{
    editUser: boolean,
    editUserLdap: string,
    ldap: string;
    userRole: string;
    firstName: string;
    lastName: string;
    clazz: string;
    currentYear: string;
    userPassword: string;
    contact: string;
    alert: boolean;
    callBackParent: () => any
}

class Register extends React.Component<any, RegisterState> {
    constructor(props: any) {
        super(props);
        this.state = {
            callBackParent: props.callBackParent,
            editUser: props.editUser,
            editUserLdap: props.editUserLdap,
            ldap: "",
            userRole: "s",
            firstName: "",
            lastName: "",
            clazz: "",
            currentYear: "",
            userPassword: "",
            contact: "",
            alert: false,
        };

        this.HandleSubmit = this.HandleSubmit.bind(this);
        this.HandleFirstNameChange = this.HandleFirstNameChange.bind(this);
        this.HandleLastNameChange = this.HandleLastNameChange.bind(this);
        this.HandleLdapChange = this.HandleLdapChange.bind(this);
        this.HandleUserRoleChange = this.HandleUserRoleChange.bind(this);
        this.HandleClazzChange = this.HandleClazzChange.bind(this);
        this.HandleCurrentYearChange = this.HandleCurrentYearChange.bind(this);
        this.HandleUserPasswordChange = this.HandleUserPasswordChange.bind(this);
        this.HandleContactChange = this.HandleContactChange.bind(this);
    }

    async componentDidMount() {
        if(this.state.editUser) {
            const serverResponse = await fetch('/QResent/getUserByLdap//' + this.state.editUserLdap);
            const body = await serverResponse.json();

            this.setState({
                ...this.state,
                ldap: body.ldap,
                userRole: body.userRole,
                firstName: body.firstName,
                lastName: body.lastName,
                clazz: body.clazz,
                currentYear: body.currentYear,
                userPassword: body.userPassword,
                contact: body.contact,
            });
        }
    }

    HandleLdapChange(event: any){
        if(!this.state.editUser) {
            this.setState({
                ...this.state,
                ldap: event.target.value,
            })
        }
    }

    HandleFirstNameChange(event: any){
        let ldap = this.state.ldap;
        if(!this.state.editUser) {
            ldap = event.target.value + "." + this.state.lastName;
        }

        this.setState({
            ...this.state,
            firstName: event.target.value,
            ldap: ldap
        })
    }

    HandleLastNameChange(event: any) {
        let ldap = this.state.ldap;
        if(!this.state.editUser) {
            ldap = this.state.firstName + "." + event.target.value;
        }

        this.setState({
            ...this.state,
            lastName: event.target.value,
            ldap: ldap,
        })
    }

    HandleClazzChange(event: any){
        this.setState({
            ...this.state,
            clazz: event.target.value,
        })
    }

    HandleCurrentYearChange(event: any){
        this.setState({
            ...this.state,
            currentYear: event.target.value,
        })
    }

    HandleUserPasswordChange(event: any){
        this.setState({
            ...this.state,
            userPassword: event.target.value
        })
    }

    HandleContactChange(event: any){
        this.setState({
            ...this.state,
            contact: event.target.value
        })
    }

    HandleUserRoleChange(event: any){
        this.setState({
            ...this.state,
            userRole: event.target.value
        })
    }

    async HandleSubmit(event: any) {
        event.preventDefault();

        if(this.state.ldap === ""
            || this.state.firstName === ""
            || this.state.lastName === ""
            || this.state.userPassword === ""){
            this.setState({
                ...this.state,
                alert: true
            })
        } else {
            const body = JSON.stringify(this.state);

            if(this.state.editUser) {
                await fetch(
                    "/QResent/updateUser",
                    {
                        method: "PUT",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: body
                    });
            } else {
                await fetch(
                    "/QResent/addUser",
                    {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: body
                    });
            }
        }

        this.state.callBackParent();
    }

    render() {
        const StudentFields = () => {
            if(this.state.userRole === "s") {
                return <>
                    <Form.Group className="mb-3" >
                        <Form.Label>Contact Info</Form.Label>
                        <Form.Control
                            onChange={this.HandleContactChange}
                            value={this.state.contact}
                            as="textarea"
                            type="text"
                            placeholder="Enter contact info"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Current Year</Form.Label>
                        <Form.Control
                            onChange={this.HandleCurrentYearChange}
                            value={this.state.currentYear}
                            type="text"
                            placeholder="Enter current year" />
                    </Form.Group>


                    <Form.Group className="mb-3">
                        <Form.Label>Group</Form.Label>
                        <Form.Control
                            onChange={this.HandleClazzChange}
                            value={this.state.clazz}
                            type="text"
                            placeholder="Enter group"/>
                    </Form.Group>
                </>
            }
            return <></>
        }

        const  AlertMessage = () => {
            if(this.state.alert) {
                return <>
                    <Alert show={true} variant="dark">
                        <Alert.Heading>Please complete all the mandatory fields</Alert.Heading>
                        <div className="d-flex justify-content-end">
                            <Button onClick={() => this.setState({...this.state, alert: false})} variant="outline-dark">
                                Close
                            </Button>
                        </div>
                    </Alert>
                </>
            }
            return <></>
        }

        const Title = () => {
            if(this.state.editUser) {
                return <div className="title">Edit user</div>
            }
            return <div className="title">Save user</div>
        }

        const Ldap = () => {
            if(!this.state.editUser) {
                return <Form.Control
                    onChange={this.HandleLdapChange}
                    value={this.state.ldap}
                    type="text"
                    placeholder="Enter last name"
                    isInvalid={this.state.ldap === ""} />
            }
            return <Form.Control
                readOnly
                onChange={this.HandleLdapChange}
                value={this.state.ldap}
                type="text"
                placeholder="Enter last name"
                isInvalid={this.state.ldap === ""} />
        }
        return <>
            <Title/>
            <AlertMessage/>
            <div className="formContainer">
                <Form style={{width: "50%"}}>
                    <Form.Group className="mb-3">
                        <Form.Label>User Role</Form.Label>
                        <Form.Select onChange={this.HandleUserRoleChange}>
                            <option value="s">Student</option>
                            <option value="p">Professor</option>
                            <option value="a">Admin</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>First name</Form.Label>
                        <Form.Control
                            onChange={this.HandleFirstNameChange}
                            value={this.state.firstName}
                            type="text"
                            placeholder="Enter first name"
                            isInvalid={this.state.firstName === ""}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Last name</Form.Label>
                        <Form.Control
                            onChange={this.HandleLastNameChange}
                            value={this.state.lastName}
                            type="text"
                            placeholder="Enter last name"
                            isInvalid={this.state.lastName === ""} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Ldap</Form.Label>
                        <Ldap/>
                    </Form.Group>

                    <StudentFields/>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            onChange={this.HandleUserPasswordChange}
                            value={this.state.userPassword}
                            type="password"
                            placeholder="Enter Password"
                            isInvalid={this.state.userPassword === ""} />
                    </Form.Group>

                    <div className="formButtons">
                        <Button variant="dark"
                                type="submit"
                                onClick={event => this.HandleSubmit(event)}>
                            Save
                        </Button>

                        <Button variant="dark"
                                type="submit"
                                onClick={() => this.state.callBackParent()}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    }
}

export default Register