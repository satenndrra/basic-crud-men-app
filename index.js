// require express and body parser modules//
const express = require('express');
const bodyParser = require('body-parser');
const path=require('path');
// creating mongo instance//
const MongoClient = require('mongodb').MongoClient;

// c9 local mongodb url
//const url = 'mongodb://chamsudhir-wallapp-4894806:27017/newdb';

// heroku mongodb url
const url = 'mongodb://chamsudhir-wallapp-4894806:27017/newdb';



// creating the app server using function express //
const app = express();
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');
//connect to mongodb//
MongoClient.connect(url, function(err,db){
        if(err) return console.log(err);
        
        // server listening on port//

        app.listen(process.env.PORT, function(){
           console.log("listening to c9 port"); 
        });

    // serve the index file to the server//

    app.get('/',function(req,res){
        db.collection('quotes').find().toArray(function(err,result){
           if(err) return console.log(err); 
           res.render('quotes.ejs', {quotes: result});
        });
    });
    
    app.post('/addQ', function(req,res){
        db.collection('quotes').save(req.body, function(err,result){
            if(err) return console.log(err);
            console.log('quote saved to database');
            res.redirect('/');
        });
    });
     app.post('/home', function(req,res){
            res.redirect('/');
        });
    var fnameO;
    
    app.post('/query', function(req, res){
       fnameO = req.body.fname; 
         console.log('fname in post-query: ' + fnameO ); 
         res.redirect('/update');
         
    });
    
      app.get('/update', function(req, res){
         console.log('fname in get-query: ' + fnameO ); 
            db.collection('quotes').find({name: fnameO}).toArray(function(err,result){
               if(err) return console.log(err); 
               console.log(result);
               res.render('update.ejs', {quotes: result}); 
            });        
        });
        app.post('/deleteQ', function(req, res) {
            console.log("in deleteQ");
            console.log(fnameO +' ' + req.body.deleteB);
            db.collection('quotes').remove({name: fnameO,message: req.body.deleteB});
            res.redirect('/update');
        });
        app.post('/updateQ', function(req, res) {
           db.collection('quotes').update({name: fnameO,message: req.body.updateB}, {name: fnameO,message: req.body.updatedQ});
           res.redirect('/update');
        });
});
