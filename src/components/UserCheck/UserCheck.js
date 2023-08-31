import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { css } from "@emotion/react";
import { BeatLoader } from "react-spinners";

import AgreementContract from '../../contracts/AgreementContract.json';
import AddAgreement from "../AddAgreement/AddAgreement";
import AgreementList from '../AgreementList/AgreementList';

const contractABI = AgreementContract.abi;
const contractAddress = '0x4C3073be445B97121ceE882D39299169fb22e1e5';

const override = css`
  display: block;
  margin: 0 auto;
`;

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
  
                    // Verificar se o usuário possui acordos
                    const userAgreementIds = await contract.methods.getUserAgreements(window.ethereum.selectedAddress).call();

                    // Defina isRegistered como verdadeiro se o usuário tiver acordos
                    setIsRegistered(userAgreementIds.length > 0);
                } else {
                    console.error('Provedor Ethereum não encontrado!');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
  
        checkUserRegistration();
    }, []);
  
    if (isLoading) {
        return (
            <div className="sweet-loading">
                <BeatLoader color={"#36D7B7"} loading={isLoading} css={override} size={20} />
            </div>
        );
    }
  
    if (isRegistered) {
        return <AgreementList />;
    } else {
      return <AddAgreement />;
    }
}

export default UserCheck;
