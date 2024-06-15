var express = require('express');
var router = express.Router();
var { upload } = require('../lib/fileUpload');
var eplusappFileController = require('../controller/eplusappFile');
const db = require("../models");
const EplusappData = db.eplusappfile;

router.post('/create',upload.array('name'),eplusappFileController.create);  
     //Download data                  
 router.get('/download', (req, res) => {
   const filename = req.query.filename;
   console.log(filename)
   const pathToSharedDirectory = '';       // build path
   return res.download(pathToSharedDirectory + '/' + filename, (err) => {
     if(err){
      console.log("file is not downlouded")
     }
  });
  });
router.get('/all', eplusappFileController.fetchAll);
router.get('/:id',eplusappFileController.fetchOne);
router.delete('/:folder/:id',eplusappFileController.remove)
// router.get('/paginate', eplusappFileController.fetchAllByPagination);
router.get('/search', eplusappFileController.search);
// router.delete('/:id',eplusappFileController.remove);
module.exports = router;
