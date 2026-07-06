import { useNavigate } from "react-router-dom";

export default function Index() {
    const navigate = useNavigate();
    return(
        <div>
            <h1>Navigation</h1>
            <button onClick={() => navigate("/student")}>Go to Student</button>
            <button onClick={() => navigate("/staff")}>Go to Staff</button>
        </div>
    );

}