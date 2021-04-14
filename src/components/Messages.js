import { useSelector } from "react-redux";

import { getMessages } from "../redux/messages";

const Messages = () => {
  const messages = useSelector(getMessages);
  return (
    <table className="table table-striped table-bordered my-4">
      <tbody>
        {messages.map((message, index) => (
          <tr key={`msg-${index}`}>
            <td>{message}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Messages;
