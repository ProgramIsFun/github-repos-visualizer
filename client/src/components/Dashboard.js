import React, {Component} from 'react';
import PropTypes from 'prop-types';

import buttonList from './initialButtonList';
import Layout from '../containers/Layout';
import SocialButtonList from './SocialButtonList';
import SocialProfileList from './SocialProfileList';
import {auth} from '../firebase';

import './Dashboard.css';
import {cgg} from "../util/cgg";
import Home from "./Home";

class Dashboard extends Component {
    static propTypes = {
        providerData: PropTypes.arrayOf(PropTypes.object).isRequired
    };

    // static defaultProps = {
    //   providerData: []
    // };

    state = {
        buttonList: buttonList,
        providerData: this.props.providerData
    };


    componentDidMount() {
        cgg("qqq", this.state.buttonList)
        cgg("eee", this.state.providerData)
        this.updateProviders(this.state.providerData);
    }

    handleCurrentProviders = providerData => {
        this.updateProviders(providerData);
    };

    /**
     * Updates visibility of the Social Buttons and Social Profiles
     */
    updateProviders = providerData => {
        let buttonList = {...this.state.buttonList};

        providerData.forEach(provider => {
            const providerName = provider.providerId.split('.')[0];
            cgg(providerName)
            buttonList = this.updateButtonList(buttonList, providerName, false);
        });

        this.setState({buttonList, providerData});
    };

    /**
     * Unlinks a provider and if there are no more providers associated
     * with the account, delete the user account from Firebase
     */
    handleUnlinkedProvider = (providerName, providerData) => {
        if (providerData.length < 1) {
            auth
                .getAuth()
                .currentUser.delete()
                .then(() => console.log('User Deleted'))
                .catch(() => console.error('Error deleting user'));
        }

        let buttonList = {...this.state.buttonList};
        buttonList = this.updateButtonList(buttonList, providerName, true);

        this.setState({buttonList, providerData});
    };

    updateButtonList = (buttonList, providerName, visible) => {
        cgg(providerName,"visible -> false")


            return({
                ...buttonList,
                [providerName]: {
                    ...buttonList[providerName],
                    visible
                }
            })



    };

    render() {
        return (
            <Layout>
                <SocialProfileList
                    auth={auth.getAuth}
                    providerData={this.state.providerData}
                    unlinkedProvider={this.handleUnlinkedProvider}
                />


                {/*<p style={{textAlign: 'center'}}>*/}
                {/*    <strong>aaaaaaaaaaaaaConnect Other Social Accounts</strong>*/}
                {/*</p>*/}


                {/*<SocialButtonList*/}
                {/*    buttonList={this.state.buttonList}*/}
                {/*    auth={auth.getAuth}*/}
                {/*    currentProviders={this.handleCurrentProviders}*/}
                {/*/>*/}

                <button
                    className="btn__logout"
                    onClick={() => {
                        cgg("signing out")
                        auth.getAuth().signOut()}}
                >
                    Logout
                </button>
                <Home></Home>
            </Layout>
        );
    }
}

export default Dashboard;
