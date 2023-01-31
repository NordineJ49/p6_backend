// import des modules http et app
const http = require('http');
const app = require('./app');





// Fonction normalizePort qui prend une valeur de numéro de port sur lequel le serveur doit écouter
const normalizePort = val => {
    const port = parseInt(val, 10);
    // si 'port' n'est pas un nombre valide -------- (isNaN = is Not a Number)
    if (isNaN(port)) {
        // si c'est le cas retourne la valeur d'entrée non modifiée
        return val;
    }
    // verifie si la valeur convertie est supérieur ou égale à zero et si oui retourne 'port'
    if (port >= 0) {
        return port;
    }
    // sinon retourne false
    return false;
};




// variable qui défini sur quel port le serveur doit écouter
const port = normalizePort(process.env.PORT || '3000');
// methode set de l'application Express pour définir la propriété 'port' sur la valeur de la variable 'port'
app.set('port', port);




// fonction errorHandler qui gère les erreurs qui peuvent survenir lors de la mise en ecoute du serveur http 
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error
    }
    // const adress = adresse du serveur 
    const address = server.address()
    //const bind, coondition ternaire qui determine si address est une string ou un nombre
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
    // switch pour les differents codes d'erreur potentiels
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.')
            process.exit(1)
            break
        default:
            throw error
    }
}


// const server qui creer un serveur en utilisant le module http et l'application express "app"
const server = http.createServer(app)

// on configure les evenemnt pour gerer les erreurs et la mise en ecoute du serveur
server.on('error', errorHandler)
server.on('listening', () => {
    const address = server.address()
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
    console.log('Listening on ' + bind)
})

// on démarre le serveur et on ecoute sur le port spécifier
server.listen(port)
