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

server.route({
  method: 'POST',
  path: '/upload',
  handler: function(req, rep){
    var body = '';
    req.payload.file.on('data', function(data){
      body += data;
    })
    req.payload.file.on('end', function(){
      console.log(body);
      rep({
        description: req.payload.description,
        file: {
          data: body,
          filename: req.payload.file.hapi.filename,
          headers: req.payload.file.hapi.headers,
        }
      })
    })
  },
  config: {
    payload: {
      allow: 'multipart/form-data',
      output: 'stream',
      parse: true,
    }

  }
})

server.route({
  method: 'POST',
  path: '/login',
  handler: function(req, rep){ rep('login successful')},
  config: {
    validate: {
      payload: Joi.object({
         isGuest: Joi.boolean().required(),
         username: Joi.when('isGuest', { is: false, then: Joi.required() }),
         password: Joi.string().alphanum(),
         accessToken: Joi.string().alphanum(),
      })
      .options({allowUnknown: true})
      .without('password', 'accessToken')
    }
  }
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
