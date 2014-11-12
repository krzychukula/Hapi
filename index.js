var Hapi = require('hapi');
var path = require('path');
var fs = require('fs');
var rot13 = require('rot13-stream')();
var Joi = require('joi');

// Create a server with a host and port
var server = Hapi.createServer('localhost', Number(process.argv[2] || 8080));


server.views({
  engines: {
    html: require('handlebars')
  },
  helpersPath: 'helpers',
  path: path.join(__dirname, 'templates')
})


var routeConfig = {
  path: '/chickens/{breed}',
  method: 'GET',
  handler: function(req, rep){
    reply('chicken' + req.params.breed)
  },
  config: {
    validate: {
      params: {
        breed: Joi.string().required()
      }
    }
  }
}

// Add the route
server.route({
    method: 'GET',
    path: '/rot',
    handler: function (request, reply){
      reply(fs.createReadStream('file.txt').pipe(rot13));
    }
});


server.route({
    method: 'GET',
    path: '/view',
    handler: {
      view: "index.html"
    }
});

server.route({
  method: 'GET',
  path:'/foo/bar/baz/{path}',
  handler: {
    directory: { path: './public' }
  }
})

server.route({
  method: 'GET',
  path: '/{name}',
  handler: function(request, reply){
    reply("Hello " + request.params.name)
  }
});

server.route({
  method: 'GET',
  path: '/proxy',
  handler: {
    proxy: {
      host: 'localhost',
      port: 65535
    }
  }
})

// Start the server
server.start();
