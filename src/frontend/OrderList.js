import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ApiClient from "./ApiClient";
import { map } from "lodash";
import { Table, Icon, Modal, Button } from "semantic-ui-react";
import { Dropdown } from 'semantic-ui-react';
import { ORDER_STATUS } from "./util/constraints";

class OrderList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
		};
	}

	componentDidMount = async() => {
		let orders = await ApiClient.getOrdersByUserId(this.props.activeUserId);
		orders = orders.sort(function(order1, order2) {
			let first = new Date(order1.time);
			let second = new Date(order2.time);
			return first>second ? -1 : first<second ? 1 : 0;
		});
		
		this.setState({ orders, isLoading: false });
	}

	getOrderedItems = (description) => {
		let arrayOfItems = description.split(";");

		return map(arrayOfItems, (item, key) => <p key={key}>{ item }</p>);
	}

	render() {
		let {
			manageableSatus
		} = this.props;

		let {
			orders,
			loading,
		} = this.state;

		return (
			<div>
				<h3>Orders</h3>
				{
					loading
					?
					<p>Loading...</p>
					:
					orders && orders.length === 0 
					?
					<p>You haven't ordered yet</p>
					:
					<Table>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Time</Table.HeaderCell>
								<Table.HeaderCell>Order</Table.HeaderCell>
								<Table.HeaderCell>Status</Table.HeaderCell>
								<Table.HeaderCell>Price</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
						{ 
							map(this.state.orders, (order, key) => {
							return <Table.Row key={key}>
									<Table.Cell>{order.time}</Table.Cell>
									<Table.Cell>{ this.getOrderedItems(order.description) }</Table.Cell>
									<Table.Cell>
										{ORDER_STATUS[order.status]} 
										{ 
											manageableSatus 
											? <Dropdown
												placeholder='Change status'
												fluid
												selection
												options={ORDER_STATUS}
												/> 
											: null
										}
									</Table.Cell>
									<Table.Cell>{order.price} lv</Table.Cell>
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