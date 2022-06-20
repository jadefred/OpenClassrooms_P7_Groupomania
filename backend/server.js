const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./database/database.js');

app.use(cors());
app.use(express.json());

app.listen(8080, () => {
  console.log('Server has started on port 8080');
});
