import { Cancel, Room } from "@material-ui/icons"
import axios from "axios"
import { useRef, useState } from "react"
import "./login.css"

export default function Login({setshowLogin, myStorage, setCurrentUser}) {
    const [error, setError] = useState(false)

    const nameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = {
            username: nameRef.current.value,
            password: passwordRef.current.value,
        };

        try {
            const res = await axios.post("/users/login", user);
            myStorage.setItem("user", res.data.username)
            setCurrentUser(res.data.username)
            setshowLogin(false)
            setError(false);
        } catch (error) {
            setError(true);
        }
    };

    return (
        <div className="loginContainer">
            <div className="logo">
                <Room />
                LamaPin
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" ref={nameRef}/>
                <input type="password" placeholder="Password" ref={passwordRef}/>
                <button className="loginBtn">Login</button>
                {error && <span className="failure">Something went wrong!</span>}
            </form>
            <Cancel className="loginCancel" onClick={() => setshowLogin(false)}/>
        </div>
    )
}