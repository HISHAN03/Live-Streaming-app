import {GoogleLogout, Googlelogin} from "react-google-login";
const cliendId="1064538177379-bjr5kdphshesmc3obqdp27ujbqeo5hh5.apps.googleusercontent.com";


function logout()
{
    const onSucess=()=>
    {
        console.log("Log out Sucessfull");
    }
    return(
        <div id="SignOutButton">
            <GoogleLogout clientId="{cliendId}" buttonText="Logout" onLogoutSuccess={onSucess} />
        </div> 
    )
}


export default logout;