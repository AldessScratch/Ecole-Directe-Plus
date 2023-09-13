
import { useRouteError } from "react-router-dom";

import Error404 from "./Error404";
import "./ErrorPage.css";

export default function ErrorPage() {
    const error = useRouteError();

    function safetyFunction() {
        console.log("safety function | reset")
        localStorage.clear()
    }
    
    if (process.env.NODE_ENV !== "development") {
        safetyFunction();
    }

    if (error.status === 404) {
        return (
            <Error404 />
        );
    }
    else {
        return (
            <div id="error-page">
                <h1>Oops!</h1>
                <p>Sorry, an unexpected error has occurred.</p>
                <p>
                    <i>{error.toString()}</i>
                </p>
            </div>
        );
    }
} 