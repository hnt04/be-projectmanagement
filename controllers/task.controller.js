const mongoose = require('mongoose');
const { sendResponse, AppError}=require("../helpers/utils.js");
const Task = require('../models/Task.js');
const User = require('../models/User.js');
const taskController = {};

taskController.createTasks = async (req, res, next) => {
	try {
        const {task_name, task_description,assigneeId,status,assignerId} = req.body;

        if(!task_name || !task_description) throw new Error(402,"Bad Request","Create Task Error");

        const assigner = await User.findById(assignerId);
        
        // if(!assigner) throw new Error(404,"User Not Found","Create Task Error") 
        
		if(assigner.position !== "assigner"){
            const exception = new AppError(`You are not a manager`);
                exception.statusCode = 404;
                throw exception;
        }
			const tasks = await Task.create({
                task_name,
                task_description,
                assigner: assignerId,
                assigneeId,
                status
            })
			sendResponse(res,200,true,tasks,null,"Create Task Success")
		} catch (err) {
		next(err)
	}
};

taskController.getTasks = async (req, res, next) => {
	const allowedFilter = ["task_name","assigner","assignee","task_description","status"];
    try{
        // const filterPage = ;
        let { page, limit, ...filterQuery } = req.query;
        page = parseInt(page) || 1
        limit = parseInt(limit) || 10  

        const filterKeys = Object.keys(filterQuery);

        filterKeys.forEach((key) => {
          if (!allowedFilter.includes(key)) {
            const exception = new Error(`Query ${key} is not allowed`);
            exception.statusCode = 401;
            throw exception;
          }
          if (!filterQuery[key]) delete filterQuery[key];
        });

        let tasks = await Task.find(filterQuery)

        const totalPage = Math.ceil(tasks.length/limit);
          const offset = (page - 1)*limit;
  
          tasks = tasks.slice(offset, offset + limit);
        
        sendResponse(res,200,true,tasks,null,"Filter list of tasks success")
    } catch(err) {
        next(err)
    }
};

taskController.getSingleTask = async (req, res, next) => {
    
	try {
        const { id } = req.params;
        const tasks = await Task.findById(id);

		if (!tasks){
            const exception = new Error(`Task not found`);
                exception.statusCode = 404;
                throw exception;
        }

            sendResponse(res,200,true,tasks,null,"Get task success")
	} catch (err) {
		next(err)
	};
}

taskController.editTasks = async (req, res, next) => {
	const { id } = req.params;
    const {task_name,assigner,assignee,task_description,status} = req.body;

    const options = { new:true }
    try{
        if(!assigner.position=== "assigner") {
            const exception = new Error(`You are not a manager`);
            exception.statusCode = 404;
            throw exception;
        }

        const updated= await Task.findByIdAndUpdate(id,
            {task_name,assignee,task_description,status},
            options)

        sendResponse(res,200,true,updated,null,"Update task success")       
    } catch(err) {
        next(err)
    }
}

taskController.deleteTasks = async (req, res, next) => {
    const { id } = req.params
    const assigner = req.body;
    const options = {new:true}
	try {
		if(!assigner.position === "assigner"  ) {
            const exception = new Error(`You are not a manager`);
                exception.statusCode = 404;
                throw exception;
        }
        const updated= await Task.findByIdAndDelete(id,options)

        sendResponse(res,200,true,updated,null,"Delete user success")    
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
        sendResponse(res,200,true,found,null,"Add reference success")
    } catch(err) {
        next(err)
    }
}

module.exports = taskController;
