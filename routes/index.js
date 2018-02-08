var express = require('express');
var router = express.Router();

const {
    Client
} = require('pg')

/**Connection credentials */
const client = new Client({
    user: 'fdbrfwnfcmgbbj',
    host: 'ec2-107-22-241-243.compute-1.amazonaws.com',
    database: 'dcbps0vck4qo1v',
    password: '8c41eefaf8a90ed9058e895c25cb380f2fa58b2e734dbc46a648dd47f129d356',
    port: '5432',
    ssl: true
});

client.connect();

client.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

/**Create table if not exists */
const createTB =
    'CREATE TABLE IF NOT EXISTS users(' +
    'fname VARCHAR(100) NOT NULL PRIMARY KEY,' +
    'timestamp VARCHAR(30) NOT NULL);';

client.query(createTB, (err, res) => {
    if (err) {
        console.log(err.stack);
    } else {
        console.log("|| TABLES CREATED ||")
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/entries', function(req, res, next) {
  var sql = "SELECT * FROM users";
  client.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            //console.log(res);
            console.log(result.rows);

            var rawdata = JSON.stringify(result.rows);
            rawdata = JSON.parse(rawdata);

            res.render('entries', { title: 'Signup', data: rawdata });

        }
    });
});

router.post('/checkin', function(req, res, next){
  var name = req.body.name;
  console.log(name);
  const time =  new Date();
  var sql = "INSERT INTO users(fname, timestamp) values($1, $2)";
  var values = [name, time];
  client.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(res);
            console.log('inserted!');
        }
    });
});

module.exports = router;
