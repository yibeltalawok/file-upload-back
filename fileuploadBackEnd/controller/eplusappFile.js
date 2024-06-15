var EventEmitter = require('events').EventEmitter;
const Sequelize = require('sequelize');
var fileDal = require('../dal/eplusappFile');
const Op = Sequelize.Op;
const db = require("../models");
const EplusappData = db.eplusappfile;
const fs = require('fs');
      //upload file
 exports.create = async(req, res) => {
    if (!req.files) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
        return;
      }
        let Blog =[]
        for(let i=0;i<req.files.length;i++){
          Blog.push({name:req.files[i].filename,type:req.files[i].mimetype.split('/')[0]})
                }
        // fileDal.create(Blog)
        fileDal.create(Blog, (err, file) => {
          if (err) {
            return res.status(500).json({
              message: 'ሰርቨሩ እየሰራ አይደለም',
            });}
            })
        .then((data,res) => {          
            res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Blog."
          });
        });
      }      
  

   exports.fetchOne = (req, res, next) => {
    let workflow = new EventEmitter();
    var { id } = req.params;
    workflow.on('fetchFile', () => {
      fileDal.getByPk(id, (err, file) => {
        if (err) {
          return res.status(500).json({
            message: 'ሰርቨሩ እየሰራ አይደለም',
          });
        }
        if (file || file !== undefined) {
          workflow.emit('respond', file);
          } 
        else {
          return res.status(400).json({
            message: 'በዚህ መለያ የተመዘገበ file የለም',
          });
        }
      });
    });
    workflow.on('respond', (files) => {
      res.status(200).json(files);
    });
    workflow.emit('fetchFile');
  };

exports.fetchAll = (req, res, next) => {
  let workflow = new EventEmitter();
  //  let searchQuery={where:{type:{[Op.eq]:'image'}}}

  workflow.on('fetchAllFiles', () => {

    fileDal.getCollection({}, (err, file) => {
      if (err) {
        return res.status(500).json({
          message: 'ሰርቨሩ እየሰራ አይደለም',
        });
      }
      if (file && file.length > 0) {
        workflow.emit('respond', file);
      } else {
        return res.status(400).json({
          message: 'file is not found'
        });
      }
    });
  });
  workflow.on('respond', (files) => {
    res.status(200).json(files);
  });
  workflow.emit('fetchAllFiles');
};

 exports.remove = (req, res, next) => {
  //  console.log("id =",req.params.id,", folder = ",req.params.folder)
   const id=req.params.id;
   if(!req.params.folder && !id){
   console.log("please not found")
     }
     EplusappData.findByPk(id)
     .then(data => {
      //remove file from folder
         if(data.name!=="")
         fs.unlinkSync(`${req.params.folder}/${data.name}`);
      //remove file name from database table
        fileDal.delete(id)
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
   
      }
      )};
// exports.createFile = (req, res, next) => {
//   let workflow = new EventEmitter();
//     // console.log(req.file)
//   let fileData=req.body;
//   // console.log("data : ", fileData);
//   workflow.on('validateData', (fileData) => {
//     if (!fileData.name) {
//       return res.status(400).json({ message: 'እባክዎ የፋይሉን ስም ያስገቡ' });
//     }
//     else
//     {
//     workflow.emit('createFile',fileData);
//      }});
//   workflow.on('createFile', (fileData) => {       
//     fileDal.create(fileData, (err, file) => {
//       if (err) {
//         console.log("data is : files")
//         return res.status(500).json({
//           message: 'ሰርቨሩ እየሰራ አይደለም',
//         });}
        
//       workflow.emit('respond', file);
//     });
//   });
//   workflow.on('respond', (file) => {
      
//     res.status(200).json(file);

//   });
//   workflow.emit('validateData', fileData);
//    };

// exports.remove = (req, res, next) => {
//   var workflow = new EventEmitter();

//   workflow.on('findFile', () => {
//     fileDal.getByPk(req.params.id, (err, file) => {
//       if (err) {
//         return res.satus(500).json({
//           message: 'ሰርቨሩ እየሰራ አይደለም',
//         });
//       }
//       if (!file) {
//         return res.status(400).json({
//           message: 'በዚህ መለያ የተመዘገበ ድርጅት የለም',
//         });
//       }

//       workflow.emit('deleteFile', file);
//     });
//   });

//   workflow.on('deleteFile', (file) => {
//     fileDal.delete(file.id, (err, deletedFile) => {
//       if (err) {
//         return res.status(500).json({
//           message: 'ሰርቨሩ እየሰራ አይደለም',
//         });
//       }

//       if (deletedFile) {
//         workflow.emit('respond', deletedFile);
//       } else {
//         return res.status(400).json({ message: 'በዚህ መለያ የተመዘገበ file የለም የለም' });
//       }
//     });
//   });

//   workflow.on('respond', (file) => {
//     return res
//       .status(200)
//       .json({ message: `በዚህ መለያ${file.id} የተመዘገበ file ጠፍቶል` });
//   });

//   workflow.emit('findFile');
// };

// exports.fetchAllByPagination = (req, res, next) => {
//   let workflow = new EventEmitter();

//   let page = req.query.page || 1;
//   let limit = req.query.per_page || 5;

//   var opts = {
//     page: page,
//     limit: limit,
//     sort: { createdAt: -1 },
//   };
//   var fileQuery = {};

//   if (req.query.key && req.query.key !== '') {
//     let filterKey = String(req.query.key).toLowerCase();
//     fileQuery['$or'] = [
//       { name: { $regex: filterKey, $options: 'i' } },
//       { code: { $regex: filterKey, $options: 'i' } },
//       { type: { $regex: filterKey, $options: 'i' } },
//     ];
//   }

//   workflow.on('getFiles', (fileQuery) => {
//     fileDal.getByPagination(fileQuery, opts, (err, files) => {
//       if (err) {
//         return res.status(500).json({
//           message: 'ሰርቨሩ እየሰራ አይደለም',
//         });
//       }
//       workflow.emit('respond', files);
//     });
//   });
//   workflow.on('respond', (files) => {
//     res.status(200).json(files);
//   });

//   workflow.emit('getFiles', fileQuery);
// };
exports.search = (req, res, next) => {
  let workflow = new EventEmitter();

  let page = req.query.page || 1;
  let limit = req.query.per_page || 10;
  var opts = {
    page: page,
    limit: limit,
    sort: { createdAt: -1 },
  };
  workflow.on('prepareSearchQuery', () => {
    if (req.query.key && req.query.key !== '') {
      let searchKey = String(req.query.key).toLowerCase();
      workflow.emit('searchFiles', searchKey);
    } 
    else {
      res.status(400).json({ message: 'መፈለጊያ ቃል አላስገቡም' });
      return;
    }
  });
  workflow.on('searchFiles', (searchKey) => {
    fileDal.search(searchKey, opts, (err, files) => {
      if (err) {
        res.status(500).json({
          message: 'ሰርቨሩ እየሰራ አይደለም',
        });
        return;
      }
      workflow.emit('respond', files);
    });
  });

  workflow.on('respond', (files) => {
    res.status(200).json(files);
    return;
  });
  workflow.emit('prepareSearchQuery');
};
