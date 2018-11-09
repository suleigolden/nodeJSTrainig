const express = require("express");
const router = express.Router();

//Bring in Article Models
let articleTable = require('../models/article');

//Add article Route
router.get('/addproduct', (req, res) =>{
	let errors = {};
	res.render('saveproduct',{errors:errors});
	
});

//Save new article Route
router.post('/addproduct', (req, res) =>{
  req.checkBody('title','Title is required').notEmpty();
  req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

  //Get Errors
  let errors = req.validationErrors();

  if(errors){
  	res.render('saveproduct',{errors:errors});
  }else{
  	let article = new articleTable();
	  article.title = req.body.title;
	  article.author = req.body.author;
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
router.get('/fullview/:id', (req, res) =>{
	
 	articleTable.findById(req.params.id, (err, article) =>{
 		if (err) {
	      console.log(err);
	      return;
	    }else {
	     res.render('article', {article:article});
	    }
 		
 	}); 
	
	
});
//Edit article Route
router.get('/edit/article/:id', (req, res) =>{
	
 	articleTable.findById(req.params.id, (err, article) =>{
 		if (err) {
	      console.log(err);
	      return;
	    }else {
	     res.render('edit_article', {article:article});
	    }
 		
 	}); 
	
});
//Update article Route
router.post('/edit/:id', (req, res) =>{
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
router.delete('/:id', (req, res) =>{
	let query = {_id:req.params.id}

	articleTable.remove(query, (err)=>{
    if (err) {
      console.log(err);
      return;
    }
      res.send('success');
    
  });

});

module.exports = router;