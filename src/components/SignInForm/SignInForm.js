import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import UserRegistry from '../../contracts/UserRegistry.json';

import { css } from "@emotion/react";
import { BeatLoader } from "react-spinners";
const override = css`
  display: block;
  margin: 0 auto;
`;

//TODO: Colocar o css em outro arquivo e organizar a estilização;

function SignInForm() {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const web3 = new Web3(window.ethereum);
    const contractAddress = '0xd1be7ff959fE7Bc8E45F4432546C9D387C3836f4';
    const contractABI = UserRegistry.abi;
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const accounts = await web3.eth.requestAccounts();
    const account = accounts[0];

    await contract.methods.register(name, whatsapp).send({ from: account})
      .on('receipt', () => {
        setIsLoading(false);
        navigate('/home');
      });
  };

  return (
    <div>
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={isLoading}>
          <label>
            Nome:
            <input type="text" name="name" value={name} onChange={(event) => setName(event.target.value)} disabled={isLoading} />
          </label>
          <label>
            Whatsapp:
            <input type="text" name="whatsapp" value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} disabled={isLoading} />
          </label>
          {
            isLoading ? 
              <div className="sweet-loading">
                <BeatLoader color={"#36D7B7"} loading={isLoading} css={override} size={20} />
              </div> 
            : null
          }
          <button type="submit" disabled={isLoading}>Cadastrar</button>
        </fieldset>
      </form>
    </div>
  );
}

export default SignInForm;
