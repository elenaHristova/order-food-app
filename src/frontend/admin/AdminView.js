import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserList from "./UserList";
import DishList from "./DishList";
import { Menu } from "semantic-ui-react";
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

class AdminView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>
						<Menu>
							<Menu.Item>
								<Link to="/">Users editor</Link>
							</Menu.Item>
							<Menu.Item>
								<Link to="/dishes">Dishes editor</Link>
							</Menu.Item>
						</Menu>
						<Route path="/" exact component={ () => <UserList />} />
						<Route path="/dishes" component={() => <DishList />} />
					</div>;
  }
};

export default AdminView;