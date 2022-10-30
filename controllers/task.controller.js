const mongoose = require('mongoose');
const { sendResponse, AppError}=require("../helpers/utils.js");
const Task = require('../models/Task.js');
const User = require('../models/User.js');
const taskController = {};

taskController.createTasks = async (req, res, next) => {
	try {
        // const assignerId = req.headers.authorization;
        const {task_name, description,assigner,assignee,status} = req.body;

        if(!task_name || !description || !assignee || !assigner ) throw new AppError(402,"Bad Request","Create Task Error");

        // const userId = req.params.id;
        
        const userData = await User.findOne({assignee});
        // const assigner = await User.findById(assignerId);
        
        if(!userData) throw new Error(404,"User Not Found","Create Task Error") 
        
		// if(assigner.position !== "manager"){
        //     const exception = new Error(`You are not a manager`);
        //         exception.statusCode = 404;
        //         throw exception;
        // }
			const tasks = await Task.create({
                task_name,
                assignee: assignee,
                assigner,
                description,
                // assigner: assignerId,
                status,
            });

            await User.findByIdAndUpdate(
               assignee
            , {
                $push: {tasks: tasks._id}
            }
            )
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
            const exception = new AppError(`Query ${key} is not allowed`);
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
            const exception = new AppError(`Task not found`);
                exception.statusCode = 404;
                throw exception;
        }

            sendResponse(res,200,true,tasks,null,"Get task success")
	} catch (err) {
		next(err)
	};
}

taskController.editTasks = async (req, res, next) => {

    try{
        const {id} = req.params;
        const {task_name,assigner,assignee,task_description,status} = req.body;
    
        const options = { new:true }
        // const otherTask = await Task.findById(taskId)

        // if(!otherTask) {
        //     const exception = new AppError(`Task not found`);
        //     exception.statusCode = 404;
        //     throw exception;
        // }

        // const user = await User.findById(userId);

        // if(assigner.position !== "assigner") {
        //     const exception = new AppError(`You are not a manager`);
        //     exception.statusCode = 404;
        //     throw exception;
        // }


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
            const exception = new AppError(`You are not a manager`);
                exception.statusCode = 404;
                throw exception;
        }
        const updated= await Task.findByIdAndDelete(id,options)

        sendResponse(res,200,true,updated,null,"Delete user success")    
    } catch(err){
        next(err)
    }
};

module.exports = taskController;
