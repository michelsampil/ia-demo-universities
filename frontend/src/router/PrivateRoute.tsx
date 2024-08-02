import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute: React.FC = () => {
  const { user } = useContext(AuthContext)!;

  return user ? <Outlet /> : <Navigate to="/signup" />;
};

export default PrivateRoute;
