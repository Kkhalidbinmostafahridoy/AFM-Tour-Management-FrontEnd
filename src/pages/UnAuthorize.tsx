import { Button } from "@/components/ui/button";
import { Link } from "react-router";

function unAuthorize() {
  return (
    <div className="unauthorized">
      <h1>Unauthorized</h1>
      <Link to="/">
        <Button>Home</Button>
      </Link>
    </div>
  );
}

export default unAuthorize;
