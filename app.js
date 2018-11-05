const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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
	res.render('saveproduct');
	
});

//Save new article Route
app.post('/addproduct', (req, res) =>{
  let article = new articleTable();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save( (err)=>{
    if (err) {
      console.log(err);
      return;
    }else {
      res.redirect('/');
    }
  });

});



//Start Server
app.listen(3000, function(){
  console.log('Server started on port 3000....');
});