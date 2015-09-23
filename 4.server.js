var http = require('http');
var ASQ = require("asynquence");
var node_static = require("node-static");
var host = "localhost";
var port = 8006;
var http_serv = http.createServer(handleHTTP).listen(port, host);

function handleHTTP(req, res) {
	if (/^\/\d+(?=$|[/\?#])/.test(req.url)) {
		req.addListener("end", function() {
			req.url = req.url.replace(/^\/(\d+).*$/, "/$1.html");
			static_files.serve(req, res);
		});
		req.resume();
	} else {
		res.writeHead(403);
		res.end("Get outta here !");
	}
}

function handleIO(socket) {
	function disconnect() {
		clearInterval(intv);
		console.log("client disconnected");
	}
    console.log("client connected");

	socket.on("disconnect", disconnect);

	var intv = setInterval(function(){
		socket.emit("hello",Math.random());
	},1000);
	socket.on("sendMessage",function(message){
		socket.broadcast.emit("messages",message);
	});
}
var static_files = new node_static.Server(__dirname);
var io = require("socket.io").listen(http_serv);
io.on("connection", handleIO);
io.configure(function(){
	io.enable("browser client minification"); // send minified client
	io.enable("browser client etag"); // apply etag caching logic based on version number
	io.set("log level", 1); // reduce logging
	io.set("transports", [
		"websocket",
		"xhr-polling",
		"jsonp-polling"
	]);
});