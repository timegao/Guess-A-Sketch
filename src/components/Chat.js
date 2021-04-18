import { useState } from "react";
import { useDispatch } from "react-redux";
import { newMessage } from "../redux/actions";
import Messages from "./Messages";
import MessageForm from "./MessageForm";

const Chat = () => {
  return (
    <div className="card">
      <div className="card-header text-center">Chat</div>
      <div className="card-body p-0">
        <Messages />
      </div>
      <div class="card-footer">
        <MessageForm />
      </div>
    </div>
  );
};

export default Chat;
