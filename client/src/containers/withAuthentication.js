import React, { Component } from 'react';

import { auth } from '../firebase';
import {cgg} from "../util/cgg";

/**
 * HOC that verifies user is authenticated before returning the
 * protected component
 */
export default WrappedComponent => {
  class WithAuthentication extends Component {
    state = {
      providerData: []
    };

    componentDidMount() {
      auth.getAuth().onAuthStateChanged(user => {

        cgg("run one time first")
        cgg("does user store the access token?", user)
        if (user) {
          cgg("user retrieved from firebase lib ,providerData field",  user.providerData)

          this.setState({ providerData: user.providerData });
        } else {
          console.info('Must be authenticated');
          this.props.history.push('/login');
        }
      });
    }

    render() {
      return this.state.providerData.length > 0 ? (
        <WrappedComponent
          {...this.props}
          providerData={this.state.providerData}
        />
      ) : (

          <p>Loading...   as providerData.length =0  </p>

      );
    }
  }

  return WithAuthentication;
};
