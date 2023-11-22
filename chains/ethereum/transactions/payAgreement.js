import { ethers } from "ethers";
import ERC20Token from '../utils/ERC20Token';

const checkAllowance = async (userAddress, contractAddress, selectedToken) => {
    try {
        const tokenContract = new ERC20Token(selectedToken)
        const allowance = await tokenContract.allowance(userAddress, contractAddress)
        return ethers.BigNumber.from(allowance.toString())
    } catch (error) {
        console.error("Error to check allowance: ", error)
    }
}

const handleApprove = async (totalAmountInWei, spender, selectedPaymentToken) => {
    try {
        const tokenContract = new ERC20Token(selectedPaymentToken.address);
        const tx = await tokenContract.approve(spender, totalAmountInWei);
        await tx.wait();

        console.log(`Approval successful for total amount: ${ethers.utils.formatUnits(totalAmountInWei, selectedPaymentToken.decimals)}`);
    } catch (error) {
        console.error("Error approving token:", error);
    }
}


export const payAgreement = async (details) => {
    try {
        const paymentAmountInWei = ethers.utils.parseUnits(
            details.paymentValue.toString(),
            details.selectedPaymentToken.decimals
        );
        const feePercentage = details.agreement.fee;
        const feeAmountInWei = paymentAmountInWei.mul(feePercentage).div(1000);
        const totalAmountIncludingFeeInWei = paymentAmountInWei.add(feeAmountInWei);

        const userAllowance = await checkAllowance(details.account, details.contract.address, details.selectedPaymentToken.address);
        if (!userAllowance.gte(totalAmountIncludingFeeInWei)) {
            await handleApprove(totalAmountIncludingFeeInWei, details.contract.address, details.selectedPaymentToken);
        }

        const tx = await details.contract.makePayment(
            details.agreement.id,
            paymentAmountInWei,
            details.selectedPaymentToken.address
        );

        return tx;
    } catch (error) {
        console.error("Error in payAgreement:", error);
        throw error;
    }
};

    
export default payAgreement;