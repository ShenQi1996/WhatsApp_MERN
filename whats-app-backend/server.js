// inporting
import express from "express";
import mongoose from "mongoose";
import Messages from "./Schema/dbMessages.js";
// for node to use import intead of require needs to go into package.json and under main add "type": "module"

// app config
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json()); // without this data will only be the _id.    with this changes to a json object

// DB config
const connection_url = `mongodb+srv://admin:I9JHj5cypFGoaTL2@cluster0.atkz6.mongodb.net/whatsappdb?retryWrites=true&w=majority`;
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// ????

// api routes
app.get("/", (req, res) => res.status(200).send("Hello World"));

app.get(`/messages/sync`, (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post(`/messages/new`, (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

// listen

app.listen(port, () => console.log(`Listening on localhost: ${port}`));
