import { Avatar, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import React, { useState } from "react";
import axios from "../../axios";
import "./Chat.css";
import { useParams } from "react-router";

const Chat = ({ messages }) => {
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const sendMessage = async e => {
    e.preventDefault();
    await axios.post("/messages/:roomId/new", {
      message: input,
      name: "Kenny",
      timestamp: new Date().toTimeString(),
      received: true,
      roomId: roomId,
    });
    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar />
        <div className="chat_headerInfo">
          <h3>Room name</h3>
          <p>Last see at...</p>
        </div>

        <div className="chat_headerRight">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="chat_body">
        {messages.map((message, key) => (
          <p
            key={key}
            className={`chat_message ${message.received && "chat_reciever"}`}
          >
            <span className="chat_name">{message.name} </span>
            {message.message}
            <span className="chat_timestamp"> {message.timestamp}</span>
          </p>
        ))}
      </div>

      <div className="chat_footer">
        <InsertEmoticonIcon />
        <form>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
};

export default Chat;
