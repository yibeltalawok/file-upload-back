var express = require('express');
var router = express.Router();
var userController = require('../controller/user');

// ROUTES 
router.post("/post", userController.createUser);
// router.get('/getData',PostController.findAll);
// router.get("/searchByDate", PostController.findByDate);
// router.get("/searchByMonth", PostController.findByMonth);
// router.get("/searchByYear", PostController.findByYear);

// router.get("/:id", PostController.fetchOne);
// router.delete('/:id',PostController.remove);
// router.put("/:id", upload.array("file"), PostController.update);
// Expose User Router
module.exports = router;



