const WebSocket = require("ws");

const wss = new WebSocket.Server({port: 8080});

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
