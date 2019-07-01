import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ApiClient from ".././ApiClient";
import { Dropdown, Form, Button, TextArea } from "semantic-ui-react";
import { Formik } from 'formik';
import { map } from "lodash";

const DISH_TYPES = [ "salad", "pasta", "pizza", "dessert", "drink"];
const DISH_TYPES_OPTIONS = map(DISH_TYPES, (dishType, key) => {
	return { key, text: dishType, value: dishType };
});

class DishForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
		}
	}

	componentDidMount = async() => {
		if (this.props.dishId) {
			this.setState({ isLoading: true });			
			let dish = await ApiClient.getDishById(this.props.dishId);
			this.setState({ dish, isLoading: false});
		}
	}

	onSubmit = async(event, values) => {
		event.preventDefault();

		let dish = {
			name: values.name,
			description: values.description,
			price: values.price,
			type: values.type,
		};

		if (this.state.dish) {
			dish.id = this.props.dishId;
			await ApiClient.editDish(dish);
		} else {
			await ApiClient.createDish(dish);
		}
		await this.props.onClose();

	}

	isEdit = () => { return this.props.dishId !== null; }

	render() {
		let { 
			dish,
			isLoading,
		} = this.state;

		let form = 
		<Formik
			initialValues={dish}
			>
		{({ handleSubmit, handleChange, handleBlur, values, errors, setFieldValue }) => (
			<Form>
				<Form.Field>
					<label>Name</label>
					<input type="text" name="name" onChange={handleChange} defaultValue={ values.name } />
				</Form.Field>
				<Form.Field>
					<label>Description</label>
					<TextArea name="description" onChange={handleChange} defaultValue={ values.description } />
				</Form.Field>
				<Form.Field>
					<label>Type</label>
					<Dropdown
						name="type"
						fluid
						selection
						onChange={ (event, data) => setFieldValue("type", data.value) }
						value={values.type}
						options={DISH_TYPES_OPTIONS}
					/>	
				</Form.Field>
				<Form.Field>
					<label>Price</label>
					<input type="text" name="price" onChange={handleChange} defaultValue={ values.price } />
				</Form.Field>
				<Button onClick={(event) => this.onSubmit(event, values)}>{ dish ? "Save" : "Create" }</Button>
			</Form>
		)}
		</Formik>;

		return (
			isLoading
			?
			<p>Loading...</p>
			:
			<div>
				<h3>{ dish ? "Edit dish " : "Create dish" }</h3>
				{ form }
			</div>
		)
  	}
};

export default DishForm;