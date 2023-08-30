import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import UserRegistry from '../../contracts/UserRegistry.json';
import { css } from "@emotion/react";
import { BeatLoader } from "react-spinners";
import SignInForm from '../SignInForm/SignInForm';

const contractABI = UserRegistry.abi;
const contractAddress = '0xd1be7ff959fE7Bc8E45F4432546C9D387C3836f4';

const override = css`
  display: block;
  margin: 0 auto;
`;

//TODO: Colocar o css em outro arquivo e organizar a estilização;

function UserCheck(props) {
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      async function checkUserRegistration() {
        try {
          // Verificar se o provedor Ethereum está presente
          if (window.ethereum) {
            // Conectar à blockchain usando o provedor Ethereum
            const web3 = new Web3(window.ethereum);
  
            // Criar uma instância do contrato usando o endereço e o ABI
            const contract = new web3.eth.Contract(contractABI, contractAddress);
  
            // Verificar se o usuário está registrado
            await contract.methods.getUser(props.userAddress).call();
            setIsRegistered(true);
          } else {
            console.error('Provedor Ethereum não encontrado!');
          }
        } catch (error) {
          if (error.message.includes('User not found')) {
            setIsRegistered(false);
          } else {
            console.error(error);
          }
        } finally {
          setIsLoading(false);
        }
      }
  
      checkUserRegistration();
    }, [props.userAddress]);
  
    if (isLoading) {
        return (
          <div className="sweet-loading">
            <BeatLoader color={"#36D7B7"} loading={isLoading} css={override} size={20} />
          </div>
        );
    }
  
    if (isRegistered) {
      return <>{props.privateRoute}</>;
    }
  
    return <>{<SignInForm />}</>;
  }
  
  export default UserCheck;  