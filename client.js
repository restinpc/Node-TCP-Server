var net = require('net')
var client = net.connect({port : 5000},function(){
    console.log('connected to the server')
})

client.on('data',function(data){
    console.log(data.toString())
    //client.end()
})
client.write("Hello !!!!")