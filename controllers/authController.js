const User = require('../models/user_auth')
const jwt  = require('jsonwebtoken')
const {body, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const passport = require('passport')

// Login POST
exports.login = async function (req, res, next){
    try{
    passport.authenticate('local', {session: false}, (err, user, info) =>{
      if (err || !user){
        const error = new Error('User does not exist')
        return res.status(403).json({
          info
        })
      }
    req.login(user, {session: false}, (err) => {
      if (err){
        next(err);
      }
      // create token
      const body = {_id: user._id, username: user.username, password: user.password}
      const token = jwt.sign({user: body}, process.env.SECRET_KEY, {expiresIn: '1d'});
  
      return res.status(200).json({body, token});
  
    });
  }) (req, res, next);
  } catch (err){
    res.status(403).json({
      err
    })
  }
  };
  
// Logout POST
exports.logout = (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
}

// Sign up POST
exports.signup = [
    // Validate and sanitize fields
    body('username').trim().isLength({min:1}).withMessage('Enter username').escape(),
    // Check if username is already taken
    async function(req, res, next){
        try{
            const user = await User.findOne({username: req.body.username})
            if(user){
                return res.status(403).json({
                    message: 'Username already taken'
                })
            }
            next()
        }
        catch(err){
            res.status(403).json({
                err
            })
        }
    },

    body('password').trim().isLength({min:1}).withMessage('Enter password').escape(),
    
    // Confirm password
    body('confirmPassword').trim().isLength({min:1}).withMessage('Enter password').escape(),
    function(req, res, next){
        if(req.body.password !== req.body.confirmPassword){
            return res.status(403).json({
                message: 'Passwords do not match'
            })
        }
        next()
    }
    // Check for errors
    ,(req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        next();
    }
    // Hash password
    ,(req, res, next) => {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return next(err);
            }
            req.body.password = hash;
            next();
        });
    }
    // Create user
    ,async (req, res, next) => {
        try {
            const user = new User(req.body);
            await user.save();
            res.status(200).json({
                message: 'User created'
            });
        } catch (err) {
            next(err);
        }
    }

]

exports.usersPosts = async function (req, res, next){
    try{
      let allPosts = await User.find({_id: req.params.userid}, { _id: 0, posts: 1})
      .populate('posts')
      .exec().then(posts => {
        return posts
      }
      )
      res.status(200).json({
        allPosts
      })
    }
    catch(err){
      res.status(403).json({
        err
      })

    }
  }

