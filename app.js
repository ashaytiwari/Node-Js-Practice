const http = require('http');

function requestListener(request, response) {

  console.log(request.url);

  response.setHeader('Content-Type', 'text/html');

  response.write('<html>');
  response.write('<head><title>Node Js</title></head>');
  response.write('<body><h2>Hare Krishna</h2></body>');
  response.write('</html>');

  response.end();

}

const server = http.createServer(requestListener);

server.listen(8000);

console.log('server is running on port 8000')