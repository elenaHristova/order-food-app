import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ApiClient from ".././ApiClient";
import { map, filter } from "lodash";
import { Table, Icon, Modal, Button } from "semantic-ui-react";

const ORDER_STATUS = [ 'Sent', 'In process of cooking', 'Coming', 'Completed' ];

class OrderList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			orders: [],
		};
	}

	componentDidMount = async() => {
		let orders = await ApiClient.getActiveOrdersByCaterer(this.props.activeUser._id);
		let users = await ApiClient.getUsers();
		this.setState({ orders, users, isLoading: false });
	}

	markAsDone = async(event, id) => {
		event.preventDefault();

		let order = {
			id,
			status: 3,
		}

		await ApiClient.editOrder(order);

		this.setState({ isLoading: true });
		let orders = await ApiClient.getOrders();
		this.setState({ orders, isLoading: false });
	}

	getOrderedItems = (description) => {
		let arrayOfItems = description.split(";");

		return map(arrayOfItems, (item) => <p>{ item }</p>);
	}

	render() {
		let {
			manageableSatus
		} = this.props;

		let {
			loading,
			orders,
			users,
		} = this.state;

		return (
			<div>
				<h3>Active Orders</h3>
				{
					loading
					?
					<p>Loading...</p>
					:
					orders.length === 0 
					?
					<p>No orders available</p>
					: 
					<Table>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Order</Table.HeaderCell>
								<Table.HeaderCell>Time</Table.HeaderCell>
								<Table.HeaderCell>Order</Table.HeaderCell>
								<Table.HeaderCell>Status</Table.HeaderCell>
								<Table.HeaderCell>Address</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
						{ 
							map(orders, (order, key) => {
							return <Table.Row key={key}>
									<Table.Cell>{order.id}</Table.Cell>
									<Table.Cell>{order.time}</Table.Cell>
									<Table.Cell>{ this.getOrderedItems(order.description) }</Table.Cell>
									<Table.Cell>
										Current: {ORDER_STATUS[order.status]}
										<br/>
										{ order.status === 2 && <Button onClick={(event) => this.markAsDone(event, order.id)}>Done</Button> }					
									</Table.Cell>
									<Table.Cell>
										{ filter(users, (user) => user.id === order.userId)[0].address }							
									</Table.Cell>
								</Table.Row>;
							})
						}
						</Table.Body>
					</Table>
				}
		</div>)	
	}			
};

export default OrderList;