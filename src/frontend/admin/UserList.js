import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ApiClient from ".././ApiClient";
import { map } from "lodash";
import UserForm from ".././UserForm";
import { Table, Icon, Modal, Button } from "semantic-ui-react";

function EditOverlay(props) {
	return (
		 <Modal open={true} closeIcon={true} onClose={props.onClose}>
			<Modal.Content>
				<UserForm onClose={props.onClose} isAdmin={true} userId={props.userId} />
			</Modal.Content>
		</Modal>
	);	
}

class UserList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
		};
	}

	componentDidMount = async() => {
		let users = await ApiClient.getUsers();
		this.setState({ users, isLoading: false});
	}

	editUserById = (event, userId) => {
		event.preventDefault();
		this.setState({
			isEditing: true,
			userId,
		});
	}

	openCreateView = (event) => {
		event.preventDefault();
		this.setState({
			isCreating: true,
		});
	}

	deleteUserById = async(event, rowId, userId) => {
		event.preventDefault();
		if (confirm("Are you sure you want to delete user with ID " + rowId)) {
			await ApiClient.deleteUser(userId);
			let users = await ApiClient.getUsers();
			this.setState({ users });
		}
	}


	onClose = async() => {
		let users = await ApiClient.getUsers();
		this.setState({ 
			users,
			isEditing: false,
			isCreating: false,
		});
	}

	render() {
		return (
			<div>
				{ this.state.isEditing ? <EditOverlay onClose={this.onClose} userId={this.state.userId} /> : null }
				{ this.state.isCreating ? <EditOverlay onClose={this.onClose} /> : null  }
				<h3>Users</h3>
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
								<Table.HeaderCell>Username</Table.HeaderCell>
								<Table.HeaderCell>Gender</Table.HeaderCell>									
								<Table.HeaderCell>Role</Table.HeaderCell>
								<Table.HeaderCell>Edit</Table.HeaderCell>
								<Table.HeaderCell>Delete</Table.HeaderCell>								
							</Table.Row>
						</Table.Header>
						<Table.Body>
						{ 
							map(this.state.users, (user, key) => {
							return <Table.Row key={key}>
									<Table.Cell>{key + 1}</Table.Cell>								
									<Table.Cell>{user.name}</Table.Cell>
									<Table.Cell>{user.username}</Table.Cell>
									<Table.Cell>{user.gender}</Table.Cell>
									<Table.Cell>{user.role}</Table.Cell>
									<Table.Cell><Icon name="edit" onClick={(event) => this.editUserById(event, user.id)}/></Table.Cell>
									<Table.Cell><Icon name="delete" onClick={(event) => this.deleteUserById(event, key + 1, user.id)}/></Table.Cell>
								</Table.Row>;
							})
						}
						</Table.Body>
					</Table>
				}	
				<Button onClick={this.openCreateView}>Create user</Button>
		</div>)	
	}			
};

export default UserList;