function printHelp(){
	console.log("aryan singh 1.js (c)")
	console.log("");
	console.log("usage");
	console.log("--help           print this help");
	console.log("--file={NAME}    read the file of {NAME}");
	console.log("");
}
var args = require('minimist')(process.argv.slice(2),{ string: "file"});

if(args.help || !args.file){
	printHelp();
	process.exit(1);
}
var hello = require('./helloworld.js');

var contents = hello.say(args.file).val(function(contents){
	console.log(contents.toString());
})
.or(function(err){
	console.error("Error :" + err);
});
