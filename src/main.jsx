// src/index.js

import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles

import ReactDOM from "react-dom";
import App from "./App";

const root = document.getElementById("root");

// Use createRoot instead of ReactDOM.render
const rootElement = ReactDOM.createRoot(root);
rootElement.render(<App />);

