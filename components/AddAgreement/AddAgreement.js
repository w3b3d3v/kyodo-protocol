import { useRouter } from 'next/router'
import { useAgreementContract } from "../../contexts/ContractContext"
import { useState } from "react"
import styles from "./AddAgreement.module.css"
import Image from 'next/image'
import { BeatLoader } from "react-spinners"
import { ethers } from "ethers"
const BigNumber = ethers.BigNumber
import * as Yup from 'yup';

function AddAgreementForm(props) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [professional, setProfessional] = useState("")
  const [skills, setSkills] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [transactionHash, setTransactionHash] = useState(null)
  const { contract, loading } = useAgreementContract()
  const [formErrors, setFormErrors] = useState({});
  const router = useRouter()

  const AgreementSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required'),
    description: Yup.string()
      .required('Description is required'),
    professional: Yup.string()
      .required('Professional is required')
      .matches(/^0x[a-fA-F0-9]{40}$/, 'Professional must be a valid Ethereum address'),
    skills: Yup.string()
      .required('Skills are required')
      .test('is-comma-separated', 'Skills should be comma-separated', value => {
        if (!value) return false;
        const skillsArray = value.split(",");
        return skillsArray.every(skill => !!skill.trim());
      }),
      paymentAmount: Yup.number()
      .transform((value, originalValue) => {
          return originalValue === "" ? undefined : value;
      })
      .required('Payment amount is required')
      .positive('Payment amount should be positive'),  
  });

  async function handleSubmit(event) {
    event.preventDefault();

    try {
        await AgreementSchema.validate({
            title,
            description,
            professional,
            skills,
            paymentAmount,
        }, { abortEarly: false });  
        setFormErrors({});  
        await addAgreement();
    } catch (errors) {
        if (errors instanceof Yup.ValidationError) {
            const errorMessages = {};
            errors.inner.forEach(error => {
                errorMessages[error.path] = error.message;
            });
            setFormErrors(errorMessages);
        }
    }
  }

  async function addAgreement() {
    setIsLoading(true)

    if (window.ethereum) {
      const paymentAmountInWei = BigNumber.from(paymentAmount)
        .mul(BigNumber.from(10).pow(18))
        .toString()

      try {
        const tx = await contract
          .createAgreement(
            title,
            description,
            professional,
            skills.split(","),
            paymentAmountInWei,
          )
        await tx.wait()
      } catch (error) {
        console.error("Error creating agreement:", error)
      } finally {
        setIsLoading(false)
        router.push('/agreements')
      }

      setIsLoading(false)

      // Clear the form inputs after adding an agreement
      setTitle("")
      setDescription("")
      setProfessional("")
      setSkills("")
      setPaymentAmount("")
    }
  }

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="sweet-loading">
          <BeatLoader loading={isLoading} size={50} />
        </div>
      </div>
    )
  }

  if (transactionHash) {
    return (
      <div className={styles["transaction-info"]}>
        <div className={styles["holder"]}>
          <p>
            <Image
              src="/success-icon.svg"
              width={20}
              height={20}
            />
            Agreement created!
          </p>
          <a
            href={`https://mumbai.polygonscan.com/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            See Transaction
          </a>
        </div>
      </div>
    )
  }

  return (
    
    <div className={styles["add-agreement-form-container"]}>

      <h1>Add agreement</h1>

      <form className={styles["add-agreement-form"]} onSubmit={handleSubmit}>

        <section className={"columns"}>

          <div className={"col-01"}>
            <label htmlFor="title-input">Title:</label>
            {formErrors.title && <span style={{ color: 'red', fontSize: '12px' }}><br></br>{formErrors.title}</span>}
            <input
              type="text"
              id="title-input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              />
            <label htmlFor="professional-input">Professional wallet:</label>
            {formErrors.professional && <span style={{ color: 'red', fontSize: '12px' }}><br></br>{formErrors.professional}</span>}
            <input
              type="text"
              id="professional-input"
              value={professional}
              onChange={(event) => setProfessional(event.target.value)}
              />
            <label htmlFor="payment-amount-input">Payment Amount:</label>
            {formErrors.paymentAmount && <span style={{ color: 'red', fontSize: '12px' }}><br></br>{formErrors.paymentAmount}</span>}
            <input
              type="number"
              id="payment-amount-input"
              value={paymentAmount}
              onChange={(event) => setPaymentAmount(parseFloat(event.target.value))}
            />

          </div>

          <div className={"col-02"}>

            <label htmlFor="description-input">Description:</label>
            {formErrors.description && <span style={{ color: 'red', fontSize: '12px' }}><br></br>{formErrors.description}</span>}
            <textarea
              id="description-input"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            ></textarea>

            <label htmlFor="skills-input">Skills:</label>
            {formErrors.skills && <span style={{ color: 'red', fontSize: '12px' }}><br></br>{formErrors.skills}</span>}
            <textarea
              id="skills-input"
              value={skills}
              onChange={(event) => setSkills(event.target.value)}
            ></textarea>

          </div>

        </section>

        <section className={styles["form-footer"]}>
          <button type="submit" className={styles["add-agreement-form-button"]}>
            <div>Add</div>
          </button>
        </section>

      </form>
    </div>
  )
}

export default AddAgreementForm;