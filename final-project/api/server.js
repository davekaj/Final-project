const express = require('express');
const app = express();
const axios = require("axios")
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.listen(8080, () => {
    console.log('Server Started on http://localhost:8080');
    console.log('Press CTRL + C to stop server');
});
//*********************************BACKEND STARTS. BELOW IS API CALL********************************************** */

//this is for CORS so I can access the coin market cap API
const url = 'https://api.coinmarketcap.com/v1/ticker/?limit=200';
app.get('/cmcAPI', (req, res) => {
    let coinMarketCapAPI = axios.get(url);
    coinMarketCapAPI.then(response => {
        console.log(response.data);        
        res.send(response.data);
    })
    .catch(error => {
        console.log(error);
    });
}); 


//lets do last two years, how to pull the three letters? pull from DB
//const historicalCrypto = "https://min-api.cryptocompare.com/data/pricehistorical?fsym="+ threeLetter +"&tsyms=USD&ts="+ dailyTimeStamp;




//*****************************AUTHORIZATION and DATABASE MIXED ***************************** */
const fs            = require('fs');
const bcrypt        = require('bcryptjs');
const jwt           = require('jsonwebtoken');
const authorize     = require('./middleware/authorize'); //middleware
const secretKeyJWT = "a12$%sdfw@K>"; //this is used to hash the password the user gives the database so that their password is not actually saved on the database

//POST endpoint for password encryption and creating user profiles AUTHORIZATION AND DATABASE code in here
app.post('/encrypt',(req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email
    //generate salt and create a hash the password
    bcrypt.genSalt(10, (error, salt) => {
        bcrypt.hash(password, salt, (error, hash) => {
            // Store hash in the password DB. 
            if(error) console.log(error);
            //this will be making a new user input in database, takes all the user input and then uses the bitcoin basic seed
            let formInput = {
                userName: username,
                email: email,
                password: hash,
                crypto_amounts: [/*{ //basically a seed to start off the app. 
                    text: "Bitcoin",
                    price: 0,
                    amount: 0,
                    originalPrice: 0.00,
                    id: 1             
                }*/]            
            };
            //using mongo save to acutally post the user to the db
            let newUser = User(formInput);
            newUser.save()
                .then(savedUser => {
                    console.log(formInput);
                    res.json(savedUser);
                })
                .catch(error => {
                    console.log(error);
                    res.status(400).json(error);
                })
        })
   //     .catch(error => {
   //         return res.status(500).json(error); //this is causing an error when not greened out
   //     })
    });
});

//POST endpoint for logging in to the server
app.post('/login', (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    User.find({"userName": username})
        .then(User=>{
            let hash = User[0].password;
            //this checks the password the user provided, and hashes it, and sees if it matches the hashed password in the DB
            bcrypt.compare(password, hash, (err, result) => {
                if(result == true){// if the passwords match, a token is created that allows for the user to access to application
                    let token = jwt.sign({username: username}, secretKeyJWT)
                    res.status(200).json({token:token});
                } else {
                    res.status(403).json({error: "invalid credentials"})
                }
            })
        })
        .catch(error => {
            return res.status(500).json(error);
        })    
})

//used for the authorization
app.get('/private/:token',authorize, (req,res) => {
    res.json(req.decoded.username);
});

//************************************Database stuff below only *********************************************************** */
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/data/db/');
mongoose.Promise = global.Promise
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("connected to db at /data/db");
})
const User = require('./mongo/models/user');

//once the user is actually logged in, and when the component mounts, it calls this api and it returns what the database has saved
app.get("/getPortfolio", (req, res)=> {
    let portfolioUserName = req.query.username
    console.log(portfolioUserName);
    User.find({"userName": portfolioUserName})
        .then(singleUser=>{
            return res.json(singleUser[0]['crypto_amounts']);
        })
        .catch(error => {
            return res.status(500).json(error);
        })
})
  
//this will be called upon whenever anything is updated, based upon componentDidUpdate
app.put('/updatePortfolio', (req,res) => {
    let jsonCrypto = JSON.parse(req.query.portfolio);
    let cryptoUpdate = {
        crypto_amounts: jsonCrypto
    };	
	let query = {"userName":req.query.username}
	User.findOneAndUpdate(query, cryptoUpdate, { new:true, runValidators:true })
		.then(updatedObject => {
            console.log(updatedObject);
			res.json(updatedObject);
		})
		.catch(err => {
			console.log(err)
			res.status(400).json({err});
		})
});