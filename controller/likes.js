var EventEmitter = require('events').EventEmitter;
var likeDal = require('../dal/likes');
const Sequelize = require('sequelize');
const fn=Sequelize.fn;
const col=Sequelize.col;
const Op = Sequelize.Op;
const db = require("../models");
const likes = db.likes;
var fileDal = require('../dal/likes');
const fs = require('fs');
const moment = require('moment');
    exports.update = (req, res, next) => {
    let id = req.params.id;
    console.log("aa=",id)
    let likeData={ likes:req.body.likes,
                   views:req.body.views
                 }
   likes.update(likeData, {
     where: { id: id }
   })
     .then(num => {
       if (num == 1) {
         res.send({
           message: "like was updated successfully."
         });} 
       else {
         res.send({
           message: `Cannot update like with id=${id}. Maybe Blog was not found or req.body is empty!`
         });}})
     .catch(err => {
       res.status(500).send({
         message: "Error updating like with id=" + id
       }); });};

       exports.findAll=(req,res)=>{
        let workflow = new EventEmitter();
        workflow.on('fetchAllFiles', () => {
        fileDal.getCollection((err, files) => {
         // console.log("files",err)
               if (err) {
                 return res.status(500).json({
                   message: 'ሰርቨሩ እየሰራ አይደለም',
                 });
               }
               if (files && files.length > 0) {
                 workflow.emit('respond', files);
               } else {
                 return res.status(200).json([]
                   ///message: 'file is not found'
                 );
               }
             });
           });
           workflow.on('respond', (files) => {
             res.status(200).json(files);
           });
           workflow.emit('fetchAllFiles');
         }
