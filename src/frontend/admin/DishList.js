import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ApiClient from ".././ApiClient";
import { map } from "lodash";
import DishForm from "./DishForm";
import { Table, Icon, Modal, Button } from "semantic-ui-react";

function EditOverlay(props) {
	return (
		 <Modal open={true} closeIcon={true} onClose={props.onClose}>
			<Modal.Content>
				<DishForm onClose={props.onClose} activeUser={props.activeUser} dishId={props.dishId} />
			</Modal.Content>
		</Modal>
	);	
}

class DishList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
		};
	}

	componentDidMount = async() => {
		await this.loadDishes();
		this.setState({ isLoading: false });
	}

	loadDishes = async () => {
		let dishes =  await ApiClient.getDishes();
		this.setState({ dishes });
	}

	editDish = (event, dishId) => {
		event.preventDefault();
		this.setState({
			isEditing: true,
			dishId,
		});
	}

	openCreateView = (event) => {
		event.preventDefault();
		this.setState({
			isCreating: true,
		});
	}

	deleteDish = async(event, rowId, dishId) => {
		event.preventDefault();
		if (confirm("Are you sure you want to delete dish with ID " + rowId)) {
			await ApiClient.deleteDish(dishId);
			await this.loadDishes();
		}
	}


	onClose = async() => {
		await this.loadDishes();
		this.setState({
			isEditing: false,
			isCreating: false,
		});
	}

	render() {
		return (
			<div>
				{ this.state.isEditing ? <EditOverlay onClose={this.onClose} dishId={this.state.dishId} /> : null }
				{ this.state.isCreating ? <EditOverlay onClose={this.onClose} activeUser={this.props.activeUser} /> : null  }
				<h3>Dishes</h3>
				{
					this.state.loading
					?
					<p>Loading...</p>
					: 
					<Table>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>ID</Table.HeaderCell>
								<Table.HeaderCell>Name</Table.HeaderCell>
								<Table.HeaderCell>Description</Table.HeaderCell>
								<Table.HeaderCell>Type</Table.HeaderCell>
								<Table.HeaderCell>Price</Table.HeaderCell>
								<Table.HeaderCell>Edit</Table.HeaderCell>
								<Table.HeaderCell>Delete</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
						{ 
							map(this.state.dishes, (dish, key) => {
								return <Table.Row key={key}>
										<Table.Cell>{key + 1}</Table.Cell>
										<Table.Cell>{dish.name}</Table.Cell>
										<Table.Cell>{dish.description}</Table.Cell>
										<Table.Cell>{dish.type}</Table.Cell>
										<Table.Cell>{dish.price}</Table.Cell>									
										<Table.Cell><Icon name="edit" onClick={(event) => this.editDish(event, dish.id)}/></Table.Cell>
										<Table.Cell><Icon name="delete" onClick={(event) => this.deleteDish(event, key + 1, dish.id)}/></Table.Cell>
									</Table.Row>;
								})
						}
						</Table.Body>
					</Table>
				}	
				<Button onClick={this.openCreateView}>Create dish</Button>
		</div>)	
	}			
};

export default DishList;