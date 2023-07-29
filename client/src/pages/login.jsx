import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components"


export default function Login(){
  

    const navigate = useNavigate();


    const [auth, setAuth] = useState({
        username: null,
        password: null,
    })
    const [msg, setMsg] = useState("");

    const handelSubmit = async (e) => {
        e.preventDefault();
        let { username, password } = auth;

        //payload
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
        let res = await fetch("http://localhost:3010/login", options);

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
                <h1>Welcome Back!</h1>
                <form>
                    <input type="text" name="username" id="email" placeholder="Username" onChange={handelInputChange}/>
                    <input type="password" name="password" id="password" placeholder="Password" onChange={handelInputChange}/>
                    <button onClick={handelSubmit}>Login</button>
                    <Link to={"../signup"}><p>New User? Signup</p></Link>
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