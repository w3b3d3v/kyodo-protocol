// routes.js
import React from "react";
import { Route, Routes} from "react-router-dom";
import AddAgreement from "./components/AddAgreement/AddAgreement";
import UserCheck from './components/UserCheck/UserCheck';
import AgreementList from './components/AgreementList/AgreementList';

//TODO: Props should not be agreementContract

function AgreementsList(props) {
  return (
    <div>
      <AgreementList agreementContract={props.account} />
    </div>
  );
}

const Layouts = (props) => {
  return (
    <Routes>
      <Route
        exact
        path="/"
        element={
          <UserCheck
            userAddress={props.account}
            privateRoute={<AgreementsList />}
          />
        }
      />
      <Route
        path="/agreementslist"
        element={
          <UserCheck
            userAddress={props.account}
            privateRoute={<AgreementsList />}
          />
        }
      />
      <Route
        path="/addAgreement"
        element={
          <UserCheck
            userAddress={props.account}
            privateRoute={<AddAgreement />}
          />
        }
      />
    </Routes>
  );
};
 
export default Layouts;
