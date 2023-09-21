use anchor_lang::prelude::*;

declare_id!("Fz3wjVypwyrY4a3fad9gTpDotqZg2bFBwEW4TkyruMTo");
#[program]
pub mod agreement_program {
    use super::*;


    pub fn initialize_agreement(ctx: Context<InitializeAgreement>, agreement: Agreement, pay_amount: u64) -> Result<()> {
        let agreement_account = &mut ctx.accounts.agreement;
        agreement_account.title = agreement.title;
        agreement_account.description = agreement.description;
        agreement_account.skills = agreement.skills;
        agreement_account.professional = agreement.professional;
        agreement_account.company = ctx.accounts.company.key();
        agreement_account.token_incentive = agreement.token_incentive;
        agreement_account.payment_amount = pay_amount;
        agreement_account.status = agreement.status;

        let counter_account = &mut ctx.accounts.agreement_id_counter;
        counter_account.counter += 1;
        agreement_account.id = counter_account.counter;
        Ok(())
    }

    pub fn initialize_agreement_id_counter(ctx: Context<InitializeAgreementIdCounter>) -> Result<()> {
        let counter = &mut ctx.accounts.id_counter;
        counter.counter = 0;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeAgreement<'info> {
    // size is just a sample, need to be updated
    #[account(init, payer = company, space = 8 + 1024)]
    pub agreement: Account<'info, AgreementAccount>,
    pub agreement_id_counter: Account<'info, AgreementIdCounter>,
    #[account(mut)]
    pub company: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct AgreementAccount {
    pub id: u128,
    pub title: String,
    pub description: String,
    pub skills: Vec<String>,
    pub payment_amount: u64,
    pub professional: Pubkey,
    pub company: Pubkey,
    pub token_incentive: Pubkey,
    pub status: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct Agreement {
    pub id: u128,
    pub title: String,
    pub description: String,
    pub skills: Vec<String>,
    pub payment_amount: u64,
    pub professional: Pubkey,
    pub company: Pubkey,
    pub token_incentive: Pubkey,
    pub status: u8,
}

#[account]
pub struct AgreementIdCounter {
    pub counter: u128,
}

#[derive(Accounts)]
pub struct InitializeAgreementIdCounter<'info> {
    #[account(init, payer = user, space = 8 + 128)]
    pub id_counter: Account<'info, AgreementIdCounter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Counter is already initialized")]
    CounterAlreadyInitialized,
}