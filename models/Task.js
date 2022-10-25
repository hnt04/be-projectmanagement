const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema(
	{
		task_name: {
			type: String,
			required: true,
		},
		position: {
			type: mongoose.SchemaTypes.ObjectId, ref: "User"
		},
		// assigner: {
		// 	type: mongoose.SchemaTypes.ObjectId, ref: "User"
		// },
		// assignee: {
		// 	type: mongoose.SchemaTypes.ObjectId, ref: "User"
		// },
		task_description: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ['PENDING', 'WORKING', 'REVIEW', 'DONE','ACHIEVE'],
			required: true,
			default: "PENDING",
		},
	},
	{
		timestamps: true,
	}
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;