// routes.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import AddAgreement from "./components/AddAgreement/AddAgreement";
import UserCheck from './components/UserCheck/UserCheck';
import { ContractProvider } from './ContractContext'; 

function Layouts(props) {
  return (
    <ContractProvider>
      <Routes>
        <Route
          path="/"
          element={<UserCheck />}
        />
        <Route
          path="/agreementslist"
          element={<UserCheck />}
        />
        <Route
          path="/addagreement"
          element={<AddAgreement />}
        />
      </Routes>
    </ContractProvider>
  );
}

export default Layouts;
