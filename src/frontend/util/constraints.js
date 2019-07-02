import { map } from "lodash";

const DISH_TYPES = [ "salad", "pasta", "pizza", "dessert", "drink"];
const DISH_TYPES_OPTIONS = map(DISH_TYPES, (dishType, key) => {
	return { key, text: dishType, value: dishType };
});

const ORDER_STATUS_OPTIONS = [
	{
		key: 0,
		text: 'Sent',
		value: 0,
	},
	{
		key: 1,
		text: 'In process of cooking',
		value: 1,
	},
	{
		key: 2,
		text: 'Coming',
		value: 2,
	},
];


const ORDER_STATUS = [ 'Sent', 'In process of cooking', 'Coming', 'Completed' ];


const ROLES = [ "admin", "personel", "caterer" ];
const ROLES_OPTIONS = map(ROLES, (role, key) => {
	return { key, text: role, value: role };
});

const GENDER_OPTIONS = [
 { key: 1, text: "female", value: "female" },
 { key: 2, text: "male", value: "male" },
];

export { DISH_TYPES, DISH_TYPES_OPTIONS, ORDER_STATUS_OPTIONS, ORDER_STATUS, ROLES, ROLES_OPTIONS, GENDER_OPTIONS };