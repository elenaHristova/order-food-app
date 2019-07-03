import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import LoginForm from "./LoginForm";
import UserForm from "./UserForm";
import UserProvider from "./UserProvider";
import MenuList from "./MenuList";
import { Menu, Button } from "semantic-ui-react";
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeUser: null,
		}
	}

	getActiveUser = (activeUser) => {
		console.log(activeUser);
		if (activeUser._id) {
			activeUser.id = activeUser._id;
			delete activeUser._id;
		}
		this.setState({ activeUser, isAdmin: activeUser.role === "admin" });
	}

	logout = () => {
		this.setState({ activeUser: null });
	}
  
	render() {
		const {
			activeUser,
			isAdmin,
		} = this.state;

		return ( <div>
			<Router>
				{
					activeUser 
					?
					<div>
						<a href="/"  onClick={this.logout}> Logout </a>
						<UserProvider activeUser={activeUser} />
					</div>					
					:
					<div>
						<Menu>
							<Menu.Item>
								<Link to="/">Login</Link>
							</Menu.Item>
							<Menu.Item>
								<Link to="/menu">Menu</Link>
							</Menu.Item>
						</Menu>
						<Route path="/" exact component={() => <LoginForm setUser={this.getActiveUser} activeUser={activeUser}/>} />
						<Route path="/register" component={ () => <UserForm setUser={this.getActiveUser} activeUser={activeUser}/>} />
						<Route path="/menu" exact component={ () => <MenuList /> } />	
					</div>
				}
			</Router>
		</div> );
  	}
};

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
