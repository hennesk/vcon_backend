const express = require("express");
const { exec } = require("child_process");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = process.argv[2] || process.env.API_PORT || 3000;
const secret = process.argv[3] || process.env.API_SECRET || uuidv4();

function checkSecret(key) {
  return (key == secret);
}

app.get("/status/:key", (req, res) => {
  if (checkSecret(req.params.key)) {
    exec("bash get_status.sh", (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        res.sendStatus(500);
        return;
      }
      res.send(`${stdout}`);
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  } else {
    res.sendStatus(404);
  } 
});

app.get("/up/:key", (req, res) => {
  if (checkSecret(req.params.key)) {
    exec("bash start.sh", (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        res.sendStatus(500);
        return;
      }
      res.send('Starting.');
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  } else {
    res.sendStatus(404);
  }  
});

app.get("/down/:key", (req, res) => {
  if (checkSecret(req.params.key)) {
    exec("bash stop.sh", (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        res.sendStatus(500);
        return;
      }
      res.send('Stopping.');
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  } else {
    res.sendStatus(404);
  }  
});

app.listen(port, () => {
  console.log(`Secret: ${secret}`);
  console.log(`API listening on ${port}`);
});
