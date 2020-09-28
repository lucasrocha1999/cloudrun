const express = require('express');
const download = require('download-git-repo');
const { promisify } = require('util');
const rimraf = require('rimraf');
const fs = require('fs').promises;
const { uuid } = require('uuidv4');
const { runCLI } = require('jest');
const { exec } = require('child_process');

const app = express();

const runCommand = promisify(exec);
const downloadRepo = promisify(download);
const deleteFolder = promisify(rimraf);

app.get('/', async (req, res) => {
  const uniqueID = uuid();

  await Promise.all([
    downloadRepo('github:lucasrocha1999/serverless-challange-template', `./tmp/template-${uniqueID}`),
    downloadRepo('github:OmnistackJS/serverless-challange-template', `./tmp/code-${uniqueID}`),
  ]);

  await Promise.all([
    deleteFolder(`./tmp/code-${uniqueID}/__tests__`),
    fs.unlink(`./tmp/code-${uniqueID}/jest.config.js`),
  ]);

  await Promise.all([
    fs.rename(
      `./tmp/template-${uniqueID}/__tests__`,
      `./tmp/code-${uniqueID}/__tests__`
    ),
    fs.rename(
      `./tmp/template-${uniqueID}/jest.config.js`,
      `./tmp/code-${uniqueID}/jest.config.js`,
    ),
  ]);

  await deleteFolder(`./tmp/template-${uniqueID}`);

  // Install dependencies

  await runCommand(`cd ./tmp/code-${uniqueID} && yarn`);

  // Run Jest

  const result = await runCLI({
    json: true,
    silent: true,
    reporters: [],
  }, [`./tmp/code-${uniqueID}`]);

  await deleteFolder(`./tmp/code-${uniqueID}`);

  return res.json(result.results);
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log('Hello world listening on port', port);
});

module.exports = app;
