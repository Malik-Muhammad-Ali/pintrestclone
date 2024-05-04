var express = require('express');
var router = express.Router();
const passport = require('passport');
const localStategy = require('passport-local');

const userModel = require('../models/userModel');
const postModel = require('../models/postModel');
const upload = require('../routes/multer');

passport.use(new localStategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Profile Route
router.get('/profile', isLoggedIn, async (req, res)=>{
  const user = await userModel.findOne({username: req.user.username}).populate('posts');

  res.render('profile', {user});
});

// Login Get Route
router.get('/login', (req, res)=>{
res.render('login', {error: req.flash('error')});
});

// Feed Route
router.get('/feed', isLoggedIn, async (req, res)=>{
  const posts = await postModel.find().populate('user');
  res.render('feed', {posts});
});

// Uploads Form Route
router.get('/uploads', isLoggedIn, (req, res)=>{
  res.render('uploads');
});

// Register Route
router.post('/register', (req, res)=>{
  const { username, email, fullname, password } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, password)
  .then(function(){
    passport.authenticate('local')(req, res, ()=>{
      res.redirect('/profile');
    })
  });
});

// Login Post Route
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}), (req, res)=>{});

// Upload Post Route
router.post('/upload', isLoggedIn, upload.single('file'), async (req, res, next)=>{
  if(!req.file){
    return res.send('Please select an image to upload');
  }
  
  let user = await userModel.findOne({username: req.user.username});
  let post = new postModel({
    user: user._id,
    posttext: req.body.posttext,
    image: req.file.filename
  });

  user.posts.push(post._id);
  await user.save();
  await post.save();

  res.redirect('/profile');
});

// Logout Route
router.get('/logout', (req, res, next)=>{
  req.logout((err)=>{
    if(err) return next(err);
    res.redirect('/login');
  })
});

// Delete Post Route
router.get('/delete/:id', isLoggedIn, async (req, res)=>{
 const deletedPost = await postModel.findByIdAndDelete(req.params.id);
  const user = await userModel.findOne({username: req.user.username});
  user.posts.pull(deletedPost._id);
  await user.save();
  res.redirect('/profile');
});

// Check if user is logged in
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect('/login');
}

module.exports = router;