import { useSelector } from "react-redux";
import { MESSAGE_TYPE } from "../redux/stateConstants";
import { getMessages } from "../redux/messages";
import ReactScrollableFeed from "react-scrollable-feed";

const generateMessage = ({ username, text, type }) => {
  switch (type) {
    case MESSAGE_TYPE.JOIN:
      return (
        <td className="text-secondary">
          <strong>{text}</strong>
        </td>
      );
    case MESSAGE_TYPE.ANSWER:
    case MESSAGE_TYPE.CORRECT:
      return (
        <td className="text-success">
          <strong>{text}</strong>
        </td>
      );
    case MESSAGE_TYPE.GAME_OVER:
    case MESSAGE_TYPE.LEAVE:
      return (
        <td className="text-danger">
          <strong>{text}</strong>
        </td>
      );
    case MESSAGE_TYPE.CLOSE_GUESS:
      return (
        <td className="text-info">
          <strong>{text}</strong>
        </td>
      );
    default:
      return (
        <td>
          <strong>{username}: </strong>
          {text}
        </td>
      );
  }
};

const Messages = () => {
  const messages = useSelector(getMessages);
  return (
    <div className="chat-table">
      <ReactScrollableFeed forceScroll>
        <table className="table table-striped table-bordered">
          <tbody>
            {messages.map((message, index) => (
              <tr key={`msg-${index}`}>{generateMessage(message)}</tr>
            ))}
          </tbody>
        </table>
      </ReactScrollableFeed>
    </div>
  );
};

export default Messages;
