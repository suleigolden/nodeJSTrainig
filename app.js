const express = require("express");
const path = require("path");

//const cons = require('consolidate');
// Init App
const app = express();

//Load View Engine
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');


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
// app.get('/',function(req,res){
//   res.sendFile(path.join(__dirname+'/views/hello.html'));
//   //__dirname : It will resolve to your project folder.
// });



//Start Server
app.listen(3000, function(){
  console.log('Server started on port 3000....');
});