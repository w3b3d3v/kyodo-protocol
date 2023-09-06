const { ethers } = require("hardhat");
require('dotenv').config({ path: './.env.development.local' });

const AGREEMENT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AGREEMENT_CONTRACT_ADDRESS
const FAKE_STABLE_ADDRESS = process.env.NEXT_PUBLIC_FAKE_STABLE_ADDRESS

async function payUserAgreement() {
  const [signer] = await ethers.getSigners();
  const AgreementContract = await ethers.getContractFactory("AgreementContract");
  const agreementContract = await AgreementContract.attach(AGREEMENT_CONTRACT_ADDRESS);

  // Obter a lista de acordos do usuário
  let userAgreements = await agreementContract.connect(signer).getUserAgreements(signer.address);
  userAgreements = userAgreements.map(id => id.toString());

  // Verificar se o usuário tem algum acordo
  if (userAgreements.length === 0) {
    console.log("Nenhum acordo encontrado para o usuário.");
    return;
  }

  // Obter o ID do primeiro acordo
  const firstAgreementId = userAgreements[0];

  // Obter detalhes do primeiro acordo para saber o valor e o token de pagamento
  const agreementDetails = await agreementContract.getAgreementById(firstAgreementId);
  const paymentAmount = agreementDetails.payment.amount.toString(); // ou qualquer outra lógica para determinar o valor do pagamento
  const paymentTokenAddress = agreementDetails.paymentToken;

  // Anexar ao contrato do token
  const TokenContract = await ethers.getContractFactory("testToken");
  const tokenContract = await TokenContract.attach(FAKE_STABLE_ADDRESS);

  // Aprovar o contrato de acordo para fazer o pagamento
  await tokenContract.connect(signer).approve(agreementContract.address, paymentAmount);

  // Fazer o pagamento
  await agreementContract.connect(signer).makePayment(firstAgreementId, paymentAmount);

  console.log(`Pagamento de ${paymentAmount} tokens feito para o acordo com ID ${firstAgreementId}.`);
}

payUserAgreement()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
