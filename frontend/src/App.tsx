import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import GlobalStyle from "./styles/GlobalStyle";
import Home from "./components/Home";
import Ranking from "./components/Ranking";
import Game from "./components/Game";
import PrivateRoute from "./router/PrivateRoute";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <GlobalStyle />
        {/* <Navbar /> */}
        <Routes>
          <Route path="/signup" element={<SignUp />} />
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
