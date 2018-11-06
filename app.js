const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');


//Connect to Database
mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//Check Connection
db.once('open', ()=>{
  console.log('Connected to MongoDB');
});

//Check for DB errors
db.on('error', (err) =>{
  console.log(err);
});

// Init App
const app = express();

//Bring in Models
let articleTable = require('./models/article');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Set Public Folder
app.use(express.static(path.join(__dirname,'public')));

//Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  //cookie: { secure: true }
}));

//EXpress Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Home Route
app.get('/', (req, res) =>{
	 // let name = 'Golden'; 
	 // let age = 33;
	 articleTable.find({}, (err, articles) =>{

		if(err){
			console.log(err);
		}else{
			res.render('hello', {articles: articles});
		}
	});

});
//Home Route
app.get('/addproduct', (req, res) =>{
	let errors = {};
	res.render('saveproduct',{errors:errors});
	
});

//Save new article Route
app.post('/addproduct', (req, res) =>{
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
app.get('/fullview/:id', (req, res) =>{
	
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
app.get('/edit/article/:id', (req, res) =>{
	
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
app.post('/article/edit/:id', (req, res) =>{
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
app.delete('/article/:id', (req, res) =>{
	let query = {_id:req.params.id}

	articleTable.remove(query, (err)=>{
    if (err) {
      console.log(err);
      return;
    }
      res.send('success');
    
  });

});


//Start Server
app.listen(3000, function(){
  console.log('Server started on port 3000....');
});