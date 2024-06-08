const socketIo = require('socket.io');
const db = require('../database');

const initializeSocket = (httpsServer) => {
  const io = socketIo(httpsServer);
  let activeUsers = {};
  let offlineMessages = {};

  function emitActiveUsers() {
    db.all("SELECT DISTINCT username FROM users", (err, rows) => {
      if (err) {
        console.log(err.message);
      } else {
        const activeUsersList = rows.map(row => row.username);
        io.emit('active users', activeUsersList);
      }
    });
  }

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('set username', (username) => {
      db.run("INSERT OR IGNORE INTO users (id, username) VALUES (?, ?)", [socket.id, username], (err) => {
        if (err) {
          return console.log(err.message);
        }
        activeUsers[username] = socket.id;
        if (offlineMessages[username]) {
          console.log('Sending offline messages to:', username);
          offlineMessages[username].forEach(({ from, message, type, filename }) => {
            socket.emit('private message', { from, message, type, filename });
          });
          delete offlineMessages[username];
        }
        emitActiveUsers();
      });
    });

    socket.on('disconnect', () => {
      db.run("DELETE FROM users WHERE id = ?", [socket.id], (err) => {
        if (err) {
          return console.log(err.message);
        }
        const username = Object.keys(activeUsers).find(key => activeUsers[key] === socket.id);
        if (username) {
          delete activeUsers[username];
        }
        emitActiveUsers();
        console.log('user disconnected');
      });
    });

    socket.on('private message', ({ to, message, type, filename }) => {
      const fromUser = Object.keys(activeUsers).find(key => activeUsers[key] === socket.id);
      if (fromUser) {
        db.run("INSERT INTO messages (from_user, to_user, message, type, filename) VALUES (?, ?, ?, ?, ?)", [fromUser, to, message, type, filename], (err) => {
          if (err) {
            console.log(err.message);
          }
        });

        const toSocketId = activeUsers[to];
        if (toSocketId) {
          io.to(toSocketId).emit('private message', { from: fromUser, message, type, filename });
        } else {
          if (!offlineMessages[to]) {
            offlineMessages[to] = [];
          }
          offlineMessages[to].push({ from: fromUser, message, type, filename });
          console.log('Message queued for offline user:', to);
        }
        io.to(socket.id).emit('private message', { from: fromUser, message, type, filename });
      } else {
        console.log('Error: Unable to send message. User not found.');
      }
    });

    socket.on('get messages', ({ from, to }) => {
      db.all("SELECT * FROM messages WHERE (from_user = ? AND to_user = ?) OR (from_user = ? AND to_user = ?) ORDER BY received_at", [from, to, to, from], (err, rows) => {
        if (err) {
          console.log(err.message);
        } else {
          socket.emit('load messages', rows);
        }
      });
    });
  });

  setInterval(() => {
    emitActiveUsers();
  }, 30000);
};

module.exports = initializeSocket;
