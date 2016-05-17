require("http").createServer(function (req, res) {
  res.writeHead(200, {"content-type": "text/plain;charset=UTF-8"});
  res.end("Hello World\n");
}).listen(process.env.PORT || 8000);