import { map, groupBy } from "lodash";
const axios = require('axios');
const path = "http://localhost:3000/api";

class ApiClient {

	static async getOrdersByUserId(id) {
		let response = await axios.get(`${path}/orders/user/${id}`);
		return response.data;
	}

	static async getOrders() {
		let response = await axios.get(`${path}/orders`);
		return response.data;
	}

	static async getUsers() {
		let response = await axios.get(`${path}/users`);
		return response.data;
	}

	static async getCarterers() {
		let response = await axios.get(`${path}/users/caterers`);
		return response.data;
	}	

	static async getSpecialUsers() {
		let response = await axios.get(`${path}/users/special`);
		return response.data;
	}	

	static async getDishes() {
		let response = await axios.get(`${path}/dishes`);
		return response.data;
	}	

	static async getDishesByAllTypes() {
		let response = await axios.get(`${path}/dishes`);
		let dishes = groupBy(response.data, "type");
		return dishes;
	}	

	static async loginUser(input) {
		let response = await axios.post(`${path}/users/login`, input);
		return response.data;
	}

	static async executeOrder(orderList, price, activeUserId) {
		let description = map(orderList, (itemData, item) => `${itemData.quantity} x ${item}`).join(';');
		
		let input = {
			userId: activeUserId,
			description,
			price,
		};

		await axios.post(`${path}/orders`, input);
	}	

	static async editUser(input) {
		let response = await axios.put(`${path}/users/${input.id}`, input);
		return response.data;
	}

	static async getActiveOrdersByCaterer(id) {
		let response = await axios.get(`${path}/orders/caterer/${id}`);
		return response.data;
	}


	static async editOrder(input) {
		if (input.catererId) {
			let response = await axios.put(`${path}/orders/${input.id}/${input.catererId}`, input);
			return response.data;
		}

		let response = await axios.put(`${path}/orders/${input.id}`, input);
		return response.data;
	}

	static async createUser(input) {
		let response = await axios.post(`${path}/users`, input);
		return response.data || response;
	}

	static async deleteUser(userId) {
		let response = await axios.delete(`${path}/users/${userId}`);
		return response.data;
	}

	static async getUserById(userId) {
		let response = await axios.get(`${path}/users/${userId}`);
		return response.data;
	}

	static async getAllRecipes() {
		let users = await ApiClient.getUsers();
		let reciepeResponse = await axios.get(`${path}/recipes`);
		let recipes = reciepeResponse.data
		for (var index = 0; index < recipes.length; index++) {
			let user = users.filter(user => user.id === recipes[index].userId)[0];
			if (user) {
				recipes[index].author = user.name;
			}
		}
		return recipes.sort(function(recipe1, recipe2) {
			let date1 = new Date(recipe1.timePublish);
			let date2 = new Date(recipe2.timePublish);
			return date1>date2 ? -1 : date1<date2 ? 1 : 0;
		});
	}

	static async loadDishes(id) {
		let response = await axios.get(`${path}/dishes`);
		return response.data;
	}	

	static async getDishById(dishId) {
		let response = await axios.get(`${path}/dishes/${dishId}`);
		return response.data;
	}	

	static async editDish(input) {
		let response = await axios.put(`${path}/dishes/${input.id}`, input);
		return response.data;
	}	

	static async createDish(input) {
		let response = await axios.post(`${path}/dishes`, input);
		return response.data;
	}

	static async deleteDish(dishId) {
		let response = await axios.delete(`${path}/dishes/${dishId}`);
		return response.data;
	}

}

export default ApiClient;