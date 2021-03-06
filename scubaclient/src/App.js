import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import './App.css';
// import Dashboard from './containers/Dashboard';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';


class Login extends Component {

  static muiName = 'FlatButton';

  render() {
    return (
      <div className='Logins'>
        <FlatButton {...this.props}
          label="Diving Center"
          containerElement={<Link to="/login" />}
          />
        <a href='http://localhost:3001/auth/facebook'>
          <FlatButton {...this.props}
            label="Login"
            />
        </a>
      </div>
    );
  }
}

const Logged = (props) => {
  const { onLogout, ...rest } = props
  return (
    <IconMenu
      {...rest}
      iconButtonElement={
        <IconButton><MoreVertIcon /></IconButton>
      }
      targetOrigin={{horizontal: 'right', vertical: 'top'}}
      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
    >
      <MenuItem
        primaryText="Admin"
        containerElement={<Link to="/" />}
      />
      <MenuItem
        primaryText="User"
        containerElement={<Link to="/events" />}
      />
      <MenuItem
        primaryText="About"
        containerElement={<Link to="/about" />}
      />
      <MenuItem
        primaryText="Sign out"
        onTouchTap={() => props.onLogout()}
      />
    </IconMenu>
  )
}

Logged.muiName = 'IconMenu';

class App extends Component {

  render() {
    return (
      <div>
        <AppBar
          title="Book a Scuba"

          iconElementLeft={<IconButton
            containerElement={<Link to="/events" />}
            ><NavigationClose /></IconButton>}
          iconElementRight={this.props.user.token ?
            <Logged
              onLogout={() => this.props.logout()}/> :
            <Login />}
        />
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch({type: 'LOGOUT'})
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
