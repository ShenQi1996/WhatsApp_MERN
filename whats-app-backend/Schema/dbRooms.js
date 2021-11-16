import mongoose from "mongoose";

const whatsappSchema = mongoose.Schema({
  roomname: String,
  messages: Array,
});

export default mongoose.model("rooms", whatsappSchema);
