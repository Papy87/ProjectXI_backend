const multer = require('multer');
const moment = require('moment')

// const uuidv5=require('uuid/v5');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname==='image_url') {
            cb(null, "./post/image_post")
        }
            if(file.fieldname==='video_url'){
                cb(null, "./post/video_post")
            }
    },
    filename: function (req, file, cb) {
        let date = moment();
        let filename = date + ' - ' + file.originalname;
        cb(null, filename);
    },
    limits: {
        fileSize: 1024 * 1024 * 5
    }
})
const upload = multer({
    storage: storage
});


module.exports = upload;
