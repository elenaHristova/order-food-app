import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ApiClient from "./ApiClient";
import { Form, Button } from "semantic-ui-react";
import { Formik } from 'formik';
import { Link } from 'react-router-dom';

class LoginForm extends Component {

  onSubmit = async(event, values) => {
    event.preventDefault();

    let userData = {
      username: values.username,
      password: values.password
    };

    let user = await ApiClient.loginUser(userData);

    if (user) {
      this.props.setUser(user);
    } else {
      console.log("invalid user");
    }

  }

  render() {
    let form = <Formik
      >
      {({ handleSubmit, handleChange, handleBlur, values, errors }) => (
        <Form>
          <Form.Field>
            <label>Username</label>
            <input type="text" name="username" onChange={handleChange} defaultValue={values.username}/>
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input type="password" name="password" onChange={handleChange} defaultValue={values.password}/>
          </Form.Field>
          <Button onClick={(event) => this.onSubmit(event, values)}>Login</Button>
          <p>You don't have an account? Register! <Link to="/register">Register</Link></p>
        </Form>
      )}
    </Formik>;

    return (
    <div>
    	<h3>Login</h3>
    	{ form }
    </div>);
  }
};

export default LoginForm;