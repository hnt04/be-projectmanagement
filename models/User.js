const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		position: {
			type: String,
            enum: ['manager', 'employee'],
			required: true,
			default: "employee"
		},
        tasks: [{type: mongoose.SchemaTypes.ObjectId, ref: "Task"}]
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model('User', userSchema);

module.exports = User;