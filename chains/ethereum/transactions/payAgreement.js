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
        let totalAmountIncludingFeesInWei = ethers.BigNumber.from(0);

        const agreementIds = [];
        const paymentAmountsInWei = [];

        for (const agreement of details.agreements) {
            const paymentAmountInWei = ethers.utils.parseUnits(
                agreement.paymentValue.toString(), 
                details.selectedPaymentToken.decimals
            );
            const feeAmountInWei = paymentAmountInWei.mul(agreement.fee).div(1000);
            const amountIncludingFeeInWei = paymentAmountInWei.add(feeAmountInWei);

            agreementIds.push(agreement.id);
            paymentAmountsInWei.push(paymentAmountInWei);
            totalAmountIncludingFeesInWei = totalAmountIncludingFeesInWei.add(amountIncludingFeeInWei);
        }

        const userAllowance = await checkAllowance(details.account, details.contract.address, details.selectedPaymentToken.address);
        if (!userAllowance.gte(totalAmountIncludingFeesInWei)) {
            await handleApprove(totalAmountIncludingFeesInWei, details.contract.address, details.selectedPaymentToken);
        }

        const tx = await details.contract.makePayment(agreementIds, paymentAmountsInWei, details.selectedPaymentToken.address);
        return tx;
    } catch (error) {
        console.error("Error in payAgreement:", error);
        throw error;
    }
};
    
export default payAgreement;