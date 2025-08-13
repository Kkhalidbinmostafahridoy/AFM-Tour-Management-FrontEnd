import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

function Verify() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email] = useState(location.state);

  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email]);
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-4">Verify Your Account</h1>
        <p className="mb-6">
          Please check your email for the verification link.
        </p>
        <p>
          If you haven't received an email, please check your spam folder or
          request a new verification link.
        </p>
      </div>
    </div>
  );
}

export default Verify;
