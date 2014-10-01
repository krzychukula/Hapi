var Hapi = require('hapi');
var Good = require('good');
var Path = require('path');

var serverOptions = {
    views: {
        engines: {
            html: require('handlebars')
        },
        path: Path.join(__dirname, 'views')
    }
};
// Create a server with a host and port
var server = new Hapi.Server(8000, serverOptions);

// Add the route
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {

        reply.view('index', { title: 'My home page' });
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});

server.route({
    method: 'GET',
    path: '/public/{param*}',
    handler: {
        directory: {
            path: 'public'
        }
    }
});

// Start the server
server.start();

server.pack.register(Good, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
