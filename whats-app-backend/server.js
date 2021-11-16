// inporting
import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher";
import cors from "cors";
import Room from "./Schema/dbRooms.js";
import Messages from "./Schema/dbMessages.js";

// for node to use import intead of require needs to go into package.json and under main add "type": "module"

// app config
const app = express();
const port = process.env.PORT || 5000;

const pusher = new Pusher({
  appId: "1297798",
  key: "f23f7c175905dbb04c71",
  secret: "5c0b4aa93bee2f5e5d00",
  cluster: "us2",
  useTLS: true,
});

// middleware
app.use(express.json()); // without this data will only be the _id.    with this changes to a json object

app.use(cors());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   next();
// });

// DB config
const connection_url = `mongodb+srv://admin:I9JHj5cypFGoaTL2@cluster0.atkz6.mongodb.net/whatsappdb?retryWrites=true&w=majority`;
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("DB connected");
  const messageCollection = db.collection("messagecontents");
  const roomCollection = db.collection("rooms");
  const RoomchangeStream = roomCollection.watch();
  const MessageChangeStream = messageCollection.watch();
  // which collection is watching

  MessageChangeStream.on("change", change => {
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        _id: messageDetails._id,
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
      console.log("I am in side");
      console.log(change.fullDocument);
    } else {
      console.log("Error triggering pusher");
    }
  });

  RoomchangeStream.on("change", change => {
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("rooms", "inserted", {
        _id: messageDetails._id,
        roomname: messageDetails.roomname,
        messages: messageDetails.messages,
      });
    } else {
      console.log("Error triggering pusher");
    }
  });
});
// ????

// api routes
app.get("/", (req, res) => res.status(200).send("Hello World"));

//message
app.get(`/messages/:roomId/sync`, (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post(`/messages/:roomId/new`, (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

//rooms

app.post(`/rooms/new`, (req, res) => {
  const roomName = req.body;
  Room.create(roomName, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/rooms", (req, res) => {
  Room.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.patch("/rooms/:roomId", (req, res) => {
  Room.findById(req.params.roomId, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      data.messages = req.body.messages;
      data.save();
      res.status(200).send(data);
    }
  });
});
// listen

app.listen(port, () => console.log(`Listening on localhost: ${port}`));
