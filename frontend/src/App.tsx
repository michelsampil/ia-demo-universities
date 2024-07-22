import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import GlobalStyle from "./styles/GlobalStyle";
import Login from "./components/Login";
import Home from "./components/Home";
import Ranking from "./components/Ranking";
import Game from "./components/Game";
import PrivateRoute from "./router/PrivateRoute";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <GlobalStyle />
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/game" element={<Game />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
