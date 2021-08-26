/* Original by David Siegel <david@glideapps.com>
* Addition by Manu.n
* 
* Addition : 
* - Local language if the Lang parameter is empty
* - Information in case of error 
* - Cache
* - Conversion Unicode to Ascii
* 
*/

const cache = new Map();

window.function = async function (text, lang, key) {
  text = text.value;
  if (text == undefined || text == '') return undefined;

  lang = lang.value;
  if (lang == undefined || lang == '') {
    let localLanguage = navigator.language.split('-');
    lang = localLanguage[0];
    if (lang == '')
      lang = 'en';
  }

  key = key.value;
  if (key == undefined || key == '') return "Error key is empty";;


  let ret = cache.get(text + lang);

  if (ret === undefined) {

    try {
      const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${key}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ q: [text], target: lang })
      });
     
      const { data } = await response.json();

      if (!response.ok) {
        return "Error : " + response.status + " " + response.statusText;
      }
      
      if (data !== undefined && data.translations !== undefined && data.translations.length > 0) {
        ret = data.translations[0].translatedText;
        ret = unicode2Ascii(ret);
        cache.set(text + lang, ret);
      }
    }
    catch (e) {
      return e.message;
    }
  }

  return ret;
}

// Conversion unicode ex: "C&#39;est un truc" to "C'est un truc"
function unicode2Ascii(str) {
  var code = str.match(/&#(\d+);/g);
  if (code === null) {
    return str;
  }
  for (var i = 0; i < code.length; i++) {
    str = str.replace(code[i], String.fromCharCode(code[i].replace(/[&#;]/g, '')));
  }
  return str;
}
