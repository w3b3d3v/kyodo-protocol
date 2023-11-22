const { ethers } = require("hardhat");
require('dotenv').config({ path: '../../.env.development.local' });

async function kyodoRegistry(contractName) {
  const KyodoRegistryContract = await ethers.getContractFactory("KyodoRegistry")
  const kyodoRegistryContract = await KyodoRegistryContract.attach(process.env.NEXT_PUBLIC_KYODO_REGISTRY);
  
  const address = await kyodoRegistryContract.getRegistry(contractName)
  return address
}

async function payUserAgreement() {
  const [signer] = await ethers.getSigners();
  const AgreementContract = await ethers.getContractFactory("AgreementContract");
  const agreementContract = await AgreementContract.attach(kyodoRegistry("AGREEMENT_CONTRACT"));

  let userAgreements = await agreementContract.connect(signer).getContractorAgreementIds(signer.address);
  userAgreements = userAgreements.map(id => id.toString());

  if (userAgreements.length === 0) {
    console.log("Nenhum acordo encontrado para o usuário.");
    return;
  }

  const firstAgreementId = userAgreements[0];
  const agreementDetails = await agreementContract.getAgreementById(firstAgreementId);
  const paymentAmount = ethers.BigNumber.from(agreementDetails.paymentAmount);

  // Obter a taxa do protocolo
  const protocolFee = await agreementContract.getFee();
  const totalFeeAmount = paymentAmount.mul(protocolFee).div(1000);

  // Calcular o valor total incluindo a taxa
  const totalAmountIncludingFee = paymentAmount.add(totalFeeAmount);

  const TokenContract = await ethers.getContractFactory("fakeStable");
  const tokenContract = await TokenContract.attach(kyodoRegistry("FAKE_STABLE"));

  // Aprovar o valor total incluindo a taxa
  await tokenContract.connect(signer).approve(agreementContract.address, totalAmountIncludingFee);

  // Fazer o pagamento
  await agreementContract.connect(signer).makePayment(firstAgreementId, paymentAmount, tokenContract.address);

  console.log(`Pagamento de ${totalAmountIncludingFee} tokens feito para o acordo com ID ${firstAgreementId}.`);
}


payUserAgreement()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
