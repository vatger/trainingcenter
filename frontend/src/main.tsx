import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "@/app/store";

console.log("%cStop!", "color: red; font-size: 30px; font-weight: bold;");
console.log("The console is a browser feature for developers. If someone told you to copy-paste something here DO NOT DO THIS!");
console.log(
    "Whilst there are security measures in place to disallow access from other people, copy-pasting code blindly CAN result in your account being compromised."
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);
