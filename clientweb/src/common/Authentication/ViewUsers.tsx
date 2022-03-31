import React from "react"
import {Button, Col, Row} from "react-bootstrap";
import {Route, withRouter} from "react-router-dom"
import Register from "./Register";
import {AiFillDelete, AiFillEdit, AiOutlineSearch} from "react-icons/ai";
import Profile from "./Profile";

interface ViewUsersState {
    currentUser: any;
    usersList: any;
    addOrEdit: boolean;
    editUserLdap: any;
    viewProfile: boolean;
    viewProfileLdap: any;
}

class ViewUsers extends React.Component<any, ViewUsersState>{
    constructor(props: any) {
        super(props);
        this.state = {
            currentUser: props.currentUser,
            usersList: [],
            addOrEdit: false,
            viewProfile: false,
            viewProfileLdap: {},
            editUserLdap: {}
        }
        this.SaveCallBack = this.SaveCallBack.bind(this);
        this.AddNewUser = this.AddNewUser.bind(this);
        this.ViewUser = this.ViewUser.bind(this);
        this.DeleteUser = this.DeleteUser.bind(this);
    }

    async componentDidMount() {
        const serverResponse = await fetch('/QResent/users/');
        const body = await serverResponse.json();

        this.setState({...this.state, usersList: body});
    }

    async SaveCallBack() {
        const serverResponse = await fetch('/QResent/users/');
        const body = await serverResponse.json();

        this.setState({
            ...this.state,
            usersList: body,
            addOrEdit: false});
    }

    AddNewUser(user: any) {
        if(user) {
            this.setState({
                ...this.state,
                addOrEdit: true,
                editUserLdap: user.ldap,
            })
        } else {
            this.setState({
                ...this.state,
                addOrEdit: true,
            })
        }
    }

    ViewUser(userLdap: any) {
        this.setState({
            ...this.state,
            viewProfile: true,
            viewProfileLdap: userLdap
        })
    }

    async DeleteUser(userLdap: any) {
        const body = JSON.stringify({"ldap": userLdap});
        await fetch(
            "/QResent/deleteUser",
            {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: body
            });

        this.setState({
            ...this.state,
            usersList: this.state.usersList.filter((c : any) => c.ldap !== userLdap)
        })
    }

    render() {
        if(this.state.addOrEdit) {
            if(this.state.editUserLdap) {
                return <Register
                    callBackParent={this.SaveCallBack}
                    editUser={true}
                    editUserLdap={this.state.editUserLdap}/>
            } else {
                return <Register
                    callBackParent={this.SaveCallBack}/>
            }
        } if(this.state.viewProfile) {
            return <Profile ldap={this.state.viewProfileLdap}/>
        } else {
            const Users = () => {
                return <>
                    {this.state.usersList.map((user: any) => (
                        <Row style={{margin: "auto", width: "80%"}}>
                            <Col sm={8} style={{textAlign: "left"}}>{user.ldap}</Col>
                            <Col sm={4} style={{textAlign: "right"}}>
                                <AiOutlineSearch
                                    size={30}
                                    style={{cursor: "pointer"}}
                                    onClick={() => {this.ViewUser(user.ldap)}}
                                />
                                <AiFillEdit
                                    size={30}
                                    style={{cursor: "pointer"}}
                                    onClick={() => {this.AddNewUser(user)}}
                                />
                                <AiFillDelete
                                    size={30}
                                    style={{cursor: "pointer"}}
                                    onClick={() => {this.DeleteUser(user.ldap)}}/>

                            </Col>
                        </Row>)
                    )}
                </>
            }

            return (
                <div className="body">
                    <div className="title">
                        Users List
                    </div>
                    <div style={{textAlign: "right"}}>
                        <Button
                            style={{marginRight: "13rem", marginTop: "2rem"}}
                            variant="dark"
                            onClick={() => this.AddNewUser({})}
                        >Add New User</Button>
                    </div>
                    <div>
                        <Users/>
                    </div>
                </div>
            )
        }
    }
}

export default withRouter(ViewUsers)