import {useEffect, useState} from 'react';
import { BeatLoader } from "react-spinners";
import { useVaultContract } from "../../contexts/ContractContext"
import { useAccount } from "../../contexts/AccountContext"

import ERC20Token from '../../utils/ERC20Token';

// TODO: Why the Vault balance of developer paid is 0 after be paid here but tests are running fine? Change the fakeStable to Vault 

function Balances(props) {
  const { contract, loading } = useVaultContract();
  const { account } = useAccount();

  useEffect(() => {
    if (!loading) {
      async function getUserBalance() {
        try {
          const myToken = new ERC20Token("0x34b179eCC554DE9bdBC9736E5E3E804e8318D8f3");
          const balance = await myToken.getBalance(account);
          console.log("balance", balance)
        } catch (error) {
          console.error(error);
        }
      }
  
      getUserBalance();
    }
  }, [loading]); 

  if (loading) {
      return (
        <div className="loading-overlay">
          <div className="sweet-loading">
            <BeatLoader loading={loading} size={50} />
          </div>
        </div>
      );
  }

  return (
    <div>
      <h1>Balances</h1>
      <p>List of Balances</p>
    </div>
  );
}

export default Balances;