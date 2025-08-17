import { Link } from "react-router";

function unAuthorize() {
  return (
    <div className="unauthorized">
      <h1>Unauthorized</h1>
      <Link to="/">Home</Link>
    </div>
  );
}

export default unAuthorize;
