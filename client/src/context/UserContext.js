import React, { Component } from 'react';

export const UserContext = React.createContext();

class UserContextProvider extends Component {
  state = { userId: '5fc8d9d5f6779c0312d44dca' };
  logUserIn = (user) => {
    this.setState(user);
  };
  logUserOut = () => {
    this.setState({ success: false });
  };
  render() {
    return (
      <UserContext.Provider
        value={{
          ...this.state,
          logUserIn: this.logUserIn,
          logUserOut: this.logUserOut,
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default UserContextProvider;
