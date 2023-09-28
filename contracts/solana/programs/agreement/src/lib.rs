use anchor_lang::prelude::*;
use anchor_spl::{
    token::{Token,Mint,MintTo,Transfer},
};

declare_id!("FVz7RJ6H6zFUkTx1sGuCDHDmYr96EQHR4g52xTmL8ZPn");

#[program]
pub mod agreement_program {
    use super::*;

    pub fn initialize_agreement(
        ctx: Context<InitializeAgreement>, //agreement: Agreement
        agreement: Agreement,
    ) -> Result<()> {
        let agreement_account = &mut ctx.accounts.agreement;
        let company_agreements = &mut ctx.accounts.company_agreements;

        agreement_account.title = agreement.title;
        agreement_account.description = agreement.description;
        agreement_account.skills = agreement.skills;
        agreement_account.professional = agreement.professional;
        agreement_account.company = ctx.accounts.company.key();
        agreement_account.token_incentive = agreement.token_incentive;
        agreement_account.payment = agreement.payment;
        agreement_account.total_paid = 0;
        agreement_account.accepted_payment_tokens = agreement.accepted_payment_tokens;
        agreement_account.status = agreement.status;

        company_agreements.agreements.push(agreement_account.key());

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
    //     // Add token to accepted_payment_tokens
    //     agreement_account
    //         .accepted_payment_tokens
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
    //     // Remove the token from accepted_payment_tokens
    //     agreement_account
    //         .accepted_payment_tokens
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

    pub fn process_payment(ctx: Context<ProcessPayment>) -> Result<()> {
        // Names may changed, as company maybe not be the one paying.
        let payment_from = &mut ctx.accounts.company;
        let agreement_account = &mut ctx.accounts.agreement;
        
        let payment_to = agreement_account.professional;
        let agreement_company = agreement_account.company;
        let payment_token = agreement_account.accepted_payment_tokens;
        let amount_to_pay = agreement_account.payment.amount;

        // Check if the agreement exists
        if payment_from.key() != agreement_company.key() {
            return err!(ErrorCode::Unauthorized);
        }

        // Check if the payment token is accepted
        if agreement_account.accepted_payment_tokens == payment_token.key() {
            return err!(ErrorCode::InvalidPaymentToken);
        }

        // Check if the payment amount is valid
        if amount_to_pay == 0 {
            return err!(ErrorCode::InvalidPaymentAmount);
        }

        //Transfer funds from the company to the agreement professional
        // anchor_spl::token::transfer(
        //     CpiContext::new(
        //         payment_token,
        //         Transfer {
        //             from: payment_from.to_account_info(),
        //             to: payment_to,
        //             authority: payment_from.to_account_info(),
        //         },
        //     ),
        //     amount_to_pay,
        // )?;

        // Update the total paid amount in the agreement
        agreement_account.total_paid += amount_to_pay;
        agreement_account.status = 1;
        Ok(())
    }


    ///////////// * FAKE MINT FOR TEST POURPOSES * ///////////////
    //////////////// * DELETE TO PRODUCTION * ////////////////////
    pub fn initialize_mint(ctx: Context<InitializeMint>) -> Result<()> {
        Ok(())
    }
    ///////////// * FAKE MINT FOR TEST POURPOSES * ///////////////
    //////////////// * DELETE TO PRODUCTION * ////////////////////
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
    /// CHECK:` doc comment explaining why no checks through types are necessary.
    pub professional: AccountInfo<'info>,
    /// CHECK:` doc comment explaining why no checks through types are necessary.
    pub payment_token: AccountInfo<'info>,
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
    pub accepted_payment_tokens: Pubkey,
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
    pub accepted_payment_tokens: Pubkey,
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


///////////// * FAKE MINT FOR TEST POURPOSES * ///////////////
//////////////// * DELETE TO PRODUCTION * ////////////////////

#[derive(Accounts)]
pub struct InitializeMint<'info> {
    #[account(
        init,
        payer = payer,
        mint::decimals = 9,
        mint::authority = payer,
        mint::freeze_authority = payer,
    )]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    ///CHECK: This is not dangerous because we don't read or write from this account
    pub rent: AccountInfo<'info>,
}

///////////// * FAKE MINT FOR TEST POURPOSES * ///////////////
//////////////// * DELETE TO PRODUCTION * ////////////////////