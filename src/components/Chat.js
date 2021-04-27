import Messages from "./Messages";
import MessageForm from "./MessageForm";

const Chat = () => {
  return (
    <div className="card">
      <div className="card-header text-center">Chat</div>
      <div className="card-body p-0">
        <Messages />
      </div>
      <div className="card-footer">
        <MessageForm />
      </div>
    </div>
    // <>
    //   <div className="chat">
    //     <div className="chat-header">
    //       <div>
    //         <strong>Chat</strong>
    //       </div>
    //     </div>
    //     <Messages />
    //     <MessageForm />
    //   </div>
    // </>
  );
};

export default Chat;
