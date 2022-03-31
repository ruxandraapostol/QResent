import React from 'react'
import {Alert, Button, Form} from "react-bootstrap";
import {withRouter} from "react-router-dom"

interface LoginState{
    ldap: string;
    userPassword: string;
    alert: boolean;
    callBackParent: (response: any) => any
}

class Login extends React.Component<any, LoginState> {
    constructor(props: any) {
        super(props);
        this.state = {
            ldap: "",
            userPassword:"",
            alert: false,
            callBackParent: props.handleLogin
        };

        this.HandleSubmit = this.HandleSubmit.bind(this);
        this.HandlePasswordChange = this.HandlePasswordChange.bind(this);
        this.HandleEmailChange = this.HandleEmailChange.bind(this);
    }


    HandleEmailChange(event: any){
        this.setState({
            ...this.state,
            ldap: event.target.value
        })
    }

    HandlePasswordChange(event: any){
        this.setState({
            ...this.state,
            userPassword: event.target.value
        })
    }

    async HandleSubmit(event: any) {
        event.preventDefault();
        const body = JSON.stringify(this.state);

        const response = await fetch(
            "/QResent/login",
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

        try {
            const objectResponse = JSON.parse(response);
            this.state.callBackParent(objectResponse);
            this.props.history.push("/")
        } catch (e) {
            this.setState({...this.state, alert: true})
        }
    }

    render() {
        const  AlertMessage = () => {
            if(this.state.alert) {
                return <>
                    <Alert show={true} variant="dark">
                        <Alert.Heading>Incorrect username or password.</Alert.Heading>
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

        return <>
            <AlertMessage/>
            <div className="title">
                Login
            </div>
            <div className="formContainer">
                <Form style={{width: "50%"}}>
                    <Form.Group className="mb-3">
                        <Form.Label>Ldap</Form.Label>
                        <Form.Control
                            onChange={this.HandleEmailChange}
                            value={this.state.ldap}
                            type="text"
                            placeholder="Enter your ldap" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            onChange={this.HandlePasswordChange}
                            value={this.state.userPassword}
                            type="password"
                            placeholder="Enter your password" />
                    </Form.Group>

                    <div className="formButtons">
                        <Button variant="dark"
                                type="submit"
                                onClick={(event) => this.HandleSubmit(event)}>
                            Login
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    }
}

export default withRouter(Login)