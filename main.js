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

const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;

const app = express();

app.engine('hbs', hbs({defaultLayout:'default.hbs'}));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {

    res.status(200);
    res.type('text/html');
    res.render('index');
});

app.post('/', express.urlencoded({extended:true}), (req, res) => {

    const limit = 20;
    const baseurl = 'http://gateway.marvel.com/v1/public';
    const endpoint = baseurl + '/characters';
    const url = withQuery(endpoint, {
        ts,
        apikey: pubKey,
        hash,
        nameStartsWith: req.body.nameStartsWith,
        limit: limit,
        offset: parseInt(req.body.offset)
    });

    fetch(url).then( results => {
        return resultsJSON = results.json()
    }).then( resultsJSON => {
        const nameArray = resultsJSON.data.results.map(v => v.name);
        res.status(200);
        res.type('text/html');
        console.log(parseInt(req.body.offset));
        res.render('index', {nameStartsWith: req.body.nameStartsWith, nameArray, prevOffset: parseInt(req.body.offset)-limit, nextOffset: parseInt(req.body.offset)+limit});
    }).catch( e => {
        console.log(e);
    });

});

app.listen(PORT, ()=>{
    console.log(`You have connected to ${PORT} on ${new Date()}.`);
})