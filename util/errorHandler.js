exports.fileErrorHandler = (err, req, res, next) => {
  if(err){
   
    if(err.name == 'MulterError') {
      return res.status(400).json({
        message: `Wrong file name, please use 'data' as file name`,
      status: "error",
      data: null,
     })
    }
  }
}
      