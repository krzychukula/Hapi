var Hapi = require('hapi');
var path = require('path')

// Create a server with a host and port
var server = Hapi.createServer('localhost', Number(process.argv[2] || 8080));

server.views({
  engines: {
    html: require('handlebars')
  },
  path: path.join(__dirname, 'templates')
})

// Add the route
server.route({
    method: 'GET',
    path: '/',
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
})

// Start the server
server.start();
