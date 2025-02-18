import { Component, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate, Route } from "react-router-dom";

const AuthenticatedRoute = ({ children }) => {
    const { state } = useContext(AuthContext);
    console.log('auth route state:', state)
    return state.isAuth ? children : <Navigate to="/login" />
}

export default AuthenticatedRoute;