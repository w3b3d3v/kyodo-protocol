//! Agreement Program Test Suite
//!
//! A comprehensive testing suite to validate the agreement program functionalities
//! developed in a Solana blockchain context using the Anchor framework. This suite
//! contains tests for token minting, agreement initialization, and payment processing.
//!
//! - **Author**: Jaxiii
//! - **Version**: 0.0.4
//! - **Date**: 09/28/2023

use anchor_lang::prelude::*; // Import anchor's prelude for boilerplate and utility functions.
use anchor_lang::solana_program; // Import solana_program for core Solana program functionalities.
use anchor_spl::token::{self, Token, TokenAccount, Transfer as SplTransfer};
use solana_program::system_instruction; // Import system_instruction from the solana_program crate. // Import modules from the anchor SPL token crate.

// Declare the ID for this smart contract program.
declare_id!("FVz7RJ6H6zFUkTx1sGuCDHDmYr96EQHR4g52xTmL8ZPn");

// Begin the program module declaration.
#[program]
pub mod agreement_program {
    // Import super's module's functions and structures.
    use super::*;

    // Function to initialize a new agreement on-chain.
    pub fn initialize_agreement(
        ctx: Context<InitializeAgreement>, // Context carrying information about accounts involved.
        agreement: Agreement,              // The agreement to be initialized.
    ) -> Result<()> {
        // Extract the agreement and company_agreements accounts from the context.
        let agreement_account = &mut ctx.accounts.agreement;
        let company_agreements = &mut ctx.accounts.company_agreements;

        // Populate the agreement account with the data from the given agreement.
        agreement_account.title = agreement.title;
        agreement_account.description = agreement.description;
        agreement_account.skills = agreement.skills;
        agreement_account.professional = agreement.professional;
        agreement_account.payment_amount = agreement.payment_amount;
        agreement_account.community_dao = agreement.community_dao;
        agreement_account.company = ctx.accounts.company.key();
        agreement_account.total_paid = 0;
        agreement_account.status = 0;

        // Add the agreement's key to the company's list of agreements.
        company_agreements.agreements.push(agreement_account.key());

        // Return Ok to indicate successful execution.
        Ok(())
    }

    pub fn initialize_fees(
        ctx: Context<InitializeFees>,
        fees: Fees,
    ) -> Result<()> {
        let fees_account = &mut ctx.accounts.fees; // TODO: Maybe hardcode the Kyodo admin key?
                                                   // so only Kyodo admin can initilize fees.
        fees_account.fee_percentage = fees.fee_percentage;
        fees_account.treasury_fee = fees.treasury_fee;
        fees_account.community_dao_fee = fees.community_dao_fee;

        Ok(())
    }

    pub fn initialize_accepted_payment_tokens(
        ctx: Context<InitializeAcceptedPaymentTokens>,
    ) -> Result<()> {
        let accepted_payment_token_account = &mut ctx.accounts.accepted_payment_token;
        // TODO: Maybe hardcode the Kyodo admin key?
        // so only Kyodo admin can initilize fees.
        Ok(())
    }

    pub fn add_accepted_payment_token(
        ctx: Context<AddAcceptedPaymentToken>,
        token_address: Pubkey,
    ) -> Result<()> {
        let accepted_payment_token_account = &mut ctx.accounts.accepted_payment_tokens;

        accepted_payment_token_account
            .accepted_payment_tokens
            .push(token_address);

        Ok(())
    }

    // Function to set fees for an agreement.
    pub fn set_fees(ctx: Context<SetFees>, fees: Fees) -> Result<()> {
        let fees_account = &mut ctx.accounts.fees;

        if fees.fee_percentage < 0 || fees.fee_percentage > 1000 {
            return err!(ErrorCode::InvalidFeePercentage);
        }

        fees_account.fee_percentage = fees.fee_percentage;
        fees_account.treasury_fee = fees.treasury_fee;
        fees_account.community_dao_fee = fees.community_dao_fee;

        Ok(())
    }

    // Function to process the payment for an agreement.
    pub fn process_payment(ctx: Context<ProcessPayment>, payment_token: Pubkey ,amount_to_pay: u64) -> Result<()> {
        //Extract various accounts needed for payment processing from the context.
        let agreement_account = &mut ctx.accounts.agreement;
        let accepted_payment_tokens_account = &mut ctx.accounts.accepted_payment_tokens;
        let fees_account = &mut ctx.accounts.fees;

        let community_dao = &ctx.accounts.community_dao;
        let treasury = &ctx.accounts.treasury;

        let payment_from = &mut ctx.accounts.company;
        let destination = &ctx.accounts.to_ata;
        let source = &ctx.accounts.from_ata;

        let token_program = &ctx.accounts.token_program;

        // Extract information from the agreement account.
        let agreement_professional = agreement_account.professional;
        let agreement_company = agreement_account.company;
        let agreement_amount_to_pay = agreement_account.payment_amount;
        let total_payed = agreement_account.total_paid;

        if destination.owner.key() != agreement_professional {
            return err!(ErrorCode::InvalidPaymentDestination);
        }

        // Check if the amount to be paid is a valid amount.
        if amount_to_pay < 0 {
            return err!(ErrorCode::InvalidPaymentAmount);
        }

        // Check if the amount being paid is greater than total amount to pay.
        if (total_payed + amount_to_pay) > agreement_amount_to_pay {
            return err!(ErrorCode::PaymentExeeded);
        }

        //Check if the given payment token is accepted for the agreement.
        if accepted_payment_tokens_account
            .accepted_payment_tokens
            .iter()
            .find(|&&x| x == payment_token.key())
            .is_none()
        {
            return err!(ErrorCode::InvalidPaymentToken);
        }

        let total_fee_basis_points = fees_account.fee_percentage * 1000;
        let total_fee = (total_fee_basis_points * amount_to_pay) / u64::pow(10, 6); //TODO: CHECK: Is this correct, get decimals?
        let kyodo_treasury_share = (total_fee * fees_account.treasury_fee) / 1000;
        let community_dao_share = total_fee - kyodo_treasury_share;
        let professional_payment = amount_to_pay - total_fee;

        // Perform the transfer from the company to the professional.
        let cpi_accounts = SplTransfer {
            from: source.to_account_info().clone(),
            to: destination.to_account_info().clone(),
            authority: payment_from.to_account_info().clone(),
        };
        let cpi_program = token_program.to_account_info();

        // Invoke the SPL token transfer instruction.
        token::transfer(
            CpiContext::new(cpi_program, cpi_accounts),
            professional_payment,
        )?;

        // Perform the transfer from the company to the community dao.
        let cpi_accounts = SplTransfer {
            from: source.to_account_info().clone(),
            to: community_dao.to_account_info().clone(),
            authority: payment_from.to_account_info().clone(),
        };
        let cpi_program = token_program.to_account_info();

        // Invoke the SPL token transfer instruction.
        token::transfer(
            CpiContext::new(cpi_program, cpi_accounts),
            community_dao_share,
        )?;

        // Perform the transfer from the company to the kyodo treasury.
        let cpi_accounts = SplTransfer {
            from: source.to_account_info().clone(),
            to: treasury.to_account_info().clone(),
            authority: payment_from.to_account_info().clone(),
        };
        let cpi_program = token_program.to_account_info();

        // Invoke the SPL token transfer instruction.
        token::transfer(
            CpiContext::new(cpi_program, cpi_accounts),
            kyodo_treasury_share,
        )?;

        // Update the amount that has been paid in the agreement.
        agreement_account.total_paid += amount_to_pay;

        // Set the agreement's status as paid.
        if agreement_account.total_paid == agreement_account.payment_amount {
            agreement_account.status = 1;
        }

        // Return Ok to indicate successful execution.
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeAgreement<'info> {
    #[account(init, payer = company, space = 8 + 2048)]
    pub agreement: Account<'info, AgreementAccount>,
    #[account(mut)]
    pub company: Signer<'info>,
    #[account(
        init_if_needed,
        payer = company,
        space = 2048,
        seeds = [b"company_agreements".as_ref(),company.key().as_ref()],
        bump
    )]
    pub company_agreements: Account<'info, CompanyAgreements>, // Added
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeFees<'info> {
    #[account(init, payer = admin, space = 8 + 512)]
    pub fees: Account<'info, FeesAccount>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeAcceptedPaymentTokens<'info> {
    #[account(init, payer = admin, space = 8 + 1024)]
    pub accepted_payment_token: Account<'info, AcceptedPaymentTokensAccount>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetFees<'info> {
    #[account(mut)]
    pub fees: Account<'info, FeesAccount>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct AddAcceptedPaymentToken<'info> {
    #[account(mut)]
    pub accepted_payment_tokens: Account<'info, AcceptedPaymentTokensAccount>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct ProcessPayment<'info> {
    #[account(mut)]
    pub agreement: Account<'info, AgreementAccount>,
    #[account(mut)]
    pub company: Signer<'info>,
    #[account(mut)]
    pub from_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub community_dao: Account<'info, TokenAccount>,
    #[account(mut)]
    pub treasury: Account<'info, TokenAccount>,
    pub accepted_payment_tokens: Account<'info, AcceptedPaymentTokensAccount>,
    pub fees: Account<'info, FeesAccount>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct AgreementAccount {
    pub title: String,
    pub description: String,
    pub skills: Vec<String>,
    pub payment_amount: u64,
    pub professional: Pubkey,
    pub community_dao: Pubkey,
    pub treasury: Pubkey,
    pub company: Pubkey,
    pub total_paid: u64,
    pub status: u8,
}

#[account]
pub struct FeesAccount {
    pub fee_percentage: u64,
    pub treasury_fee: u64,
    pub treasury: Pubkey,
    pub community_dao_fee: u64,
}

#[account]
pub struct AcceptedPaymentTokensAccount {
    pub accepted_payment_tokens: Vec<Pubkey>
}

#[account]
pub struct CompanyAgreements {
    pub agreements: Vec<Pubkey>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct Fees {
    pub fee_percentage: u64,
    pub treasury_fee: u64,
    pub treasury: Pubkey,
    pub community_dao_fee: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct Agreement {
    pub title: String,
    pub description: String,
    pub skills: Vec<String>,
    pub professional: Pubkey,
    pub community_dao: Pubkey,
    pub company: Pubkey,
    pub payment_amount: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Counter is already initialized")]
    CounterAlreadyInitialized,
    #[msg("Already completed")]
    AlreadyCompleted,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Invalid payment destination")]
    InvalidPaymentDestination,
    #[msg("Invalid payment token")]
    InvalidPaymentToken,
    #[msg("Invalid payment amount")]
    InvalidPaymentAmount,
    #[msg("Invalid fee percentage")]
    InvalidFeePercentage,
    #[msg("Payment exeeded the total amount")]
    PaymentExeeded
}
