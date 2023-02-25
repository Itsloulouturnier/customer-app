const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
	{
transactiondate: Date,
quantitypurchased: Number,
item: {
	itemDescription: String,
	class: String,
	enum: [`Fashion`,`Hygiene`, `Foodstuff (Dry)` , `Fish Meat & Poultry` , `Foodstuff (Refrigerated)`, `Sweets`, `Misc`],
},
	},
	{
		// this second object adds extra properties: `createdAt` and `updatedAt`
		timestamps: true,
	}
);

const Transaction = model("Transaction", transactionSchema);

module.exports = Transaction;