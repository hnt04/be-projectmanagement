const mongoose = require('mongoose');
const { sendResponse, AppError}=require("../helpers/utils.js");
const User = require('../models/User.js');
const usersController = {};

usersController.createUsers = async (req, res, next) => {
    const {name,position,task} = req.body;

	try {
        if(!name) throw new AppError(402,"Bad Request","Create User Error")

        if(position === "assigner"){           
            const users = await User.create({
                name,
                position,
                task
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
    const allowedFilter = ["name","position","task"];
    try{
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

        const filterList= await User.find(allowedFilter)

        data = [];

        if (filterKeys.length) {
            filterKeys.forEach((condition) => {
              data = data.length
                ? data.filter((user) => user[condition].includes(filterQuery[condition]))
                : User.filter((user) => user[condition].includes(filterQuery[condition]));
            });
          } else {
            filterList = User;
          }
          const totalPage = Math.ceil(result.length/limit);
          const offset = (page - 1)*limit;
  
          result = result.slice(offset, offset + limit);

        sendResponse(res,200,true,{data:filterList},null,"Filter list of users success")
    } catch(err) {
        next(err)
    }
};

usersController.getSingleUsers = async (req, res, next) => {
	try {
		if(id) {
            
        } else {
            const exception = new Error(`User not found`);
                exception.statusCode = 404;
                throw exception;
        }
	} catch (err) {
		next(err)
	};
}

usersController.editUsers = async (req, res, next) => {
	const targetId = null
    const updateInfo = ""

    const options = { new:true }
    try{
        if(position === "assigner"  ) {
            const updated= await User.findByIdAndUpdate(targetId,updateInfo,options)

        sendResponse(res,200,true,{data:updated},null,"Update user success")
        } else {
            const exception = new Error(`You are not a manager`);
                exception.statusCode = 404;
                throw exception;
        }        
    } catch(err){
        next(err)
    }
}

usersController.deleteUsers = async (req, res, next) => {
    const targetId = null
    const options = {new:true}
	try {
		if(position === "assigner") {
            const updated= await User.findByIdAndDelete(targetId,options)

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

module.exports = usersController;
