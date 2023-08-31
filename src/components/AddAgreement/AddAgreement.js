import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Web3 from 'web3';
import "./AddAgreement.css";
import { BeatLoader } from "react-spinners";


import AgreementContract from '../../contracts/AgreementContract.json';
const contractABI = AgreementContract.abi;
const contractAddress = '0x4C3073be445B97121ceE882D39299169fb22e1e5';

function AddAgreementForm(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [developer, setDeveloper] = useState("");
  const [skills, setSkills] = useState("");
  const [incentiveAmount, setIncentiveAmount] = useState("");
  const [incentiveToken, setIncentiveToken] = useState("");
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
      incentiveAmount.trim() === "" ||
      incentiveToken.trim() === "" ||
      paymentAmount.trim() === "" ||
      paymentToken.trim() === ""
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
          incentiveAmount,
          incentiveToken,
          paymentAmount,
          paymentToken
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
      setIncentiveAmount("");
      setIncentiveToken("");
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
          Agreement created! Transaction Hash:{" "}
          <a
            href={`https://mumbai.polygonscan.com/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {transactionHash}
          </a>
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
    
        <label htmlFor="incentive-amount-input">Incentive Amount:</label>
        <input
          type="number"
          id="incentive-amount-input"
          value={incentiveAmount}
          onChange={(event) => setIncentiveAmount(event.target.value)}
        />
    
        <label htmlFor="incentive-token-input">Incentive Token:</label>
        <input
          type="text"
          id="incentive-token-input"
          value={incentiveToken}
          onChange={(event) => setIncentiveToken(event.target.value)}
        />
    
        <label htmlFor="payment-amount-input">Payment Amount:</label>
        <input
          type="number"
          id="payment-amount-input"
          value={paymentAmount}
          onChange={(event) => setPaymentAmount(event.target.value)}
        />
    
        <label htmlFor="payment-token-input">Payment Token:</label>
        <input
          type="text"
          id="payment-token-input"
          value={paymentToken}
          onChange={(event) => setPaymentToken(event.target.value)}
        />
    
        <button type="submit" className="add-agreement-form-button">
          <FaPlus />
        </button>
      </form>
    </div>
  );
}

export default AddAgreementForm;
