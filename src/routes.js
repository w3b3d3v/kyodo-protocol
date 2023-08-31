// routes.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import AddAgreement from "./components/AddAgreement/AddAgreement";
import UserCheck from './components/UserCheck/UserCheck';

function Layouts(props) {
  return (
    <Routes>
      <Route
        path="/"
        element={<UserCheck userAddress={props.account} />}
      />
      <Route
        path="/agreementslist"
        element={<UserCheck userAddress={props.account} />}
      />
      <Route
        path="/addagreement"
        element={<AddAgreement userAddress={props.account} />}
      />
    </Routes>
  );
}

export default Layouts;
