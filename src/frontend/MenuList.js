import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ApiClient from "./ApiClient";
import { map, isUndefined, isEmpty } from "lodash";
import { Message, Dropdown, Tab, Table, Icon, Modal, Button } from "semantic-ui-react";
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import { withRouter } from 'react-router-dom';


class ViewOrderOverlay extends Component {
	constructor(props) {
		super(props);
		this.price = map(props.orderList, item => parseInt(item.quantity)*parseFloat(item.price)).reduce((prev, next) => prev + next );
		this.state = { orderSent: false };
	}

	order = async() => {
		await ApiClient.executeOrder(this.props.orderList, this.price, this.props.activeUserId);
		this.props.onClose();	
	}

	render = () => {
		let { activeUserId, orderList, onClose } = this.props;
		let { orderSent } = this.state;

		return (
			 <Modal open={!orderSent} closeIcon={true} onClose={onClose}>
				<Modal.Content>
					{ map(orderList, (item, key) => { return <p key={key}>{item.quantity} x {key}</p>; }) }
					<p>Price: {this.price.toFixed(2)} lv</p>
					<Button content="Finish order" onClick={this.order} />
				</Modal.Content>
			</Modal>
		);
	}	
}

const QUANTITY_OPTIONS = [
	{ key: 0, value: 0, text: 0},
	{ key: 1, value: 1, text: 1},
	{ key: 2, value: 2, text: 2},
	{ key: 3, value: 3, text: 3},
	{ key: 4, value: 4, text: 4},
];

class MenuList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			orderList: {},
		};
	}

	componentDidMount = async() => {
		await this.loadMenuItems();
		this.setState({ isLoading: false });
	}

	loadMenuItems = async () => {
		let menuItems = await ApiClient.getDishesByAllTypes();
		this.setState({ menuItems });
	}

	order = () => {
		this.setState({ openViewOrderOverlay: true })
	}

	onClose = async() => {
		//this.setState({	openViewOrderOverlay: false,  orderList: {} });
		this.props.history.push('/orders');
	}

	updateOrderList = (event, menuItem, quantity) => {
		event.preventDefault();
		
		let orderList = this.state.orderList;
		if (quantity === 0 && !isUndefined(orderList[menuItem.name])) {
			delete orderList[menuItem.name];
		} else {
			orderList[menuItem.name] = { quantity, id: menuItem.id, price: menuItem.price };
		}

		this.setState({ orderList });
	}

	renderTabContent = (dishType) => {
		let {
			orderList
		} = this.state;

		if (!this.state.menuItems) {
			return null;
		}

		return <Table>
				<Table.Body>
				{ 
					map(this.state.menuItems[dishType], (menuItem, key) => {
						return <Table.Row key={key}>
								<Table.Cell>{menuItem.name}</Table.Cell>
								<Table.Cell>{menuItem.description}</Table.Cell>
								<Table.Cell>{menuItem.price} lv</Table.Cell>
									{ this.props.activeUser && 
										<Table.Cell>
										<Dropdown
											placeholder="Select quantity"
											selection
											fluid
											value={ orderList[menuItem.name] ? orderList[menuItem.name].quantity :  0}
											onChange={ (event, data) => this.updateOrderList(event, menuItem, data.value) }
											options={QUANTITY_OPTIONS}
										/></Table.Cell>
									}								
							</Table.Row>;
						}
					)
				}
				</Table.Body>
		</Table>;
	}

	render() {
		let {
			openViewOrderOverlay,
			orderList,
		} = this.state;

		let panes = [
		  { menuItem: 'Salad', render: () => <Tab.Pane>{ this.renderTabContent("salad") }</Tab.Pane> },
		  { menuItem: 'Pasta', render: () => <Tab.Pane>{ this.renderTabContent("pasta") }</Tab.Pane> },
		  { menuItem: 'Pizza', render: () => <Tab.Pane>{ this.renderTabContent("pizza") }</Tab.Pane> },
		  { menuItem: 'Desserts', render: () => <Tab.Pane>{ this.renderTabContent("dessert") }</Tab.Pane> },
		  { menuItem: 'Drinks', render: () => <Tab.Pane>{ this.renderTabContent("drink") }</Tab.Pane> },
		];

		return (
			<div>
				<h3>Menu</h3>
				{
					this.state.loading
					?
					<p>Loading...</p>
					: 
					<Tab menu={{ fluid: true, vertical: true, tabular: true }}  panes={panes} />
					
				}	
				{ this.props.activeUser && openViewOrderOverlay ? <ViewOrderOverlay onClose={this.onClose} activeUserId={this.props.activeUser.id } orderList={orderList} /> : null }
				
				{ 
					!isEmpty(orderList) && <Message>
				    <Message.Header>Items to order</Message.Header>
				    { map(orderList, (item, key) => <p key={key}>{item.quantity} * {key}</p>)}
				    <b>Total: { map(orderList, item => parseInt(item.quantity)*parseFloat(item.price)).reduce((prev, next) => prev + next ).toFixed(2) } lv</b>
				  </Message>
				}
				{ !isEmpty(orderList) && <Button onClick={this.order}>Order</Button> }			
		</div>)	
	}			
};

export default withRouter(MenuList);