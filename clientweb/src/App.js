import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css'
import HomePage from "./common/HomePage/HomePage";
import Header from './common/Header/Header.tsx'

import CoursesList from "./common/CoursesList/CoursesList.tsx";
import CoursesListStudent from "./common/CoursesList/CoursesListStudent.tsx";

import CourseDetail from "./common/CourseDetail/CourseDetail.tsx";
import CourseDetailStudent from "./common/CourseDetail/CourseDetailStudent.tsx";


import ChangePassword from "./common/Authentication/ChangePassword";
import Profile from "./common/Authentication/Profile";
import Login from "./common/Authentication/Login.tsx";
import Register from "./common/Authentication/Register.tsx";
import ViewUsers from "./common/Authentication/ViewUsers";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            currentUser: {
                ldap: "",
                role: "",
            },
        }
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(user)
    {
        this.setState({
            ...this.state,
            currentUser: user
        });
    }

    render() {
        return (
          <Router>
              <div className="body">
                  <Header currentUser={this.state.currentUser} handleLogout = {this.handleLogin}/>
                  <Switch>
                      <Route path="/" exact component={() => <HomePage/>}/>
                      <Route path="/Login" exact component={() => <Login handleLogin={this.handleLogin}/>}/>
                      <Route path="/Profile" exact component={() => <Profile ldap={this.state.currentUser.ldap}/>}/>
                      <Route path="/Register" exact component={() => <Register />}/>
                      <Route path="/ChangePassword" exact component={() => <ChangePassword ldap={this.state.currentUser.ldap}/>}/>

                      <Route path="/UsersList" exact component={() => <ViewUsers/>}/>

                      <Route path="/coursesList" exact component={() => <CoursesList currentUser={this.state.currentUser}/>}/>
                      <Route path="/courseDetails/:id?" exact render={(props) => <CourseDetail {...props}/>}/>

                      <Route path="/StudentCoursesList" exact component={() => <CoursesListStudent currentUser={this.state.currentUser}/>}/>
                      <Route path="/courseDetailsStudent/:id?" exact render={(props) => <CourseDetailStudent {...props} currentUser={this.state.currentUser} />}/>
                  </Switch>
              </div>
          </Router>
        );
    }
}
