const multer = require('multer');
const moment = require('moment');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
  //  console.log("file type",file.mimetype.split('/')[0])
    var ext = path.extname(file.originalname);
    if (
      (ext && ext === '.jpeg') ||
      ext === '.jpg' ||
      ext === '.png' ||
      ext === '.gif'
    ) {
      cb(null, 'images');
    }
     else {
      return cb(
        new Error(
          'ያልተፈቀደ ፍይል ፎርማት አስገብተዋል  የተፈከዱ (.png,.jpeg,.jpg,.gif) ብቻ ናቸው'
        ));}},
//nameing the image
  filename: (req, file, cb) => {
    var ext = path.extname(file.originalname);
    if (
      (ext && ext === '.jpeg') ||
      ext === '.jpg' ||
      ext === '.png' ||
      ext === '.gif'
    ) 
    {
   cb(null,'image' + '-' + Date.now() +'-'+ file.originalname);
    } else {
      return cb(
        new Error(
          'በድጋሜ ትክክለኛውን አይነት በማስገባት ይሞክሩ'
        )
      );
    }    
  },
});

exports.upload = multer({
  storage: storage,
});