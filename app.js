// importe le module Express
const express = require('express');

// importe le module mongoose
const mongoose = require('mongoose');

const path = require('path')

require('dotenv').config()

//
const sauceRoutes = require('./routes/sauce')

//
const userRoutes = require('./routes/user')

//
const connect = async () => {
    try {
        await mongoose.connect(process.env.DBLINK, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connexion à MongoDB réussie !');
    } catch (error) {
        console.log('Connexion à MongoDB échouée !');
    }
};
connect();



// const app qui utilise express() pour gerer les routes et les middlewares (app.use etc ...)
const app = express();

// methode use de l'appli express pour ajouter un middleware qui permet de definir les headers pour gérer les problèmes d'accès lié a la sécurité
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json())

app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', userRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))

// objet module de node qui exporte la variable app (express())
module.exports = app;
