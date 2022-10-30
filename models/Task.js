const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema(
	{
		task_name: {
			type: String,
			required: true,
		},
		assignee: [{
			type: mongoose.SchemaTypes.ObjectId, ref: "User"
		}],
		assigner: {
			type: mongoose.SchemaTypes.ObjectId, ref: "User"
		},
		// assignee: {
		// 	type: mongoose.SchemaTypes.ObjectId, ref: "User"
		// },
		description: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ['PENDING', 'WORKING', 'REVIEW', 'DONE','ACHIEVE'],
			required: true,
			default: "PENDING",
		},
		createAt: {
			type: Date,
			require: true,
			default: Date.now(),
		},
		updateAt: {
			type: Date,
			require: true,
		}
	},
	{
		timestamps: true,
	}
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;