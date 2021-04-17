const express = require('express');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3500;

// const router = express.Router();
// module.exports = router;

const constVar = require('method-override');
app.use(constVar('_method'));

// const path = require('path');
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));

app.listen(PORT, ()=>{
    console.log('server running on port '+PORT+'!');
})

app.get('/', (req, res) => {
    res.send('hey planet');
})

app.get('/hey', (req, res) => {
    res.render('hey.ejs');
})

app.get('/api', (req, res) => {
    res.render('api.ejs');
})
