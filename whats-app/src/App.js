import "./App.css";
import Chat from "./component/chat/Chat";
import Sidebar from "./component/sidebar/Sidebar";
import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import axios from "./axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    axios.get("messages/:roomId/sync").then(res => {
      setMessages(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get("rooms").then(res => {
      setRooms(res.data);
    });
  }, []);

  useEffect(() => {
    const pusher = new Pusher("f23f7c175905dbb04c71", {
      cluster: "us2",
    });

    const channel = pusher.subscribe("rooms");
    channel.bind("inserted", data => {
      setRooms([...rooms, data]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [rooms]);

  useEffect(() => {
    const pusher = new Pusher("f23f7c175905dbb04c71", {
      cluster: "us2",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", data => {
      setMessages([...messages, data]);
    });

    // clean up function
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  return (
    <div className="app">
      <div className="app__body">
        <Router>
          <Sidebar rooms={rooms} />
          <Routes>
            <Route
              path="/rooms/:roomId"
              element={<Chat messages={messages} />}
            />
            <Route path="/" element={<Chat messages={messages} />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;

// in the component use ctrl + spacebar to auto import
