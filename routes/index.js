const fs = require('fs');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  fs.readdir(process.env.PERSISTENT_STORAGE_DIR, function(err, files){
    if (err) return res.sendStatus(500); 
    files.sort(); 
    return res.render('index', {title: "File Drop", files: files}); 
  }); 
});

router.post('/', function(req, res){

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    const newFile = req.files.newFile;
    const uploadPath = process.env.PERSISTENT_STORAGE_DIR + '/' + newFile.name;

    newFile.mv(uploadPath, function(err) {
      if (err) return res.status(500).send(err);
      return res.redirect('/');
    });

}); 

router.get('/:filename', function(req, res, next){
    const filepath = process.env.PERSISTENT_STORAGE_DIR + '/' + req.params.filename; 
    return res.download(filepath); 
}); 

module.exports = router;
