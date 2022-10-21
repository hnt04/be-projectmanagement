const mongoose = require('mongoose');
const { sendResponse, AppError}=require("../helpers/utils.js");
const Task = require('../models/Task.js');
const User = require('../models/User.js');
const taskController = {};

taskController.createTasks = async (req, res, next) => {
    const {task_name, task_description,assignerId,assigneeId} = req.body;

	try {
        if(!task_name || !task_description) throw new AppError(402,"Bad Request","Create Task Error");

        const assigner = await User.findUserById(assignerId);
        if(!assigner) throw new AppError(404,"User Not Found","Create Task Error") 

		if(assigner.position === "assigner"){
			const task = await Task.create({
                task_name,
                task_description,
                assignerId,
                assigneeId
            })
			sendResponse(res,200,true,task,null,"Create Task Success")
		} else {
			const exception = new Error(`You are not a manager`);
                exception.statusCode = 404;
                throw exception;
		}
		} catch (err) {
		next(err)
	}
};

taskController.getTasks = async (req, res, next) => {
	const filter = {}
    try{
        const filterList= await Task.find(filter)
        sendResponse(res,200,true,{data:filterList},null,"Filter list of users success")
    } catch(err) {
        next(err)
    }
};

taskController.getSingleTask = async (req, res, next) => {
	try {
		
	} catch (err) {
		
	}
};

taskController.editTasks = async (req, res, next) => {
	const targetId = null
    const updateInfo = ""

    const options = { new:true }
    try{
            const updated= await User.findByIdAndUpdate(targetId,updateInfo,options)

        sendResponse(res,200,true,{data:updated},null,"Update task success")       
    } catch(err) {
        next(err)
    }
}

taskController.deleteTasks = async (req, res, next) => {
	const targetId = null
    const options = {new:true}
	try {
		if(position === "assigner"  ) {
            const updated= await Foo.findByIdAndDelete(targetId,options)

        sendResponse(res,200,true,{data:updated},null,"Delete user success")
        } else {
            const exception = new Error(`You are not a manager`);
                exception.statusCode = 404;
                throw exception;
        }        
    } catch(err){
        next(err)
    }
};

taskController.addReference = async(req,res,next)=>{
   const {targetName}= req.params
   const {ref} = req.body
    try{
        let found = await Task.findOne({task_name:targetName})
        const refFound = await User.findById(ref)
        found.assigner=ref
        found = await found.save()
        sendResponse(res,200,true,{data:found},null,"Add reference success")
    } catch(err) {
        next(err)
    }
}

module.exports = taskController;
