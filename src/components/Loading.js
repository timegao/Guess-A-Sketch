const Loading = (props) => {
  return (
    <div className="loading add-form">
      <h1>{props.msg}</h1>
      <p>Loading... please wait</p>
      <div className="spinner-border text-info" role="status" />
    </div>
  );
};

export default Loading;
