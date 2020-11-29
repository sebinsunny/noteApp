import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Login from "./Login";

class App extends Component {
    state = {
        loaded: false,
        authenticated: false
    };

    componentDidMount() {
        // check if user has already logged in successfully

            this.setState({
                loaded: true,
                authenticated: false
            });

    }

    setLogin = () => {
        // login component triggered authentication = true
        this.setState({
            authenticated: true
        });
    };

    render() {

        return (
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/login" render={(props) => <Login/>} />


                    </Switch>
                </div>
            </Router>
        );
    }
}
export default App;
