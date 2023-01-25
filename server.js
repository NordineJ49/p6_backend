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

// fonction errorHandler qui gère les erreurs
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);
