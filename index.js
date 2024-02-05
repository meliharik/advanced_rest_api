const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/database.js');
const Auth = require('./routes/auth.js');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({limit: '30mb', extended: true}));
app.use(express.urlencoded({limit: '30mb', extended: true}));

app.use('/', Auth);

app.get('/', (req, res) => {
      res.json({ message: 'Hello World' });
})


const port = process.env.PORT || 3000;

db()

app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
})