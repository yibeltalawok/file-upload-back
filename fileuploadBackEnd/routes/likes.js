var express = require('express');
var router = express.Router();
var likes = require('../controller/likes');
// router.post('/likes',likes.create);  
router.put("/:id", likes.update);
router.get('/all', likes.findAll);
//  router.get('/:id',likes.fetchOne);
module.exports = router;

