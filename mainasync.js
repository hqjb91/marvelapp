const express = require('express');
const hbs = require('express-handlebars');
const fetch = require('node-fetch');
const withQuery = require('with-query').default;
const md5 = require('md5');

const pubKey = '75f482af88fb3b4be072caf7bd196ca8';
const privKey = '607aff15fee1ebde7344a54a63cf3821b77e940a';
const date = new Date();
const ts = date.getTime();
const hash = md5(ts+privKey+pubKey);
const marvelCharacter = process.argv[2];

const baseurl = 'http://gateway.marvel.com/v1/public';
const endpoint = baseurl + '/characters';
const url = withQuery(endpoint, {
    ts,
    apikey: pubKey,
    hash,
    nameStartsWith: marvelCharacter
});

(async () => {
try {

    const results = await fetch(url);
    const resultsJSON = await results.json();
    const nameArray = resultsJSON.data.results.map(v => v.name);

    console.log(nameArray);

} catch(e) {

}
})();
