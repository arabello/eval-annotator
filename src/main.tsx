import { Docs, Home } from "@/routes";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "@/index.css";

// Only use the basename in production (GitHub Pages)
const isProduction = import.meta.env.PROD;
const basename = isProduction ? "/eval-annotator" : undefined;

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <BrowserRouter basename={basename}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/docs" element={<Docs />} />
    </Routes>
  </BrowserRouter>,
);
