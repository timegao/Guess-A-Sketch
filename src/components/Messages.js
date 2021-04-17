import { useSelector } from "react-redux";
import {MESSAGE_TYPE} from '../redux/stateConstans'
import { getMessages } from "../redux/messages";

const generateMessage = ({username, text, type}) => {
  switch (type) {
    case MESSAGE_TYPE.JOIN:
      return <td className="text-secondary"><strong>{text}</strong></td>;
    case MESSAGE_TYPE.ANSWER:
    case MESSAGE_TYPE.CORRECT:
      return <td className="text-success"><strong>{text}</strong></td>;
    case MESSAGE_TYPE.GAME_OVER:
    case MESSAGE_TYPE.LEAVE:
      return <td className="text-danger"><strong>{text}</strong></td>;
    default: // MESSAGE_TYPE.REGULAR
      return <td><strong>{username}:</strong>{text}</td>;
  }
}

const Messages = () => {
  const messages = useSelector(getMessages);
  return (
    <table className="table table-striped table-bordered my-4">
      <tbody>
        {messages.map((message, index) => (
          <tr key={`msg-${index}`}>
            {generateMessage(message)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Messages;
