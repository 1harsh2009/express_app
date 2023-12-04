const multer = require('multer');
const { v4:uuidv4 } = require('uuid');
const path = require("path")


const storage = multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null,"./uploads/")
    },
    filename: function(req,file,cb){
        const uniqueName = uuidv4()
        cb(null,uniqueName+path.extname(file.originalname))
    }
});
const upload2 = multer({storage:storage})

module.exports = upload2