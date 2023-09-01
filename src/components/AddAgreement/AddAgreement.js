import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Web3 from 'web3';
import "./AddAgreement.css";
import { BeatLoader } from "react-spinners";
import tokens from '../assets/allowedTokens.json';

import AgreementContract from '../../contracts/AgreementContract.json';
const contractABI = AgreementContract.abi;
const contractAddress = '0x6372E5d03FFecb03cC1688776A57B8CA4baa2dEd';

function AddAgreementForm(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [developer, setDeveloper] = useState("");
  const [skills, setSkills] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentToken, setPaymentToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    // Check if any required fields are empty
    if (
      title.trim() === "" ||
      description.trim() === "" ||
      developer.trim() === "" ||
      skills.trim() === "" ||
      !paymentAmount ||
      !paymentToken
    ) {
      alert("Please fill in all fields.");
      return;
    }

    // Call the function to add an agreement
    await addAgreement();
  }

  async function addAgreement() {
    setIsLoading(true);

    if (window.ethereum) {
      // Conectar à blockchain usando o provedor Ethereum
      const web3 = new Web3(window.ethereum);
    
      // Criar uma instância do contrato usando o endereço e o ABI
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      try {
        const tx = await contract.methods.createAgreement(
          title,
          description,
          developer,
          skills.split(","),
          paymentAmount * 10 ** paymentToken.decimals,
          paymentToken.address
        ).send({ from: window.ethereum.selectedAddress });
      
        console.log(`Agreement "${title}" created. Transaction hash: ${tx.transactionHash}`);
        setTransactionHash(tx.transactionHash);
      } catch (error) {
        console.error('Error creating agreement:', error);
      }

      setIsLoading(false);

      // Clear the form inputs after adding an agreement
      setTitle("");
      setDescription("");
      setDeveloper("");
      setSkills("");
      setPaymentAmount("");
      setPaymentToken("");
    }
  }

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="sweet-loading">
          <BeatLoader loading={isLoading} size={50} />
        </div>
      </div>
    );
}

  if (transactionHash) {
    return (
      <div className="transaction-info">
        Agreement created!
        <br />
        <br />
        <a
          href={`https://mumbai.polygonscan.com/tx/${transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          See Transaction
        </a>
        <br />
        <br />
        {/* <Link to="/agreementslist">View Agreements List</Link> */}
      </div>
    );
  }

  return (
    <div className="add-agreement-form-container">
        <form className="add-agreement-form" onSubmit={handleSubmit}>
        <label htmlFor="title-input">Title:</label>
        <input
          type="text"
          id="title-input"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
    
        <label htmlFor="description-input">Description:</label>
        <input
          type="text"
          id="description-input"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
    
        <label htmlFor="developer-input">Developer:</label>
        <input
          type="text"
          id="developer-input"
          value={developer}
          onChange={(event) => setDeveloper(event.target.value)}
        />
    
        <label htmlFor="skills-input">Skills:</label>
        <input
          type="text"
          id="skills-input"
          value={skills}
          onChange={(event) => setSkills(event.target.value)}
        />

        <label htmlFor="payment-token-input">Payment Token:</label>
        <select
          id="payment-token-input"
          value={paymentToken ? paymentToken.address : ''}
          onChange={(event) => {
            const selectedTokenAddress = event.target.value;
            const selectedToken = tokens.find(token => token.address === selectedTokenAddress);
            setPaymentToken(selectedToken);
          }}
          className="select-input"
        >
          <option value="">Selecione um token</option>
          {tokens.map(token => (
            <option key={token.address} value={token.address} className="token-option">
              {token.name}
            </option>
          ))}
        </select>


        <label htmlFor="payment-amount-input">Payment Amount:</label>
        <input
          type="number"
          id="payment-amount-input"
          value={paymentAmount}
          onChange={(event) => setPaymentAmount(event.target.value)}
        />

        <button type="submit" className="add-agreement-form-button">
          <FaPlus />
        </button>
      </form>
    </div>
  );
}

export default AddAgreementForm;
