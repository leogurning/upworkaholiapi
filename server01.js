const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const bunyan = require('bunyan');
const expressJwt = require('express-jwt');

const app = express();
const httpServer = require('http').Server(app);

const config = require('./config');

const log = bunyan.createLogger({
  name: 'baseapp-server',
});

const port = process.env.PORT || config.serverport;

// are we tring to close down and exit the application
let areClosing = false;

function exitApplication() {
  areClosing = true;
  mongoose.connection.close(() => {
    process.exit(0);
  });
}
// Close all connection database if there is process termination
process.on('SIGINT', exitApplication);
// This is to avoid deprecated warning of findAndModify
mongoose.set('useFindAndModify', false);

function connectToMongo() {
  mongoose.connect(config.database, {
    useNewUrlParser: true,
    useCreateIndex: true,
  }, (err) => {
    if (err) {
      console.log('Error connecting database, please check if MongoDB is running.');
    }
  });
}

// handle when there is database error. Try to reconnect
function handleDbError(mongoError) {
  // If there is error in database connection, try re-connect
  console.error(`Mongoose connection has occured ${mongoError} error`);
  console.log('Trying to re-connect to mongo, after 5 seconds.');
  setTimeout(connectToMongo, 5000);
}

mongoose.connection.on('open', () => {
  console.log(`Connected to database at ${new Date()}`);
});

// handle any mongo errors, I don't think reconnecting for every error type
// is appropriate
mongoose.connection.on('error', handleDbError);

mongoose.connection.on('disconnected', () => {
  if (!areClosing) {
    console.log('Mongoose default connection disconnected, trying a reconnect');
    setTimeout(connectToMongo, 5000);
  } else {
    console.log('Mongoose default connection disconnected due to application termination');
  }
});

connectToMongo();


// Enable CORS from client-side
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  // THIS is set to reduce unnecessary pre-flight OPTIONS request
  res.setHeader('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') { res.sendStatus(204); } else { next(); }
});


// use all files inthe public folder as static content
app.use(express.static(path.join(__dirname, 'public')));

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Used by load balancer to make sure we are taking requests
app.get('/healthcheck', (req, res) => res.send('System status: Ok'));

// basic routes
app.get('/', (req, res) => {
  res.send(`Base APP API is running at PORT:${port}/api`);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (typeof (err) === 'string') {
    // custom application error
    return res.status(400).json({ message: err });
  }
  if (err.name === 'UnauthorizedError') {
    // No token to authenticate
    return res.status(403).json({ message: err.message });
  }
  if (err.name === 'TokenExpiredError') {
    // jwt authentication expired
    return res.status(401).json({ message: 'Token Expired. Please login again.' });
  }
  // TODO: LBNOte had to comment this out as it was catching no existient problems
  // default to 500 server error
  // return res.status(500).json({ message: err.message });
  return res.end();
});

process.on('uncaughtException', (e) => {
  console.log(e.message);
});

// The httpServer has both express and socket io so we call its listen method
httpServer.listen(port, () => {
  log.info('listening on *:', port);
});

console.log(`Base App API Server v 1.01 is listening at PORT:${port}`);

function printCommandTips() {
  console.log('Server commands: clear,cls,r,q,quit');
}

const self = this;

process.stdin.on('readable', () => {
  let input = process.stdin.read();
  if (input === null) {
    return;
  }

  input = (`${input}`).trim();

  if (input === 'r') {
    // Repo monitoring
    // repositoryMonitoring.onRepoPush({ IP: '127.0.0.1' });
  } else
  if (input === 'quit' || input === 'q') {
    if (self.childProcess) {
      self.childProcess.kill('SIGTERM');
    }
    exitApplication();
  } else if (input === 'clear' || input === 'clr') {
    process.stdout.write('\u001b[2J\u001b[0;0H');
  } else {
    console.log('\nInvalid command');
    printCommandTips();
  }
});
