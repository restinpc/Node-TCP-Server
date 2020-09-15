const net = require('net');

const app = {
    id: 0,
    frameId: 0,
    clients: [],
    interval: null,
    server: null,
    log: [],
    add: function(data) {
        this.frameId = this.frameId + 1;
        this.log = this.log.concat(data);
    },
    swap: function() {
        return this.log;
    },
    render: function() {
        if (this.id != this.frameId) {
            this.clients.forEach(client => {
                client.write(JSON.stringify(this.swap()));
            });
            this.id = this.frameId;
        }
    },
    init: function(port = 5000) {
        console.log("Chat server running at port "+port+"\n");
        this.server = net.createServer(socket => {
            socket.name = socket.remoteAddress + ":" + socket.remotePort;
            this.clients.push(socket);
            //socket.write("Welcome " + socket.name + "\n");
            this.add(socket.name + " joined the chat\n");
            socket.on('data', data => {
                this.add(socket.name + "> " + data);
            });
            socket.on('end', () => {
                this.clients.splice(this.clients.indexOf(socket), 1);
                this.add(socket.name + " left the chat.\n");
            });
        });
        this.server.listen(5000);
        if (!this.interval) {
            this.interval = setInterval(() =>  this.render(), 25);
        }
    }
}

app.init();

