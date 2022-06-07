import React, {createContext} from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import Login from "./components/Login";
import "./App.css";
import withAuthentication from './containers/withAuthentication';
import Dashboard from './components/Dashboard';



function App() {

    return (
        <Router>
            <Switch>
                <Route exact path="/login" component={Login}/>
                <Route path="/dashboard" component={withAuthentication(Dashboard)}/>
                <Redirect from="/" to="/login"/>
                {/*<Route exact path="/" component={Home}/>*/}
            </Switch>
        </Router>

    );
}

export default App;
