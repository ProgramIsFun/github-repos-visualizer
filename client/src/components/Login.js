import React, {useEffect, useState} from "react";
import {Redirect} from "react-router-dom";
import Styled from "styled-components";
import GithubIcon from "mdi-react/GithubIcon";
import {connect} from "react-redux";
import {auth} from "../firebase";
import buttonList from './initialButtonList';
import SocialButtonList from "./SocialButtonList";
import Layout from "../containers/Layout";
import {cgg} from "../util/cgg";
import { useHistory } from "react-router";
function Login({login, ...state}) {
    // const { state, dispatch } = useContext(AuthContext);
    state = state.auth1
    console.log("login state passed is now ", state)
    console.log("login ", login)
    const history = useHistory();

    const [data, setData] = useState({errorMessage: "", isLoading: false});

    // const {client_id, redirect_uri} = state;

    useEffect(() => {
        // // After requesting Github access, Github redirects back to your app with a code parameter
        // const url = window.location.href;
        // console.log("now url is ", url)
        // const hasCode = url.includes("?code=");
        //
        // // If Github API returns the code parameter
        // console.log("has code or not ", hasCode)
        // console.log("current state ", state)
        // if (hasCode) {
        //     console.log("code is detected")
        //     const newUrl = url.split("?code=");
        //     window.history.pushState({}, null, newUrl[0]);
        //     setData({...data, isLoading: true});
        //
        //     const requestData = {
        //         client_id: state.client_id,
        //         redirect_uri: state.redirect_uri,
        //         client_secret: state.client_secret,    // to be honest, this secret should be hardcode in server side, not pass from client side
        //         code: newUrl[1]
        //     };
        //
        //     const proxy_url = state.proxy_url;
        //     console.log("proxy to " , proxy_url)
        //     // Use code parameter and other parameters to make POST request to proxy_server
        //
        //
        //
        //
        //
        //
        //
        //     // case 1 posting to backend nodejs   and get some data back
        //     fetch(proxy_url, {
        //         method: "POST",
        //         body: JSON.stringify(requestData)
        //     })
        //         .then(response => response.json())
        //         .then(data => {
        //             console.log("data is ", data)
        //             login({user: data, isLoggedIn: true})
        //         })
        //         .catch(error => {
        //             setData({
        //                 isLoading: false,
        //                 errorMessage: `Sorry! Login faileddddddddddddddddd ${error}`
        //             });
        //         });
        //
        //
        //     // case 2 or send the access token to get a firebase credential, signin with that credential
        //     // we now only have token
        //
        //
        //
        // }
        auth.getAuth().onAuthStateChanged(user => {
            cgg("user",user)
            if (user) {
                cgg("login already :d ")
                history.push('/dashboard');
            }
        });

    });

    // if (state.isLoggedIn) {
    //     return <Redirect to="/dashboard"/>;
    // }
    let teststyle={  position:"fixed",
        left:"0px",
        bottom:"20px",
        height:"30px",
        width:"100%",
        background:"#999"}
    return (
        <Layout contentCenter={true}>

                    <h1>Welcome</h1>
                    <p>Please login to continue</p>
                    <p style={{  position:"fixed",
                        left:"0px",
                        bottom:"50px",
                        height:"30px",
                        width:"100%",
                        background:"#999"}}>Disclaimer: Use this website at your own risk. Authur will not be held responsible for anything.</p>
                    <p style={teststyle}>You could check the source code in https://github.com/ProgramIsFun/github-repos-visualizer  and run yours. </p>
                    <SocialButtonList buttonList={buttonList} auth={auth.getAuth} />

        </Layout>
    );
}



function mapStateToProps(state) {
    return state;
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (payload) => dispatch({type: 'LOGIN', payload: payload}),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login);