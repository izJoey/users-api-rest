import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './routers/index.js';

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const MONGO_URL = process.env.MONGODB_URI;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error) => console.log(error));

const port = process.env.PORT || 8080;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use('/', router());

// import express from 'express';
// import http from 'http';
// import bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
// import compression from 'compression';
// import cors from 'cors';
// import mongoose from 'mongoose';

// import router from './routers/index.js';

// const app = express();

// app.use(
//   cors({
//     credentials: true,
//   })
// );

// app.use(compression());
// app.use(cookieParser());
// app.use(bodyParser.json());

// const server = http.createServer(app);

// server.listen(8080, () => {
//   console.log('Server running on http://localhost:8080/');
// });

// const MONGO_URL =
//   'mongodb+srv://joeyrjtd:xARCNPuc0zHRBjml@cluster0.hx17crl.mongodb.net/?retryWrites=true&w=majority';

// mongoose.Promise = Promise;
// mongoose.connect(MONGO_URL);
// mongoose.connection.on('error', (error) => console.log(error));

// app.use('/', router());
