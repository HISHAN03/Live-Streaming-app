import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components"
import Login1 from "../components/login";
import Logout from "../components/logout";
import {gapi} from "gapi-script";
const cliendId="1064538177379-bjr5kdphshesmc3obqdp27ujbqeo5hh5.apps.googleusercontent.com";


export default function Login(){
    // useEffect(()=>
    // {
    //   function start()
    //   {
    //     gapi.clien.init({
    //       cliendId:cliendId,
    //       scope:""
    //     })
    //   }
    //   gapi.load('client:auth2',start);
    // })
    const navigate = useNavigate();
    useEffect(() => {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="));
    
        if (token) {
          
          navigate("/home"); // Replace "/home" with the desired URL of your home page
        }
      }, [navigate]);
      
    const [auth, setAuth] = useState({
        username: null,
        password: null,})
    const [msg, setMsg] = useState("");
    const handelSubmit = async (e) => {
        e.preventDefault();
        let { username, password } = auth;
        let data = {
            "username": username,
            "password": password,
        };
    let options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(data),
            credentials: 'include'
        }
        let res = await fetch("http://localhost:3100/login", options);

        let output = await res.json();

        if("message" in output){
            setMsg(output.message + " !!")
            
        }
        if ("message" in output && output.message === "Login successful") {
            navigate("/home"); 
          }
    }

    const handelInputChange = (e) => {
        setMsg("");
        setAuth({...auth, [e.target.name] : e.target.value});
    }

    return(
        <StyledDiv>
            <div>
                <span id="modal"style={{color : "lightcoral", opacity: (msg == "")? "0" : "1"}}>{msg}</span>
                <h1>Live-Streeming-App</h1>
                <h2>Welcome Back!</h2>
                <form>
                    <input type="text" name="username" id="email" placeholder="Username" onChange={handelInputChange}/>
                    <input type="password" name="password" id="password" placeholder="Password" onChange={handelInputChange}/>
                    <button onClick={handelSubmit}>Login</button>
                    <Link to={"../signup"}><p>New User? Signup</p></Link>
                    <Login1 />
                    <Logout />
                </form>
            </div>
        </StyledDiv>
    )
}

const StyledDiv = styled.div`
    width: 100%;
    height: calc(100vh - 60px);
    display: flex;
    justify-content: center;
    align-items:center;
    padding: 10px;

    div{
        width:30vw;

        h1{
            text-align: center;
            margin: 30px 20px;
        }
        form{
            display:flex;
            flex-direction:column;
            gap:15px;

            p{
                color: grey;
                text-align: center;
            }
        }
    }
`