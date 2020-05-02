const multer = require('multer');
const moment = require('moment')

// const uuidv5=require('uuid/v5');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./images")

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
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype == 'image/png') {
            cb(null, true)
        } else {
            console.log('Only .jpg and .png images allowed.')
            cb(null, false)
        }
    }
});


module.exports = upload;
