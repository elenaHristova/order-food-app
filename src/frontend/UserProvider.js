import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AdminView from "./admin/AdminView";
import CatererView from "./caterer/CatererView";
import PersonelView from "./personel/PersonelView";
import MenuList from "./MenuList";
import OrderList from "./OrderList";
import { Menu } from "semantic-ui-react";
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

class UserProvider extends Component {
  constructor(props) {
    super(props);
    this.role = props.activeUser.role;
  }

  render() {
    if (this.role === 'admin') {
      return <AdminView activeUser={this.props.activeUser}/>;
    } else if (this.role === 'caterer') {
      return <CatererView activeUser={this.props.activeUser}/>;
    } else if (this.role === 'personel') {
      return <PersonelView activeUser={this.props.activeUser}/>;
    }

    return (
      <div>
        <Router>
          <Menu>
            <Menu.Item>
              <Link to="/">Menu</Link>
            </Menu.Item>
            <Menu.Item>              
              <Link to="/orders">Orders</Link>
            </Menu.Item>
          </Menu>
          <Route path="/" exact component={ () => <MenuList activeUser={this.props.activeUser}/> } />
          <Route path="/orders" component={ () => <OrderList activeUserId={this.props.activeUser.id}/> } />
        </Router>
      </div>
    );
  }
};

export default UserProvider;