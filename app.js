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
let Article_Table = require('./models/article');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//Home Route
app.get('/', (req, res) =>{
	 let name = 'Golden'; 
	 let age = 33;
	res.render('hello', {title: name, age: age});
});
//Home Route
app.get('/addproduct', (req, res) =>{
	 let name = 'Golden'; 
	 let age = 33;
	 let articles = [
	 	{
	 	  id:1,
	 	  title:'Article Two',
	 	  author:'Brand Traversy',
	 	  body:'This is article one'
	 	},
	 	{
	 	  id:2,
	 	  title:'Article One',
	 	  author:'James Doe',
	 	  body:'This is article two'
	 	},
	 	{
	 	  id:3,
	 	  title:'Article Three',
	 	  author:'Don Mikel',
	 	  body:'This is article Three'
	 	}
	 ];
	res.render('saveproduct', {title: name, articles: articles});
});



//Start Server
app.listen(3000, function(){
  console.log('Server started on port 3000....');
});