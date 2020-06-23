'use strict';
require('dotenv').config();
const util = require('./util');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.disable('x-powered-by');
app.use(bodyParser.json());
const PORT = process.env.PORT || 8000;

app.post('/ai-message', (req, res) => {
  try {
    let msg = req.body.context[0];

    util.translateToEnglish(msg, (err, detected_lang, translated_msg) => {
      if (err) console.log(err);
      if (detected_lang) {
        util.getAIResponse(translated_msg, (err, response, body) => {
          if (err) {
            res.status(500).send('Internal server error');
          } else {
            util.translateToOrigin(body.response, detected_lang, (err, msg) => {
              if (err) {
                res.status(200).send(body);
              } else {
                res.status(200).send({response: msg});
              }
            });
          }
        });
      } else {
        util.getAIResponse(msg, (err, response, body) => {
          if (err) {

            res.status(500).send('Internal server error');
          } else {
            res.status(200).send(body);
          }
        });
      }
    });

  } catch (e){
    res.status(400).send('Bad request');
  }

});

app.listen(PORT);
