const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const fs = require('fs');
const path = require('path');

// Middleware
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom route to handle adding a message to the inbox chat
server.post('/inbox/:id/chat', (req, res) => {
    const dbFilePath = path.join(__dirname, 'db.json');
    const db = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));

    const { id } = req.params;
    const newMessage = req.body;

    // Find the correct inbox by ID
    const inbox = db.inbox.find((inbox) => inbox.id === id);

    if (inbox) {
        // Find the latest chat and add the new message to its details
        const latestChat = inbox.chat[inbox.chat.length - 1];
        latestChat.detail.push(newMessage);

        // Save the updated data back to the db.json file
        fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));

        res.status(200).json(newMessage);
    } else {
        res.status(404).json({ message: "Inbox not found" });
    }
});

server.use(router);

// Start the server
server.listen(3000, () => {
    console.log('JSON Server is running');
});
