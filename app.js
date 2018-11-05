const express = require("express");
const path = require("path");
const mongoose = require('mongoose');

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
	console.log('Submitted');
	
	return;
});



//Start Server
app.listen(3000, function(){
  console.log('Server started on port 3000....');
});