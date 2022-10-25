const mongoose = require('mongoose');
const { sendResponse, AppError}=require("../helpers/utils.js");
const User = require('../models/User.js');
const usersController = {};

usersController.createUsers = async (req, res, next) => {
    const {name_assignee,position_assignee, position_assigner} = req.body;

	try {
        if(!name_assignee) throw new Error(402,"Bad Request","Create User Error")

        if(position_assigner === "assigner"){           
            const users = await User.create({
                name: name_assignee,
                position: position_assignee         
            })
            sendResponse(res,200,true,users,null,"Create User Success")
        } else {
            const exception = new Error(`You are not a manager`);
                exception.statusCode = 404;
                throw exception;
        }
	} catch (err) {
		next(err)
	}
};

usersController.getUsers = async (req, res, next) => {
	// const filter = {name,position,task}

    // const {} = req.body
    const allowedFilter = ["name","position"];
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
        console.log("filterKey",filterKeys)
        console.log("filterQuery",filterQuery)

        let users = await User.find(filterQuery)

          const totalPage = Math.ceil(users.length/limit);
          const offset = (page - 1)*limit;
  
          users = users.slice(offset, offset + limit);

        sendResponse(res,200,true,users,null,"Filter list of users success")
    } catch(err) {
        next(err)
    }
};

usersController.getSingleUsers = async (req, res, next) => {
    const {userId} = req.body;
	try {
        const users = await User.findById(userId);

		if(!users) {
            const exception = new Error("User not found");
            exception.statusCode = 404;
            throw exception;
        } 
        sendResponse(res,200,true,users,null,"Get user success")    

	} catch (err) {
		next(err)
	};
}

usersController.editUsers = async (req, res, next) => {
	const { id } = req.params;
    const {position_assigner,name,position_assignee}= req.body;

    const options = { new:true }

    try{    
        if(!position_assigner === "assigner"  ) {
            const exception = new Error(`You are not a manager`);
            exception.statusCode = 404;
            throw exception;
        }

        const updated = await User.findByIdAndUpdate(id,
                {name,position_assignee},
                options)

        sendResponse(res,200,true,updated,null,"Update user success")

    } catch(err){
        next(err)
    }
}

usersController.deleteUsers = async (req, res, next) => {
    const { id } = req.params
    const position_assigner = req.body;
    const options = {new:true}
	try {
		if(!position_assigner === "assigner") {
            const exception = new Error(`You are not a manager`);
                exception.statusCode = 404;
                throw exception;
        }

        const updated = await User.findByIdAndDelete(id,options)

        sendResponse(res,200,true,{data:updated},null,"Delete user success")

    } catch(err){
        next(err)
    }
};

module.exports = usersController;
