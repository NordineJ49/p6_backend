

// import express framework pour app web node.js
const express = require('express')
// module mongoose qui est un odm (object document mapping) pour mongodb
const mongoose = require('mongoose')
// module qui permet de fournir des fonctions pour travailler avec des chemins de fichiers
const path = require('path')
// permet de charger des variables a partir d'un fichier .env
require('dotenv').config()
// import des routes pour les sauces et les users
const sauceRoutes = require('./routes/sauce')
const userRoutes = require('./routes/user')




//fonction connect qui essaie de se connecter a une bade de données mongoDB en utilisant Mongoose
const connect = async () => {
    try {
        // instruction await qui attend la fin de la connexion a la base de données avant de poursuivre le code
        await mongoose.connect(process.env.DBLINK, {
            //on demande a mongoose d'utiliser l'analyseur d'url de mongodb
            useNewUrlParser: true,
            // et d'utiliser la nouvelle topologie de découverte de serveur
            useUnifiedTopology: true
        })
        console.log('Connexion à MongoDB réussie !')
    } catch (error) {
        console.log('Connexion à MongoDB échouée !')
    }
}
connect()




// const app qui utilise express() pour gerer les routes et les middlewares (app.use etc ...)
const app = express();




// methode use de l'appli express pour ajouter un middleware qui permet de definir les headers pour gérer les problèmes d'accès lié a la sécurité
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})




// configure l'app express pour gerer les requetes http et les reponses
// on demande a express de traiter les données json des requetes 
app.use(express.json())
// definie les routes a utiliser
app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', userRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))




// objet module de node qui exporte la variable app (express())
module.exports = app
