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
use solana_program::system_instruction; // Import system_instruction from the solana_program crate.
use anchor_spl::token::{self, Token, TokenAccount, Transfer as SplTransfer}; // Import modules from the anchor SPL token crate.


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
        agreement_account.company = ctx.accounts.company.key();
        agreement_account.token_incentive = agreement.token_incentive;
        agreement_account.payment = agreement.payment;
        agreement_account.total_paid = 0;
        agreement_account.accepted_payment_token = agreement.accepted_payment_token;
        agreement_account.status = agreement.status;

        // Add the agreement's key to the company's list of agreements.
        company_agreements.agreements.push(agreement_account.key());

        // Return Ok to indicate successful execution.
        Ok(())
    }

    // pub fn add_accepted_payment_token(
    //     ctx: Context<AddAcceptedPaymentToken>,
    //     token_address: Pubkey,
    // ) -> Result<()> {
    //     let agreement_account = &mut ctx.accounts.agreement;
    //     // Check if the calling address is the owner
    //     if ctx.accounts.owner.key() != agreement_account.company {
    //         return err!(ErrorCode::Unauthorized);
    //     }
    //     // Add token to accepted_payment_token
    //     agreement_account
    //         .accepted_payment_token
    //         .push(token_address);
    //     Ok(())
    // }

    // Function to remove a token from being accepted as payment
    // pub fn remove_accepted_payment_token(
    //     ctx: Context<RemoveAcceptedPaymentToken>,
    //     token_address: Pubkey,
    // ) -> Result<()> {
    //     let agreement_account = &mut ctx.accounts.agreement;
    //     // Check if the calling address is the owner
    //     if ctx.accounts.owner.key() != agreement_account.company {
    //         return err!(ErrorCode::Unauthorized);
    //     }
    //     // Remove the token from accepted_payment_token
    //     agreement_account
    //         .accepted_payment_token
    //         .retain(|&x| x != token_address);
    //     Ok(())
    // }
    // Function to update the token incentive
    // pub fn update_token_incentive(
    //     ctx: Context<UpdateTokenIncentive>,
    //     new_token: Token,
    // ) -> Result<()> {
    //     let agreement_account = &mut ctx.accounts.agreement;
    //     // Check if the calling address is the owner
    //     if ctx.accounts.owner.key() != agreement_account.company {
    //         return err!(ErrorCode::Unauthorized);
    //     }
    //     // Update the token incentive in the agreement account
    //     agreement_account.token_incentive = new_token;
    //     Ok(())
    // }

    // pub fn update_token_incentive_address(
    //     ctx: Context<UpdateTokenIncentiveAddress>,
    //     new_address: Pubkey,
    // ) -> Result<()> {
    //     let agreement_account = &mut ctx.accounts.agreement;
    //     // Check if the calling address is the owner
    //     if ctx.accounts.owner.key() != agreement_account.company {
    //         return err!(ErrorCode::Unauthorized);
    //     }
    //     // Update the token incentive address in the agreement account
    //     agreement_account.token_incentive.token_address = new_address;
    //     Ok(())
    // }

    // // Function to update the token incentive amount
    // pub fn update_token_incentive_amount(
    //     ctx: Context<UpdateTokenIncentiveAmount>,
    //     new_amount: u64,
    // ) -> Result<()> {
    //     let agreement_account = &mut ctx.accounts.agreement;
    //     // Check if the calling address is the owner
    //     if ctx.accounts.owner.key() != agreement_account.company {
    //         return err!(ErrorCode::Unauthorized);
    //     }
    //     // Update the token incentive amount in the agreement account
    //     agreement_account.token_incentive.amount = new_amount;
    //     Ok(())
    // }

    // // Function to update the payment amount for an agreement
    // pub fn update_payment_amount(ctx: Context<UpdatePaymentAmount>, new_amount: u64) -> Result<()> {
    //     let agreement_account = &mut ctx.accounts.agreement;
    //     // Check if the calling address is the owner
    //     if ctx.accounts.owner.key() != agreement_account.company {
    //         return err!(ErrorCode::Unauthorized);
    //     }
    //     // Update the payment amount in the agreement account
    //     agreement_account.payment.amount = new_amount;
    //     Ok(())
    // }
    // // Function to mark an agreement as completed
    // pub fn mark_agreement_completed(ctx: Context<MarkAgreementCompleted>) -> Result<()> {
    //     let agreement_account = &mut ctx.accounts.agreement;
    //     // Check if the calling address is the owner
    //     if ctx.accounts.owner.key() != agreement_account.company {
    //         return err!(ErrorCode::Unauthorized);
    //     }
    //     // Check if the agreement is already completed
    //     if agreement_account.status != 0 {
    //         return err!(ErrorCode::AlreadyCompleted);
    //     }
    //     // Mark the agreement as completed
    //     agreement_account.status = 1;
    //     Ok(())
    // }

    // Function to process the payment for an agreement.
    pub fn process_payment(ctx: Context<ProcessPayment>) -> Result<()> {
        // Extract various accounts needed for payment processing from the context.
        let payment_from = &mut ctx.accounts.company;
        let payment_to = &mut ctx.accounts.professional;
        let agreement_account = &mut ctx.accounts.agreement;
        let payment_token = &mut ctx.accounts.payment_token;
        let destination = &ctx.accounts.to_ata;
        let source = &ctx.accounts.from_ata;
        let token_program = &ctx.accounts.token_program;

        // Extract information from the agreement account.
        let agreement_professional = agreement_account.professional;
        let agreement_company = agreement_account.company;
        let agreement_payment_token = agreement_account.accepted_payment_token;
        let amount_to_pay = agreement_account.payment.amount;

        // Check if the provided company is the one from the agreement.
        if payment_from.key() != agreement_company {
            return err!(ErrorCode::Unauthorized);
        }

        // Check if the given payment token is accepted for the agreement.
        if agreement_account.accepted_payment_token.key() != agreement_payment_token {
            return err!(ErrorCode::InvalidPaymentToken);
        }

        // Check if the amount to be paid is a valid amount.
        if amount_to_pay <= 0 {
            return err!(ErrorCode::InvalidPaymentAmount);
        }

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
            amount_to_pay)?;

        // Update the amount that has been paid in the agreement.
        agreement_account.total_paid += amount_to_pay;

        // Set the agreement's status as paid.
        agreement_account.status = 1;

        // Return Ok to indicate successful execution.
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeAgreement<'info> {
    #[account(init, payer = company, space = 8 + 1024)]
    pub agreement: Account<'info, AgreementAccount>,
    #[account(mut)]
    pub company: Signer<'info>,
    #[account(
        init_if_needed,
        payer = company,
        space = 1024,
        seeds = [b"company_agreements".as_ref(),company.key().as_ref()],
        bump
    )]
    pub company_agreements: Account<'info, CompanyAgreements>, // Added
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddAcceptedPaymentToken<'info> {
    #[account(mut)]
    pub agreement: Account<'info, AgreementAccount>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct RemoveAcceptedPaymentToken<'info> {
    #[account(mut)]
    pub agreement: Account<'info, AgreementAccount>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateTokenIncentive<'info> {
    #[account(mut)]
    pub agreement: Account<'info, AgreementAccount>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateTokenIncentiveAddress<'info> {
    #[account(mut)]
    pub agreement: Account<'info, AgreementAccount>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateTokenIncentiveAmount<'info> {
    #[account(mut)]
    pub agreement: Account<'info, AgreementAccount>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdatePaymentAmount<'info> {
    #[account(mut)]
    pub agreement: Account<'info, AgreementAccount>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct MarkAgreementCompleted<'info> {
    #[account(mut)]
    pub agreement: Account<'info, AgreementAccount>,
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
    /// CHECK:` We do not read or write to this account.
    pub professional: AccountInfo<'info>,
    /// CHECK:` We do not read or write to this account.
    pub payment_token: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct PaymentToken {
    pub amount: u64,
    pub token_address: Pubkey,
}

#[account]
pub struct AgreementAccount {
    pub title: String,
    pub description: String,
    pub skills: Vec<String>,
    pub payment_amount: u64,
    pub professional: Pubkey,
    pub company: Pubkey,
    pub token_incentive: PaymentToken,
    pub payment: PaymentToken,
    pub accepted_payment_token: Pubkey,
    pub total_paid: u64,
    pub status: u8,
}

#[account]
pub struct CompanyAgreements {
    pub agreements: Vec<Pubkey>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct Agreement {
    pub title: String,
    pub description: String,
    pub skills: Vec<String>,
    pub professional: Pubkey,
    pub company: Pubkey,
    pub token_incentive: PaymentToken,
    pub payment: PaymentToken,
    pub accepted_payment_token: Pubkey,
    pub total_paid: u64,
    pub status: u8,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Counter is already initialized")]
    CounterAlreadyInitialized,
    #[msg("Already completed")]
    AlreadyCompleted,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Invalid payment token")]
    InvalidPaymentToken,
    #[msg("Invalid payment amount")]
    InvalidPaymentAmount,
}