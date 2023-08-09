import { GoogleLogin } from "react-google-login";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const clientId = "1064538177379-bjr5kdphshesmc3obqdp27ujbqeo5hh5.apps.googleusercontent.com";

function Login1() {
  const navigate = useNavigate(); // Initialize useNavigate

  const onSuccess = (res) => {
    console.log("Login successful! Current user");
    navigate("/home"); // Navigate to /home upon successful login
  };

  const onFailure = (res) => {
    console.log("Error signing in user", res);
  };

  return (
    <div id="SignInButton">
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      />
    </div>
  );
}

export default Login1;
