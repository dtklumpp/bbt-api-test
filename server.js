const express = require('express');

console.log('hit server file');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3500;

//need this when break into controllers
// const router = express.Router();
// module.exports = router;

var admin = require('firebase-admin');
var serviceAccount = require(process.env.KEYPATH);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

var db = admin.firestore();
var auth = admin.auth();

const methOver = require('method-override');
app.use(methOver('_method'));

// const path = require('path');
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));

app.listen(PORT, ()=>{
    console.log('server running on port '+PORT+'!');
})

var userCount = 1;

app.get('/', (req, res) => {
    res.send('hey planet');
})

app.get('/hey', (req, res) => {
    res.render('hey.ejs');
})

app.get('/api', (req, res) => {
    res.render('api.ejs');
})

app.get('/addUser', (req, res) => {
    console.log('top of add');

    addUser();

    async function addUser(){
        // console.log(`hey`);
        try{
            const docRef = await db.collection('dtk-test-2').add({
                first: "James",
                last: "Madison",
                born: 1751,
            })
            let docId = docRef.id;
            // console.log('after-add');
            console.log({docId});
            // setFirst(null);
            // setLast(null);
            // setBorn(null);
            // getUsers();
            res.status(201).json({ "doc": docId });
            // res.send('success! '+docId)
        }
        catch(err) {
            console.error("Error adding doc", err);
            // res.status(500);
            res.send('failure '+err);
        }
        console.log('end fxn');
    }


    // res.render('api.ejs');
})

app.get('/addGame', (req, res) => {
    console.log('top of game');

    addGame();

    async function addGame(){
        try{
            const bearerHeader = req.headers["authorization"];

            console.log({bearerHeader});

            if(typeof bearerHeader !== undefined){
                const token = bearerHeader.split(" ")[1];
                console.log({token});

                const decodedToken = await auth.verifyIdToken(token);

                const uid = decodedToken.uid

                console.log({uid});
            }


            const docRef = await db.collection('dtk-test-3').add({
                name: "Sample-Game",
                day: "Thursday",
                players: 4,
            })
            let docId = docRef.id;
            console.log({docId});
            res.status(201).json({ "doc": docId });
        }
        catch(err) {
            console.error("Error adding game-doc", err);
            res.send('failure '+err);
        }
        console.log('end fxn');
    }


// res.render('api.ejs');
})




app.get('/regUser', (req, res) => {
    console.log('top of reg');


    regUser();

    async function regUser(){
        // console.log("doesn't do anything");
        try{
            let email = "testuser"+userCount+"@test.com";
            let pass = "hellofriend";
            userCount++;
            const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
            var user = userCredential.user;
            console.log('registered!');
            // console.log({user})

            // await auth.signInWithEmailAndPassword(email, pass);
            // viewUser();
            let id = user.providerData[0].uid;
            res.status(201).json({ "user": id });

        }
        catch(err){
            var errorCode = err.code;
            var errorMessage = err.message;
            console.log({errorCode, errorMessage});
            res.send('failure '+err.code+" msg:" + err.message);

        }
        // setEmail(null);
        // setPass(null);
    }

})