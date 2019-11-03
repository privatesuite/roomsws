const path = require("path");
const https = require("https");
const WebSocket = require("ws");

const server = https.createServer({

	ca: fs.readFileSync(path.join(__dirname, "privatesuitemag_com.ca-bundle")),
	cert: fs.readFileSync(path.join(__dirname, "privatesuitemag_com.crt")),
	key: fs.readFileSync(path.join(__dirname, "privatesuitemag_com.key"))

});
const wss = new WebSocket.Server({ server });

const rooms = new Map();

wss.on("connection", conn => {

	console.log(`New connection to room ${conn.protocol}`);
	rooms.set(conn.protocol, [...(rooms.get(conn.protocol) || []), conn]);

	conn.on("message", message => {

		let i = 0;
		for (const a of rooms.get(conn.protocol)) {
			
			i++;
			if (rooms.get(conn.protocol).indexOf(conn) === i - 1) continue;
			a.send(message);

		}

	});

	conn.on("disconnect", () => {

		rooms.get(conn.protocol).splice(rooms.get(conn.protocol).indexOf(conn));

	});

});

server.listen(8080);
