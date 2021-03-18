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
router.get('/', verifyLogin, function (req, res, next) {

  res.render('home');

});

router.get('/login', (req, res) => {
  res.render('login')
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



module.exports = router;