const { ethers } = require("hardhat");
require('dotenv').config({ path: '../../.env.development.local' });

const AGREEMENT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AGREEMENT_CONTRACT_ADDRESS
const FAKE_STABLE_ADDRESS = process.env.DAI_GOERLY

async function payUserAgreement() {
  const [signer] = await ethers.getSigners();
  const AgreementContract = await ethers.getContractFactory("AgreementContract");
  const agreementContract = await AgreementContract.attach(AGREEMENT_CONTRACT_ADDRESS);

  let userAgreements = await agreementContract.connect(signer).getUserAgreements(signer.address);
  userAgreements = userAgreements.map(id => id.toString());

  if (userAgreements.length === 0) {
    console.log("Nenhum acordo encontrado para o usuário.");
    return;
  }

  const firstAgreementId = userAgreements[0];

  const agreementDetails = await agreementContract.getAgreementById(firstAgreementId);
  const paymentAmount = agreementDetails.payment.amount.toString()

  const TokenContract = await ethers.getContractFactory("fakeStable");
  const tokenContract = await TokenContract.attach(FAKE_STABLE_ADDRESS);

  await tokenContract.connect(signer).approve(agreementContract.address, paymentAmount);

  await agreementContract.connect(signer).makePayment(firstAgreementId, paymentAmount, FAKE_STABLE_ADDRESS);

  console.log(`Pagamento de ${paymentAmount} tokens feito para o acordo com ID ${firstAgreementId}.`);
}

payUserAgreement()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
