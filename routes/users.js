var express = require('express');
var multer = require('multer');
var upload = multer({dest:'./uploads'});
var router = express.Router();
var User = require('../models/user');
var app = express();

//Handle file uploads
//app.use(upload.single('file'));




/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {
    'title':'Register'
  });
});//this will go to users/register

router.get('/login', function(req, res, next) {
  res.render('login', {
    'title':'Login'
  });
});//this will go to users/login

//create post request through the Register page
router.post('/register', upload.single('profileimage'), function(req,res,next) {
  //Get Form Values
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  //check for image field
  if(req.file) {
      console.log('uploading file...');
      //gather all file info
      var profileImageOriginalName = req.files.profileimage.originalname;
      var profileImageName = req.files.profileimage.name;
      var profileImageMime = req.files.profileimage.mimetype;
      var profileImagePath = req.files.profileimage.path;
      var profileImageExt = req.files.profileimage.extension;
      var profileImageSize = req.files.profileimage.size;

  } else {
    //set a Default Image

    var profileImageName = 'noimage.png';
  }


  //form validation
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email not valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Password do not match').equals(req.body.password);

  //Check for errors
  var errors = req.validationErrors();

  if(errors) {
    res.render('register', {
      errors: errors,
      name: name,
      email: email,
      username: username,
      password: password,
      password2: password2
    });
  }else{
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: profileImageName
    });

    //Create user
    User.createUser(newUser, function (err, user) {
      if(err) throw err;
      console.log(user);
    });

    //Success message
    req.flash('success', 'You are now registered and may log in');

    res.location('/');
    res.redirect('/');
  }
});

module.exports = router;
