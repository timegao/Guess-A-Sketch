const Loading = (props) => {
  return (
    <div className="modal-body loading">
      <h1>{props.msg}</h1>
      <p>Loading... please wait</p>
      <div className="spinner-border text-info" role="status" />
    </div>
  );
};

export default Loading;
