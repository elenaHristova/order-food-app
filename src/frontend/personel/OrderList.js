import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ApiClient from ".././ApiClient";
import { map, filter } from "lodash";
import { Table, Icon, Modal, Button } from "semantic-ui-react";
import { Dropdown } from 'semantic-ui-react';
import { ORDER_STATUS_OPTIONS, ORDER_STATUS } from "../util/constraints";


class OrderList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			orders: [],
		};
	}

	componentDidMount = async() => {
		let caterers = await ApiClient.getCarterers();
		this.setState({ caterers });
		await this.loadOrders();
	}

	loadOrders = async() => {
		let orders = await ApiClient.getOrders(this.props.activeUserId);
		orders = orders.sort(function(order1, order2) {
			let first = new Date(order1.time);
			let second = new Date(order2.time);
			return first>second ? -1 : first<second ? 1 : 0;
		});

		this.setState({ orders, isLoading: false });
	}

	changeStatus = async(event, data, id) => {
		event.preventDefault();

		let order = {
			id,
			status: data.value,
		}

		await ApiClient.editOrder(order);
		await this.loadOrders();
	}

	changeCaterer = async(event, data, id) => {
		event.preventDefault();

		let order = {
			id,
			catererId: data.value
		}

		await ApiClient.editOrder(order);
		this.setState({ isLoading: true });
		await this.loadOrders();
	}

	getOrderedItems = (description) => {
		let arrayOfItems = description.split(";");

		return map(arrayOfItems, (item, key) => <p key={key}>{ item }</p>);
	}

	render() {
		let {
			manageableSatus,
		} = this.props;
		let {
			loading,
			orders,
		} = this.state;

		return (
			<div>
				<h3>Orders</h3>
				{
					loading
					?
					<p>Loading...</p>
					:
					<Table>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Time</Table.HeaderCell>
								<Table.HeaderCell>Order items</Table.HeaderCell>
								<Table.HeaderCell>Status</Table.HeaderCell>
								<Table.HeaderCell>Assign to caterer</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
						{ 
							map(orders, (order, key) => {
							return <Table.Row key={key}>
									<Table.Cell>{order.time}</Table.Cell>
									<Table.Cell>{ this.getOrderedItems(order.description) }</Table.Cell>
									<Table.Cell>
										Current: {ORDER_STATUS[order.status]} 
										<br/>
										<Dropdown
											value={order.status}
											onChange={(event, data) => this.changeStatus(event, data, order.id)}
											fluid
											selection
											options={ORDER_STATUS_OPTIONS}
										/>										
									</Table.Cell>
									<Table.Cell>
										Current: { order.catererId && filter(this.state.caterers, (caterer) => caterer.id === order.catererId)[0].name } 
										<br/>
										<Dropdown
											onChange={(event, data) => this.changeCaterer(event, data, order.id)}
											fluid
											selection
											value={order.catererId || 0}
											options={ map(this.state.caterers, (caterer, key) => {
												 return { key: caterer.id, text: caterer.name, value: caterer.id }; 
												})
											}
										/>	
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