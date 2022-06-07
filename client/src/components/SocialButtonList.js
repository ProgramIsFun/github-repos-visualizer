import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import './SocialButtonList.css';
import {cgg} from "../util/cgg";
import {dbbbbb,auth} from "../firebase/firebase";




const propTypes = {
  buttonList: PropTypes.shape({
    github: PropTypes.shape({
      visible: PropTypes.bool.isRequired,
      provider: PropTypes.func.isRequired
    }),
    // twitter: PropTypes.shape({
    //   visible: PropTypes.bool.isRequired,
    //   provider: PropTypes.func.isRequired
    // }),
    // facebook: PropTypes.shape({
    //   visible: PropTypes.bool.isRequired,
    //   provider: PropTypes.func.isRequired
    // })
  }).isRequired,
  auth: PropTypes.func.isRequired,
  currentProviders: PropTypes.func
};

const defaultProps = {
  currentProviders: null
};

const SocialButtonList = ({ history, buttonList, auth, currentProviders }) => {
  /**
   * Handles successfull authentication.
   * 'currentProviders' is null when the user is in Login page
   */
  console.log("qqqqqqq",currentProviders, typeof (currentProviders))
  const authHandler = authData => {
    cgg("called")
    if (authData) {
      console.log("current provider is sssssssss", currentProviders )
      cgg("authdata, should contain access token",authData)

      // saving this access token for later use
      dbbbbb.collection("users").doc(auth().currentUser.uid).set({
        ...authData.credential
      })
          .then(() => {
            console.log("Document successfully written!");
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });



      if (currentProviders === null) {
        //this run
        history.push('/dashboard');
      } else {
        console.log("authData", authData )
        currentProviders(authData.user.providerData);
      }
    } else {
      console.error('Error authenticating');
    }
  };

  /**
   * Authenticates the user with a social media provider.
   * Either creates a new user account in Firebase or links
   * a different provider to the same user account
   */
  const authenticate = (e, provider) => {
    const providerOAuth = buttonList[provider].provider();

    if (!auth().currentUser) {
      auth()
          .signInWithPopup(providerOAuth)
          // .signInWithRedirect(providerOAuth)
          // if signInWithRedirect, no data is going to authhandler,  u must later call getRedirectResult




          // for here , github will redirect to link u set in github setting,
          // which should the one list in firebase github auth page,
          // after firebase handle that thing in their server,  it pass back to our website , even localhost
        .then(authHandler)
        .catch(err => console.error(err));
    } else {
      auth()
        .currentUser.linkWithPopup(providerOAuth)
        .then(authHandler)
        .catch(err => console.error(err));
    }
  };

  const renderButtonList = provder => {
    const visible = buttonList[provder].visible;

    return (
      <button
        key={provder}
        className={`btn__social btn--${provder} ${!visible && 'hidden'}`}
        onClick={e => authenticate(e, provder)}
      >
        {provder}
      </button>
    );
  };

  return (
    <div className="btn__social--list">
      {Object.keys(buttonList).map(renderButtonList)}
    </div>
  );
};

SocialButtonList.propTypes = propTypes;
SocialButtonList.defaultProps = defaultProps;

export default withRouter(SocialButtonList);
