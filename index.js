const express = require('express')
const app = express()
const multer = require('multer')
const fs = require('fs')
var mime = require('mime');

// const fileFilter = function(req, file, cb) {
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    
//     if (!allowedTypes.includes(file.mimetype)) {
//         const error = new Error('Wrong file type');
//         error.code = 'LIMIT_FILE_TYPES'
//         return cb(error, false)
//     }
//     cb(null, true)
// }

// const MAX_SIZE = 200000
let dir_save = 'drops'
const storageConfig = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(dir_save);
      cb(null, dir_save)
    },
    filename: function (req, file, cb) {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
        cb(null, file.originalname)
    }
  })
app.use(multer({storage:storageConfig}).array("files"));

// app.use(multer({storage:storageConfig}).none("file_to_del"));

// const upload = multer({
//     dest: './uploads',
//     fileFilter,
//     limits: {
//         fileSize: MAX_SIZE
//     }

// })
// const pureUpload = multer({
//     // dest: './drops'
//     storage: storage
// })
app.post('/dropzone', function (req, res, next) {
    res.json({ file: req.files })
    
})
///////////WORKED
app.post('/changeDir', function (req, res, next) {
    dir_save = req.body.path_dir
    if (!fs.existsSync(dir_save)){
        fs.mkdirSync(dir_save, { recursive: true });
    }
    res.json({ status: 'ok' })
    
})
/////////////
/////////////WORKED
app.post('/get_files', function (req, res) {
    let files_from_dir = fs.readdirSync(req.body.file_path)
    console.log(req.body.file_path);
    let files_arr = []
    for (var i in files_from_dir){
        var name =  files_from_dir[i]
        let type = mime.getType(req.body.file_path + '/' + name)
        files_arr.push({name, type})
    }
    res.json({files: files_arr})
/////////////////////
})
// app.post('/upload', upload.single('file_name1'), (req,res) => {
//     res.json({ file: req.file })
// })

// app.post('/multiple', upload.array('files'), (req,res) => {
//     res.json({ file: req.files })
// })
////////////// WORKED
app.post('/deleteFile', function (req, res, next) {
    // res.json({ file: req.file })
    console.log(req.body.file_name_to_del + ' is now in deleting process');
    fs.stat(`${req.body.file_folder_to_del}/${req.body.file_name_to_del}`, function (err, stats) {
        // console.log(stats);
        if (err) return console.log(err);
        
        fs.unlink(`${req.body.file_folder_to_del}/${req.body.file_name_to_del}`, function (err) {
            if (err) return console.log(err);
            console.log('File deleted');
        })
    })
    res.json({status: 'ok'})
})
//////////////////////
// app.use(function(err, req, res, next)  {
//     if (err.code === 'LIMIT_FILE_TYPES') {
//         res.status(422).json({error: 'Only images are allowed'})
//         return
//     }
//     if (err.code === 'LIMIT_FILE_SIZE') {
//         res.status(422).json({error: `Too large. Max size is ${MAX_SIZE/1000} kb`})
//         return
//     }
// })

app.listen(3344, () => console.log('Server is started'))