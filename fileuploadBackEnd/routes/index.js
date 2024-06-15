
const eplusappRouter = require('./eplusappFile_routes');
const fileuploadRouter =require('./fileupload_routes');
const posts_routes =require('./posts_routes');
const user =require('./user');
const account_routes =require('./account_routes');
const likes =require('./likes');
module.exports = (app) => { 
  app.use('/fileupload-api/files', fileuploadRouter);
  app.use('/fileupload-api/eplusapp',eplusappRouter);
  app.use('/fileupload-api/posts',posts_routes);
  app.use('/fileupload-api/account',account_routes);
  app.use('/fileupload-api/like',likes);
  app.use('/fileupload-api/user',user);
};
