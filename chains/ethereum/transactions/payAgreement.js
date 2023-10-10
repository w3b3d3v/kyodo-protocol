import { ethers } from "ethers";
import ERC20Token from '../../../utils/ERC20Token';

const checkAllowance = async (userAddress, contractAddress, selectedToken) => {
    try {
        const tokenContract = new ERC20Token(selectedToken)
        const allowance = await tokenContract.allowance(userAddress, contractAddress)
        return ethers.BigNumber.from(allowance.toString())
    } catch (error) {
        console.error("Error to check allowance: ", error)
    }
}

const handleApprove = async (amount, spender, selectedPaymentToken) => {
    try {
        const amountInWei = ethers.utils.parseUnits(amount.toString(), selectedPaymentToken.decimals)
        const tokenContract = new ERC20Token(selectedPaymentToken.address)
        const tx = await tokenContract.approve(spender, amountInWei)
        await tx.wait()

        console.log(`Approval successful for amount: ${amount}`)
    } catch (error) {
        console.error("Error approving token:", error)
    }
}

export const payAgreement = async (details) => {
    try {
        const paymentAmountInWei = ethers.utils.parseUnits(
            details.paymentValue.toString(),
            details.selectedPaymentToken.decimals
        )
        
        const userAllowance = await checkAllowance(details.account, details.contract.address, details.selectedPaymentToken.address)
        if (!userAllowance.gte(paymentAmountInWei)) {
            console.log("User allowance is less than payment amount, approving...")
            await handleApprove(details.paymentValue, details.contract.address, details.selectedPaymentToken)
        }
  
        const tx = await details.contract.makePayment(
            details.agreementId,
            paymentAmountInWei,
            details.selectedPaymentToken.address
        )

        const receipt = await tx.wait();
        return receipt;
    } catch (error) {
        console.error("Error in payAgreement:", error);
        throw error;
    }
};
    
export default payAgreement;