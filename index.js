// [START run_helloworld_service]
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const name = 'World';
  res.send(`Hello ${name}!`);
});

const port = 8080;
app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});
// [END run_helloworld_service]

// Exports for testing purposes.
module.exports = app;
