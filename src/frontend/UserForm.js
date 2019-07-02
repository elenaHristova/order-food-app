import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ApiClient from "./ApiClient";
import { Message, Dropdown, Form, Button } from "semantic-ui-react";
import { Formik } from 'formik';
import { map } from "lodash";
import { withRouter } from "react-router-dom";
import { ROLES, ROLES_OPTIONS, GENDER_OPTIONS } from "./util/constraints";

class UserForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
		}
	}

	componentDidMount = async() => {
		if (this.props.userId) {		
			this.setState({ isLoading: true });	
			let user = await ApiClient.getUserById(this.props.userId);
			this.setState({ user, isLoading: false});
		}
	}

	onSubmit = async(event, values) => {
		event.preventDefault();

		let user = {
			name: values.name,
			username: values.username,
			password: values.password,
			address: values.address,
			gender: values.gender,
			role: !values.role ? "user" : values.role,
		};
		let errorCreation = false;

		if (this.state.user) {
			user.id = this.props.userId;
			await ApiClient.editUser(user);
		} else {			
			let createdUser = await ApiClient.createUser(user);
			if (createdUser.error) {
				errorCreation = true;
				this.setState({ showDuplicateError: true });
			} else if (this.props.setUser) {
				this.props.setUser(createdUser);
				this.props.history.push("/");
			}
		}
		
		if (this.props.onClose && !errorCreation) {
			await this.props.onClose();
		}	
	}

	onChange = () => {
		this.setState({ showDuplicateError: false });
	}

	isEdit = () => { return this.props.userId !== null; }

	onDropDownChange = (event, data, handleChange) => {
		event.preventDefault();
		handleChange(data.value);
	}

	render() {
		let { 
			user,
			isLoading,
			showDuplicateError,
		} = this.state;

		let form = 
		<Formik
			initialValues={user}
			validate={this.onChange}
			>
		{({ handleSubmit, handleChange, handleBlur, values, errors, setFieldValue }) => (
			<Form>
				<Form.Field>
					<label>Name</label>
					<input type="text" name="name" onChange={handleChange} defaultValue={ values.name } />
				</Form.Field>
				<Form.Field>
					<label>Username</label>
					<input type="text" name="username" onChange={handleChange} defaultValue={ values.username }/>
				</Form.Field>
				<Form.Field>
					<label>Password</label>
					<input type="password" name="password" onChange={handleChange} defaultValue={ values.password }/>
				</Form.Field>
				{
					!this.props.isAdmin &&	
					<Form.Field>
						<label>Address</label>
						<input type="text" name="address" onChange={handleChange} defaultValue={ values.address }/>
					</Form.Field>
				
				}
				<Form.Field>
					<label>Gender</label>
					<Dropdown
						name="gender"
						fluid
						selection
						onChange={ (event, data) => setFieldValue("gender", data.value) }
						value={values.gender}
						options={GENDER_OPTIONS}
					/>	
				</Form.Field>
				{
					this.props.isAdmin ?	
						<Form.Field>
							<label>Role</label>
							<Dropdown
								name="role"
								fluid
								selection
								onChange={ (event, data) => setFieldValue("role", data.value) }
								value={values.role}
								options={ROLES_OPTIONS}
							/>	
						</Form.Field> 
					:
						null
				}
				{ showDuplicateError && 
					<Message negative>
					    <Message.Header>A user with this username already exists!</Message.Header>
					    <p>Select another username</p>
				  	</Message>
				}
				<Button onClick={(event) => this.onSubmit(event, values)}>{ this.state.user ? "Save" : "Register" }</Button>
			</Form>
		)}
		</Formik>;

		return (
			isLoading
			?
			<p>Loading...</p>
			:
			<div>
				<h3>{ user ? "Edit user " : "Register user" }</h3>
				{ form }
			</div>
		);
  	}
};

export default withRouter(UserForm);