require("dotenv").config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const routes = require('./routes');

app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
