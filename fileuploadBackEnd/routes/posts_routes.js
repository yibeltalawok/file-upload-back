var express = require('express');
var router = express.Router();
var PostController = require('../controller/posts');
const {upload} = require("../lib/postFileUpload.js");
// const {authenticateUser} =require("../middleware/authentication")

// ROUTES 
router.post("/postData", upload.array("file"), PostController.createPost);
router.get('/getData',PostController.findAll);
router.get("/searchByDate", PostController.findByDate);
router.get("/searchByMonth", PostController.findByMonth);
router.get("/searchByYear", PostController.findByYear);

router.get("/:id", PostController.fetchOne);
router.delete('/:id',PostController.remove);
router.put("/:id", upload.array("file"), PostController.update);
// Expose User Router
module.exports = router;



