import {useEffect, useState} from 'react';
import { BeatLoader } from "react-spinners";
import { useVaultContract } from "../../contexts/ContractContext"
import { useAccount } from "../../contexts/AccountContext"
import ERC20Token from '../../utils/ERC20Token';

function Balances(props) {
  const { contract, loading } = useVaultContract();
  const { account } = useAccount();

  useEffect(() => {
    if (!loading) {
      async function getUserBalance() {
        try {
          const tokenContract = new ERC20Token(process.env.NEXT_PUBLIC_W3D_STABLE_VAULT_ADDRESS);
          const balance = await tokenContract.balanceOf(account);
          console.log("balance", balance.toString());
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