'use strict';
const request = require('request');

const ENG_TRANSLATOR_URL = process.env.ENG_TRANSLATOR_URL ||
                                'http://149.202.214.34:5000/toenglish?';
const ORIGIN_TRANSLATOR_URL = process.env.ORIGIN_TRANSLATOR_URL ||
                                'http://149.202.214.34:5000/tooriginal';
const EVERLIFE_CHAT_URL = process.env.EVERLIFE_CHAT_URL ||
      'http://chat.everlife.ai:8941/everlife-chat/v1/actions/get_response';


function convertStringToJSON(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return {};
  }
}

function translateToEnglish(msg, cb){
  let options = {
    url: ENG_TRANSLATOR_URL,
    form: {
      sentence: msg,
    },
  };

  request.post(options, (err, res) => {
    if (err) cb(err);
    else {
      try {
        let translated = JSON.parse(res.body);
        let english_msg = translated.Output;
        let lang = translated.lang;
        cb(null, lang, english_msg);
      } catch (e) {
        cb(e);
      }
    }
  });
}

function getAIResponse(msg, cb) {
  const options = {
    uri: EVERLIFE_CHAT_URL,
    method: 'POST',
    json: {
      context: [msg],
    },
  };
  request(options, cb);
}

function translateToOrigin(msg, lang, cb){
  let options = {
    url: ORIGIN_TRANSLATOR_URL,
    form: {
      sentence: msg,
      toLang: lang,
    }};
  request.post(options, (err, result) => {
    if (err || (result.statusCode === 404)){
      cb(err, msg);
    } else {
      try {
        let translated = JSON.parse(result.body);
        let translated_msg = translated.Output;
        cb(null, translated_msg);
      } catch (e) {
        cb(e, msg);
      }
    }
  });
}
module.exports = {
  convertStringToJSON,
  translateToEnglish,
  translateToOrigin,
  getAIResponse,
};
