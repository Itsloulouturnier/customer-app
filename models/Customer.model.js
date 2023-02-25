const { Schema, model } = require("mongoose");

const customerSchema = new Schema(
	{
firstname: String,
lastname: String,
location: {
	type: String,
	enum: [
		`Port-au-Prince`,
		`Carrefour`,
		`Cité Soleil`,
		`Delmas`,
		`Gressier`,
		`Kenscoff`,
		`Pétion-Ville`,
		`Tabarre`,
		]
},
balance: Number,
loyaltypoints: Number,
whatsappnumber: String,
transactions: {
    type: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
},
	},
	{
		// this second object adds extra properties: `createdAt` and `updatedAt`
		timestamps: true,
	}
);

const Customer = model("Customer", customerSchema);

module.exports = Customer;