import { useSelector } from "react-redux";
import { ROLE } from "../redux/stateConstants";
import { useEffect, useState } from "react";
import { getUsers } from "../redux/users";

const GuesserWaitingModal = () => {
  const users = useSelector(getUsers);
  const [drawer, setDrawer] = useState("");

  useEffect(() => {
    let newDrawer = null;
    Object.keys(users).map((key, i) => {
      if (users[key].role === ROLE.DRAWER) {
        newDrawer = users[key].username;
      }
      return null;
    });

    setDrawer(newDrawer);
  }, [users]);

  return (
    <div className="modal-body loading">
      <h1>{drawer + " is choosing a word."}</h1>
      <p>Please wait...</p>
      <div className="spinner-border text-info" role="status" />
    </div>
  );
};

export default GuesserWaitingModal;
