

$(document).ready(function(){  
      $('#bitcoinAmount').keyup(function(){
        console.log($('#bitcoinAmount').val());
        let bitcoins = $('#bitcoinAmount').val();
        var BTCInUSD = bitcoins*$('#bitcoinPrice').html();
        $('#bitcoinInUSD').html(Math.round(BTCInUSD * 100) / 100);
    });
      $('#ethereumAmount').keyup(function(){
        console.log($('#ethereumAmount').val());
        let ethereum = $('#ethereumAmount').val();
        var ETHInUSD = ethereum*$('#ethereumPrice').html();
        $('#ethereumInUSD').html(Math.round(ETHInUSD * 100) / 100);
    });
      $('#rippleAmount').keyup(function(){
        console.log($('#rippleAmount').val());
        let ripple = $('#rippleAmount').val();
        var XRPInUSD = ripple*$('#ripplePrice').html();
        $('#rippleInUSD').html(Math.round(XRPInUSD * 100) / 100);
    });
      $('#golem-network-tokensAmount').keyup(function(){
        console.log($('#golem-network-tokensAmount').val());
        let golem = $('#golem-network-tokensAmount').val();
        var GNTInUSD = golem*$('#golem-network-tokensPrice').html();
        $('#golem-network-tokensInUSD').html(Math.round(GNTInUSD * 100) / 100);
    });

    $(document).keyup(function(){
      $('#sumInFiat').html(function(){
        let sumInFiat = Number($('#bitcoinInUSD').html()) + Number($('#ethereumInUSD').html()) + Number($('#rippleInUSD').html()) + Number($('#golem-network-tokensInUSD').html())
        
        $('#sumInFiat').html(Math.round(sumInFiat * 100) / 100);

    });
});
    
});

 // for (let j = 0; j < cryptoData.length; j++) {

//  }
  


/*
request(currency, function (error, response, body){
    if (!error) {
      let conversionUSD = JSON.parse(body);
    }
  });


    <script>  $.getJSON('https://api.coinmarketcap.com/v1/ticker/?limit=10', function(clientCMC) {
    //$("#city").text("City: " + allData.city);
    console.log(clientCMC);
    var hello = clientCMC[0].id;
    console.log(hello); });</script>



*/
