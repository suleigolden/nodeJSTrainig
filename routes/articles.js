const express = require("express");
const router = express.Router();

//Bring in Article Models
let articleTable = require('../models/article');
//Bring in User Model
let User = require('../models/user');

//Add article Route
router.get('/addproduct', ensureAuthenticated, (req, res) =>{
	let errors = {};
	res.render('saveproduct',{errors:errors});
	
});

//Save new article Route
router.post('/addproduct', ensureAuthenticated, (req, res) =>{
  req.checkBody('title','Title is required').notEmpty();
  //req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

  //Get Errors
  let errors = req.validationErrors();

  if(errors){
  	res.render('saveproduct',{errors:errors});
  }else{
  	let article = new articleTable();
	  article.title = req.body.title;
	  //article.author = req.body.author;
	  article.author = req.user._id;
	  article.body = req.body.body;

	  article.save( (err)=>{
	    if (err) {
	      console.log(err);
	      return;
	    }else {
	      req.flash('success','Article Added');
	      res.redirect('/');
	    }
	  });
  }

});
//View full article Route
// router.get('/fullview/:id', (req, res) =>{
	
//  	articleTable.findById(req.params.id, (err, article) =>{
//  		if (err) {
// 	      console.log(err);
// 	      return;
// 	    }else {
// 	     res.render('article', {article:article});
// 	    }
 		
//  	}); 
	
	
// });
router.get('/fullview/:id', (req, res)=>{

  articleTable.findById(req.params.id, (err, article)=>{

    User.findById(article.author, (err, user)=>{
      res.render('article', {article:article, author: user.name});
    });

  });

});
// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

//Edit article Route
router.get('/edit/article/:id', ensureAuthenticated, (req, res) =>{
	
 	articleTable.findById(req.params.id, (err, article) =>{
 		if(article.author != req.user._id){
	      req.flash('danger', 'Not Authorized');
	      res.redirect('/');
	    }else{
	 		if (err) {
		      console.log(err);
		      return;
		    }else {
		     res.render('edit_article', {article:article});
		    }
		}
 		
 	}); 
	
});
//Update article Route
router.post('/edit/:id', ensureAuthenticated, (req, res) =>{
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id}

  articleTable.update(query,article, (err)=>{
    if (err) {
      console.log(err);
      return;
    }else {
      req.flash('success','Article Updated');
      res.redirect('/');
    }
  });

});

//Delete Article
// router.delete('/:id', ensureAuthenticated, (req, res) =>{
// 	let query = {_id:req.params.id}

// 	articleTable.remove(query, (err)=>{
//     if (err) {
//       console.log(err);
//       return;
//     }
//       res.send('success');
    
//   });

// });
router.delete('/:id', (req, res)=>{
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  articleTable.findById(req.params.id, function(err, article){
    if(article.author != req.user._id){
      res.status(500).send();
    } else {
      articleTable.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

module.exports = router;