/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const ms = require('ms');

// Schema for the Shop
const ShopSchema = new mongoose.Schema({
	itemID: { type: String, indexes: true },
	itemName: String,
	itemAmount: Number,
	itemPrice: Number,
	itemPriceTwo: Number,
	itemPriceThree: Number,
	itemType: String,
	itemTypeTwo: String,
	itemTypeThree: String,
	category: String,
	itemDescription: String,
	scoreRequired: String,
}, {
	timestamps: { currentTime: () => Date.now() },
});
module.exports = mongoose.model('Shop', ShopSchema);