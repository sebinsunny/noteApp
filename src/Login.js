import React, {Component, useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import SimpleMap from './MapView'
import { BrowserRouter as Router, Route, Switch, Redirect ,Link} from "react-router-dom";

class Login extends Component {
    state = {
        username: '',
        password: '',
        error: null,
        redirect: false
    };

    handleUserInput = (event) => {
        // update state values
        this.setState({
            username: event.target.value,
            error:null
        });

    };
    handlePassword = (event) => {
        // update state values
        this.setState({
            password: event.target.value,
        });

    };

    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.state)

        // send credentials to back-end to check account
        axios.post("https://api.sebin.ai/login", this.state).then((res) => {
            if (res.data.status=='success') {
                console.log(res.data)
               this.setState({redirect:true})

            }
            else {
                // show error
                this.setState({
                    error: res.data.msg
                })
            }
        });
    };

    handleSignUp = (event) => {
        event.preventDefault();
        console.log(this.state)

        // handle creating account
        axios.post("https://api.sebin.ai/signup", this.state).then((res) => {
            if (res.data.status=='success') {
                console.log(res.data)

                this.setState({
                    error: res.data.msg
                })
            }
            else {
                // show error
                this.setState({
                    error: res.data.errorMsg
                })
            }
        });
    };

    render() {
        const  redirect  = this.state.redirect;
        console.log(this.props)
        const user = this.state.username

        if (redirect) {
            return(
                <Router>
                    <div>
                        <Switch>

                            <Redirect strict from="/login" to={{pathname:"/map"}} />
                            <Route path="/map">
                                <SimpleMap user = {user} />
                            </Route>



                        </Switch>
                    </div>
                </Router>
            );


        }
        return (
            <div className="Login">
                <Form>
                    <Form.Group size="lg" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            autoFocus
                            type="username"
                            value={this.state.username}
                            onChange={this.handleUserInput}
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={this.state.password}
                            onChange={this.handlePassword}
                        />
                    </Form.Group>
                    <span>{this.state.error}</span>
                    <Button block size="lg" onClick={this.handleSubmit}>
                        Login
                    </Button>
                    <Button block size="lg "onClick={this.handleSignUp}>Sign Up</Button>
                </Form>
            </div>
        );
    }


}
export default Login;
