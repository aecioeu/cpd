const express = require('express');
const router = express.Router();
const moment = require('moment')
var db = require('../../../config/db')
var request = require('request');




var pool = require("../../../config/pool-factory");

// Estrutura /API/Tasks

//whatsapp
/*var client = require("../../../config/wpp");*/
const { sendMsg }  = require('../../../config/senderHelper')

router.post('/check', async function (req, res) {

  const body = req.body
  const number = body.number.toString().replace(/\D/g, "")

  var options = {
    'method': 'POST',
    'url': `${process.env.API_EVOLUTION_URL}/chat/whatsappNumbers/${process.env.SESSION_NAME}`,
    'headers': {
      'Content-Type': 'application/json',
      'apikey': `${process.env.SESSION_API_KEY}`
    },
    body: JSON.stringify({
      "numbers": [
        `55${number}`
      ]
    })
  
  };
  console.log(options)
 
  request(options, function (error, response) {
    if (error) throw new Error(error);
    //console.log(response.body);
    //data = JSON.stringify(response.body)
    var jsonObject = JSON.parse(response.body);
    
    if (jsonObject[0]?.exists ==  true) {

      return res.status(200).json({
       status: jsonObject[0]?.exists,
       jid: body.number.toString().replace(/\D/g, ""),
       message: "Numero tem Whatsapp",
     });
   
    }else{
     console.log('algum erro ocorreu ao buscar 55' + number)
     
     return res.status(200).json({
       status: {
         exists : false
       },
       message: "Não existe",
     });
    }



  });





 //const [result] = await client.onWhatsApp("55" + number);



})




router.post("/assing-message", async function (req, res, next) {

  const body = req.body
  console.log(body)

     /* await sendMsg(
              {
              type: body.type,
              message: body.message,
              from: body.from,
              footer: (body.footer) ? body.footer : '',
              buttons : body.buttons
              },
              client
          );*/

          
  return res.status(200).json({
    status: false,
    message: "404 - Não existe",
  });

})

router.post("/send", async function (req, res, next) {

    const body = req.body
    

       const msg =  await sendMsg(
                {
                type: body.type,
                message: body.message,
                from: body.from
                },
                client
            );

  

    return res.status(200).json({
      status: false,
      message: "404 - Não existe",
    });

  })

module.exports = router;