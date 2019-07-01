import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OrderList from "./OrderList";

class PersonelView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <OrderList />;
  }
};

export default PersonelView;