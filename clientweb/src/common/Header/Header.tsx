import React from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import LogoImage from './LogoIcon.svg';
import { NavDropdown } from 'react-bootstrap';
import {withRouter} from "react-router-dom"

interface HeaderState {
    currentUser: any;
    parentCallBackLogout: (user: any) => any;
}

class Header extends React.Component<any, HeaderState>{
    constructor(props: any) {
        super(props);
        this.state = {
            currentUser: props.currentUser,
            parentCallBackLogout: props.handleLogout,
        }
        this.handleLogout = this.handleLogout.bind(this)
    }

    componentWillReceiveProps(nextProps: any) {
        this.setState({ currentUser: nextProps.currentUser});
    }

    async handleLogout() {
        this.state.parentCallBackLogout({
            ldap: "",
            role: ""
        });

        const body = JSON.stringify(this.state);

        const response = await fetch(
            "/QResent/logout",
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

        this.props.history.push("/");
    }


    render() {
        const DropDown = () => {
            if (this.state.currentUser.role !== "") {
                return <Nav className="me-auto">
                    <NavDropdown title={this.state.currentUser.ldap}>
                        <NavDropdown.Item onClick={() => {this.props.history.push("/Profile")}}>Profile</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => {this.props.history.push("/ChangePassword")}}>Change Password</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => this.handleLogout()}>Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            }
            return <Nav className="me-auto">
                    <Nav.Link href="/Login">Login</Nav.Link>
                </Nav>
        }

        const Pages = () => {
            if(this.state.currentUser.role === 'a') {
                return <Nav.Link onClick={() => {this.props.history.push("/UsersList")}}>Users List</Nav.Link>
            } else if(this.state.currentUser.role === 'p') {
                return <Nav.Link onClick={() => {this.props.history.push("/coursesList")}}>Course List</Nav.Link>
            } else if(this.state.currentUser.role === 's') {
                return <Nav.Link onClick={() => {this.props.history.push("/StudentCoursesList")}}>Course List</Nav.Link>
            }
            return <></>
        }

        return (<>
            <Navbar bg="dark" variant="dark" sticky="top">
                <Container>
                    <Navbar.Brand>
                        <img alt="" src={LogoImage} width="30" height="30"
                             className="d-inline-block align-top"/>
                        {'   '}QResent{' '}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link onClick={() => {this.props.history.push("/")}}>Home</Nav.Link>
                            <Pages></Pages>
                        </Nav>
                    </Navbar.Collapse>
                    <DropDown/>
                </Container>
            </Navbar>
        </>)
    }
}

export default withRouter(Header);