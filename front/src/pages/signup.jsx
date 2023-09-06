import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components"


export default function Login() 
{
  
    const navigate = useNavigate();
    useEffect(() => {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="));
    
        if (token) {
          
          navigate("/home"); 
        }
      }, [navigate]);
 

    const [auth, setAuth] = useState({
        username: null,
        email: null,
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
        let res = await fetch("http://localhost:3010/signup", options);

        // get the output as a responce from the server
        let output = await res.json();
        console.log(output)

        if("message" in output){
            setMsg(output.message + " !!")
        }
        
      
    }

    const handelInputChange = (e) => {
        setAuth({ ...auth, [e.target.name]: e.target.value });
    }

    return (
        <StyledDiv>
            <div>
            <span id="modal"style={{color : "lightcoral", opacity: (msg == "")? "0" : "1"}}>{msg}</span>
            <h1>Live-Streeming-App</h1>
                <form>
                    <input type="text" name="username" placeholder="Username" onChange={handelInputChange} />
                    <input type="text" name="email" placeholder="Email" onChange={handelInputChange} />
                    <input type="password" name="password" placeholder="Password" onChange={handelInputChange} />
                    <button onClick={handelSubmit}> Create an Account</button>
                    <Link to={"../login"}><p>Already have an account? Login</p></Link>
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
            gap: 15px;

            p{
                color: grey;
                text-align: center;
            }
        }
    }
`