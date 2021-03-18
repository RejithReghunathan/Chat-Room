const {
  response
} = require('express');
var express = require('express');
var router = express.Router();
var userHelper = require('../helpers/user-helpers')
var verifyLogin = (req, res, next) => {
  var userLogin = req.session.user

  if (userLogin) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', verifyLogin, async function (req, res, next) {

  let users =await userHelper.getAllUsers()
  
  res.render('home',{users,userData:req.session.user});

});

router.get('/login', (req, res) => {
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    res.render('login')
  }
  
})

router.post('/login', (req, res) => {
  console.log("router", req.body);
  userHelper.login(req.body).then((response) => {
    console.log('returned to router', response);
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.user
    }
    res.json(response)
  })
})

router.get('/signup', (req, res) => {
  if (req.session.user) {
    res.redirect('/')
  } else {
    res.render('signup')
  }

})

router.post('/signup', (req, res) => {
  console.log('***', req.body);
  userHelper.signup(req.body).then((response) => {
    console.log('rees',response)

    if (response.user) {
      req.session.loggedIn = true;
      req.session.user = response
    }
    res.json(response)
  })
})

router.get('/logout', (req, res) => {
  req.session.loggedIn = false
  req.session.user = false
  res.redirect('/')
})

router.get('/getChat:id',(req,res)=>{
  console.log('usere',req.params.id);

  let oldChat = userHelper.getOldChat(req.params.id,req.session.user._id)
})

module.exports = router;