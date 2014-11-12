var Hapi = require('hapi');

// Create a server with a host and port
var server = Hapi.createServer('localhost', Number(process.argv[2] || 8080));

// Add the route
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {

        reply('Hello Hapi');
    }
});

// Start the server
server.start();
