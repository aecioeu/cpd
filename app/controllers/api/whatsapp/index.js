const express = require('express');
const router = express.Router();
const moment = require('moment')
var db = require('../../../config/db')
var request = require('request');
require('dotenv').config()

var pool = require("../../../config/pool-factory");
const { sendMsg }  = require('../../../config/senderHelper')

router.post('/check', async function (req, res) {

  const body = req.body
  const number = body.number
  
  if(number !== null){

    var options = {
      'method': 'POST',
      'url': `${process.env.API_EVOLUTION_URL}/chat/whatsappNumbers/${process.env.SESSION_NAME}`,
      'headers': {
        'Content-Type': 'application/json',
        'apikey': `${process.env.GLOBAL_API_KEY}`
      },
      body: JSON.stringify({
        "numbers": [
          `55${number.toString().replace(/\D/g, "")}`
        ]
      })
    
    };
    //console.log(options)
   
    request(options, function (error, r) {
      try {
        if (error) throw error;  
        const response = JSON.parse(r.body)
        //console.log(r, response);
        return res.status(200).json(response[0]);
  
      } catch (error) {
        console.error('Ocorreu um erro:', error.message);
      }
    });

  } else{

    return res.status(200).json({msg : "Invalid Number"});
  }

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