import { Avatar } from "@mui/material";
import React, { useState, useEffect } from "react";
import "./SidebarChat.css";
import axios from "../../axios";
const SidebarChat = ({ addNewChat, room }) => {
  const [seed, setSeed] = useState("");

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 100));
  }, []);

  const createChat = async e => {
    e.preventDefault();
    const roomName = prompt("Please enter name for chat");

    if (roomName) {
      await axios.post("/rooms/new", {
        roomname: roomName,
        messages: [],
      });
    }
  };
  return !addNewChat ? (
    <div key={room._id} className="sidebarChat">
      <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
      <div className="sidebarChat_info">
        <h2>{room.roomname}</h2>
        {room.messages.map((ele, key) => (
          <p key={key}>{ele}</p>
        ))}
      </div>
    </div>
  ) : (
    <div className="sidebarChat" onClick={createChat}>
      <h2>Add new Chat</h2>
    </div>
  );
};

export default SidebarChat;
