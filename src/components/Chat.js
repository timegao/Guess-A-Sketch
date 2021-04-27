import Messages from "./Messages";
import MessageForm from "./MessageForm";

const Chat = () => {
  return (
    // <div className="card">
    //   <div className="card-header text-center">Chat</div>
    //   <div className="card-body p-0">
    //     <Messages />
    //   </div>
    //   <div className="card-footer">
    //     <MessageForm />
    //   </div>
    // </div>
    <div className="row">
      <div className="text-center">Chat</div>
      <div className="justify-content-center p0">
        <Messages />
      </div>
      <div className="justify-content-center p0">
        <MessageForm />
      </div>
    </div>
  );
};

export default Chat;
