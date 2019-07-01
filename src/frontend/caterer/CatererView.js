import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OrderList from "./OrderList";

class CatererView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <OrderList activeUser={this.props.activeUser}/>;
  }
};

export default CatererView;