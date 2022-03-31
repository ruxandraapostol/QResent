import React from "react";
import {Alert, Button, Form} from "react-bootstrap";

interface ChangePasswordState {
    ldap: string;
    oldUserPassword: string;
    userPassword: string;
    alert: string;
}

export default class ChangePassword extends React.Component<any, ChangePasswordState>{
    constructor(props: any) {
        super(props);
        this.state={
            ldap: props.ldap,
            oldUserPassword: "",
            userPassword: "",
            alert: "",
        }
        this.HandleNewPassword = this.HandleNewPassword.bind(this);
        this.HandleOldPassword = this.HandleOldPassword.bind(this);
    }

    HandleNewPassword(event: any){
        this.setState({
            ...this.state,
            userPassword: event.target.value
        })
    }

    HandleOldPassword(event: any){
        this.setState({
            ...this.state,
            oldUserPassword: event.target.value
        })
    }

    async HandleSubmit(event: any) {
        event.preventDefault();

        if(this.state.ldap === ""
            || this.state.oldUserPassword === ""
            || this.state.userPassword === "") {
            this.setState({...this.state, alert: "Please complete all the required fields."});
        } else {
            const body = JSON.stringify(this.state);

            const response = await fetch(
                "/QResent/changePassword",
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: body
                })
                .then(response => {return response;})
                .then(data => {return data.text()});

            this.setState({
                ...this.state,
                oldUserPassword: "",
                userPassword: "",
                alert: response});
        }
    }
    
    render() {
        const  AlertMessage = () => {
            if(this.state.alert !== "") {
                return <>
                    <Alert show={true} variant="dark">
                        <Alert.Heading>{this.state.alert}</Alert.Heading>
                        <div className="d-flex justify-content-end">
                            <Button onClick={() => this.setState({...this.state, alert: ""})} variant="outline-dark">
                                Close
                            </Button>
                        </div>
                    </Alert>
                </>
            }
            return <></>
        }

        return <>
            <AlertMessage/>
            <div className="title">
                Change Password
            </div>
            <div className="formContainer">
                <Form style={{width: "50%"}}>
                    <Form.Group className="mb-3">
                        <Form.Label>Ldap</Form.Label>
                        <Form.Control
                            readOnly
                            value={this.state.ldap}
                            type="text"
                            placeholder="Enter your email" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Old password</Form.Label>
                        <Form.Control
                            onChange={this.HandleOldPassword}
                            value={this.state.oldUserPassword}
                            type="password"
                            placeholder="Enter your old password"
                            isInvalid={this.state.oldUserPassword === ""}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            onChange={this.HandleNewPassword}
                            value={this.state.userPassword}
                            type="password"
                            placeholder="Enter your new password"
                            isInvalid={this.state.userPassword === ""} />
                    </Form.Group>

                    <div className="formButtons">
                        <Button variant="dark"
                                type="submit"
                                onClick={(event) => this.HandleSubmit(event)}>
                            ChangePassword
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    }
}