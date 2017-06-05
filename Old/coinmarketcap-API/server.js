const express = require('express');
const app = express();
const request = require("request");
const cheerio = require("cheerio");
//var $ = cheerio.load(body);

app.set('view engine', 'ejs');


app.listen(8080, () => {
	console.log('Server Started on http://localhost:8080');
	console.log('Press CTRL + C to stop server');
});

app.use(express.static('./static'));

/*

let dataUSD = request(currency, function (error, response, body){
                if (!error) {
                  let conversionUSD = JSON.parse(body);
    }
  });
//////////////////////////////////////

app.get('/sum', function (req, res) {
    var sum = Number(req.query.a) + Number(req.query.b) + Number(req.query.c);
    sum = String(sum);
    res.send(sum);

*/


//render the front page, which has a form where they can enter their chosen currency. then I can use that info to make a new call 
app.get('/', (req, res) => {
        res.render('index.ejs');
});



const currency = 'https://openexchangerates.org/api/latest.json?app_id=08f3469489ec48b9a3d673bd4dbace51'
const url = 'https://api.coinmarketcap.com/v1/ticker/?limit=10';

// rendering the currency page, and making two API calls
app.get('/currency', (req, res) => {
  request(currency, function (error, response, body){
  if (!error) {
    let conversionUSD = JSON.parse(body);
    var chosenCurrency = conversionUSD.rates[req.query['currency']];
    console.log(chosenCurrency);

//requesting data from coinmarketcap, nested within the currency conversion API
    request(url, function (error, response, body){
        if (!error) {
          let jsonCMC = JSON.parse(body);
          for (let i = 0; i < jsonCMC.length; i++) {
            console.log(jsonCMC[i].name);
            console.log(jsonCMC[i].price_usd*chosenCurrency);
            jsonCMC[i].price_usd = jsonCMC[i].price_usd*chosenCurrency
          }

// this is adding the three letter currency typed in by user to my Object so it can be displayed 
          let combinedObject = jsonCMC.map(function(el){
            var o = Object.assign({}, el);
            o.threeLetterCur = req.query['currency']
            return o;
          });


          res.render('currency.ejs', {'cryptoData': combinedObject});

        }
    });
  }
  });
});//end of API calls
