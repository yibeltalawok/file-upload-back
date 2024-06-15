var EventEmitter = require('events').EventEmitter;
const Sequelize = require('sequelize');
const fn=Sequelize.fn;
const col=Sequelize.col;
const Op = Sequelize.Op;
const db = require("../models");
const Post = db.posts;
var fileDal = require('../dal/postFile');
const fs = require('fs');
const moment = require('moment');
//Yibeltal try 
// var mysql = require('mysql');
// const moment = require('moment')
// const { post } = require('../routes/posts_routes');

  exports.createPost = (req, res, next) => {
         let workflow = new EventEmitter();
         let file="";
         let x=req.body.file;
        if(x == 'null'){
           file=''
           }
          else {
             file=req.files[0].filename  
              }
         let fileData={ title:req.body.title,
                        description:req.body.description,
                        file:file
                       }
         workflow.on('validateData', (fileData) => {
          if (!fileData.title || !fileData.description) {
          return res.status(400).json({ message: 'እባክዎ የፋይሉን ስም ያስገቡ' });
             }
          else
           {
         workflow.emit('createFile',fileData);
            }});
         workflow.on('createFile', (fileData) => {
         fileDal.create(fileData, (err, file) => {
          if (err) {
            console.log("data is : files")
            return res.status(500).json({
            message: 'ሰርቨሩ እየሰራ አይደለም yes',
              });}
         workflow.emit('respond', file);
             });
           });
         workflow.on('respond', (file) => {
           res.status(200).json(file);
           });
        workflow.emit('validateData', fileData);
         };     

     exports.findAll=(req,res)=>{
       let workflow = new EventEmitter();
      //  let key = new Date('2023-08-17 14:00:43')
      //  console.log("key",key)
       //new Date(req.query.key)
       let searchQuery ={
        order:[['updatedAt','DESC']]
      }
      // let searchQuery1={where:{createdAt:{[Op.eq]:key}}}
      //console.log("query",key)
       workflow.on('fetchAllFiles', () => {
       fileDal.getCollection(searchQuery,(err, files) => {
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
    // exports.findAll=(req,res)=>{
    //     pool.getConnection((err, connection) => {
    //        if(err) throw err
    //        var quryData=`SELECT id,title,description,file,createdAt,Month(createdAt) As "Month" ,Day(createdAt) As "Day",
    //        Year(createdAt) As "Year" from posts ORDER BY updatedAt DESC`         
    //          connection.query(quryData,(err, rows) => { // return the connection to pool
    //       if (!err) {
    //       res.send(rows)
    //       } else {
    //       console.log(err)
    //         }
    //       if(err) throw err
    //          console.log('Single data from eplusAppfile table are: \n', rows)
    //       })});}  

          // exports.findOne=(req,res)=>{
          //   pool.getConnection((err, connection) => {
          //      if(err) throw err
          //      connection.query('SELECT * FROM posts WHERE id = ?', [req.params.id], (err, rows) => {
          //      connection.release() 
          //       if (!err) {
          //         res.send(rows)
          //         console.log(rows)
          //        }else {
          //           console.log(err)
          //       }
          //       // console.log('Single data from blog table are: \n', rows)
          //   })});} 


           exports.fetchOne = (req, res) => {
            // console.log("yibe")
            const id = req.params.id;
            // console.log("id==",id)
            Post.findByPk(id)
                .then(data => {
                  if (data) {
                    res.send(data);
                   } 
                  else {
                    res.status(404).send({
                      message: `Cannot find Post with id=${id}.`
                    });
                  }
                })
                .catch(err => {
                  res.status(500).send({
                    message: "Error retrieving Post with id=" + id
                  });});};

            exports.update = (req, res) => {
               let id = req.params.id;
              
               let file="";
               let x=req.body.file;
              if(x == 'null'){
                let y=req.body.fileData
                 file=y
                 }
                else {
                   file=req.files[0].filename
                   Post.findByPk(id)
                   .then(data => {
                    if(data.file!=="")
                  fs.unlinkSync(`images/${data.file}`);
                         })   
                       }

              //  console.log("file=",file)
               //req.files[0].filename || req.body.fileData

              let fileData={ title:req.body.title,
                description:req.body.description,
                file:file 
               }
              //  console.log(fileData.file)

              Post.update(fileData, {
                where: { id: id }
              })
                .then(num => {
                  if (num == 1) {
                    res.send({
                      message: "Post was updated successfully."
                    });} 
                  else {
                    res.send({
                      message: `Cannot update Post with id=${id}. Maybe Blog was not found or req.body is empty!`
                    });}})
                .catch(err => {
                  res.status(500).send({
                    message: "Error updating Blog with id=" + id
                  }); });};
            // exports.remove = (req, res) => {
            //   const id = req.params.id;
            //      console.log(id)
            //     Post.destroy({
            //     where: { id: id }
            //   })
            //     .then(num => {
            //       if (num == 1) {
            //         console.log("posts was deleted successfully!")
            //       } else {
            //         res.send({
            //           message: `Cannot delete post with id=${id}. Maybe post was not found!`
            //         });}
            //       })
            //     .catch(err => {
            //       res.status(500).send({
            //         message: "Could not delete Blog with id=" + id
            //       });
            //     });
            // };


            exports.remove=(req, res) => {
              // console.log("id =",req.params.id)
             const id=req.params.id;
             if(!req.params.folder && !id){
              console.log("please not found")
             }
                Post.findByPk(id)
                .then(data => {
               // console.log(data.file)
                    if(data.file!=="")
                    fs.unlinkSync(`images/${data.file}`);
                    fileDal.delete({id })
                      .then(num => {
                        if (num == 1) {
                          res.send({
                           message: "file was deleted successfully!"
                        });
                      } else {
                        res.send({
                          message: `Cannot delete file with id=${id}. Maybe file was not found!`
                        });
                      }
                    })
                    .catch(err => {
                      res.status(500).send({
                        message: "Could not delete file with id=" + id
                      });
                     });
                  })};
            exports.findByDate=async(req,res)=>{
                    try {
                      const { year } = req.query;
                      const { month } = req.query;
                      const { day } = req.query;
                      const date = new Date();
                      date.setMonth(month - 1); // Subtract 1 from month to match JavaScript's zero-based index
                      date.setFullYear(year - 1); // Subtract 1 from month to match JavaScript's zero-based index
                      date.setDate(day - 1); // Subtract 1 from month to match JavaScript's zero-based index
  
                      console.log(date.getFullYear()+1 ,parseFloat(month),date.getDate() + 1)
                              const searchResults = await Post.findAll({
                                where: {
                                  [Op.and]: [
                                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('createdAt')), date.getFullYear()+1),
                                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('createdAt')), date.getMonth()+1),
                                    Sequelize.where(Sequelize.fn('DAY', Sequelize.col('createdAt')), date.getDate() + 1)
                                  ]
                                }
                              });
                      // console.log(searchResults)
                      res.json(searchResults);
                    } catch (error) {
                      console.error(error);
                      res.status(500).json({ error: 'An error occurred while searching.' });
                    }
                  };
              exports.findByMonth=async(req,res)=>{
                  try {
                    const { year } = req.query;
                    const { month } = req.query;
                    const date = new Date();
                    date.setMonth(month - 1); // Subtract 1 from month to match JavaScript's zero-based index
                    date.setFullYear(year - 1); // Subtract 1 from month to match JavaScript's zero-based index

                            const searchResults = await Post.findAll({
                              where: {
                                [Op.and]: [
                                  Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('createdAt')), date.getFullYear()+1),
                                  Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('createdAt')), date.getMonth()+1),
                                ]
                              }
                            });
                    // console.log(searchResults)
                    res.json(searchResults);
                  } catch (error) {
                    console.error(error);
                    res.status(500).json({ error: 'An error occurred while searching.' });
                  }
                };
             exports.findByYear=async(req,res)=>{
                  try {
                    const { year } = req.query;
                    const date = new Date();
                    date.setFullYear(year - 1); // Subtract 1 from month to match JavaScript's zero-based index
                            const searchResults = await Post.findAll({
                              where: {
                                [Op.and]: [
                                  Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('createdAt')), date.getFullYear()+1),
                                ]
                              }
                            });
                    // console.log(searchResults)
                    res.json(searchResults);
                  } catch (error) {
                    console.error(error);
                    res.status(500).json({ error: 'An error occurred while searching.' });
                  }
                };