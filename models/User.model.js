const { Schema, model } = require("mongoose");

const userSchema = new Schema(
	{
		username: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
		},
		role: {
			type: String,
			enum: ["admin", "member"],
		},
	},
	{
		// this second object adds extra properties: `createdAt` and `updatedAt`
		timestamps: true,
	}
);

const User = model("User", userSchema);

module.exports = User;