pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use arcium_anchor::prelude::*;
pub use constants::*;
pub use instructions::*;
#[allow(unused_imports)]
pub use state::*;

declare_id!("7W6PS52sHgz74525XbmnP7J3neRQa7HEagixu3b2ZqnV");

#[arcium_program]
pub mod arcium_private_lending {
    use super::*;

    pub fn init_reserve(
        ctx: Context<InitReserve>,
        reserve_id: u64,
        collateral_label: String,
        debt_label: String,
        ltv_bps: u16,
        liquidation_threshold_bps: u16,
    ) -> Result<()> {
        require!(collateral_label.len() <= Reserve::MAX_LABEL, error::ErrorCode::CustomError);
        require!(debt_label.len() <= Reserve::MAX_LABEL, error::ErrorCode::CustomError);
        require!(ltv_bps < liquidation_threshold_bps, error::ErrorCode::CustomError);

        let reserve = &mut ctx.accounts.reserve;
        reserve.authority = ctx.accounts.authority.key();
        reserve.reserve_id = reserve_id;
        reserve.collateral_label = collateral_label;
        reserve.debt_label = debt_label;
        reserve.ltv_bps = ltv_bps;
        reserve.liquidation_threshold_bps = liquidation_threshold_bps;
        reserve.liquidity = 0;
        reserve.status = 1;
        reserve.bump = ctx.bumps.reserve;
        Ok(())
    }

    pub fn open_private_borrow(
        ctx: Context<OpenPrivateBorrow>,
        obligation_id: u64,
        reserve_label: String,
        public_collateral_amount: u64,
        encrypted_debt_hash: [u8; 32],
    ) -> Result<()> {
        require!(reserve_label.len() <= Obligation::MAX_RESERVE_LABEL, error::ErrorCode::CustomError);
        require!(public_collateral_amount > 0, error::ErrorCode::CustomError);

        let obligation = &mut ctx.accounts.obligation;
        obligation.owner = ctx.accounts.owner.key();
        obligation.reserve_label = reserve_label;
        obligation.obligation_id = obligation_id;
        obligation.public_collateral_amount = public_collateral_amount;
        obligation.encrypted_debt_hash = encrypted_debt_hash;
        obligation.status = 1;
        obligation.bump = ctx.bumps.obligation;
        Ok(())
    }

    pub fn record_action(
        ctx: Context<RecordAction>,
        action_id: u64,
        action_type: u8,
        payload_hash: [u8; 32],
    ) -> Result<()> {
        let receipt = &mut ctx.accounts.action_receipt;
        receipt.actor = ctx.accounts.actor.key();
        receipt.action_id = action_id;
        receipt.action_type = action_type;
        receipt.payload_hash = payload_hash;
        receipt.created_ts = Clock::get()?.unix_timestamp;
        receipt.bump = ctx.bumps.action_receipt;
        Ok(())
    }

    pub fn init_add_together_comp_def(ctx: Context<InitAddTogetherCompDef>) -> Result<()> {
        add_together::init_add_together_comp_def_handler(ctx)
    }

    pub fn add_together(
        ctx: Context<AddTogether>,
        computation_offset: u64,
        ciphertext_0: [u8; 32],
        ciphertext_1: [u8; 32],
        pub_key: [u8; 32],
        nonce: u128,
    ) -> Result<()> {
        add_together::add_together_handler(ctx, computation_offset, ciphertext_0, ciphertext_1, pub_key, nonce)
    }

    #[arcium_callback(encrypted_ix = "add_together")]
    pub fn add_together_callback(
        ctx: Context<AddTogetherCallback>,
        output: SignedComputationOutputs<AddTogetherOutput>,
    ) -> Result<()> {
        add_together::add_together_callback_handler(ctx, output)
    }
}

#[derive(Accounts)]
#[instruction(reserve_id: u64)]
pub struct InitReserve<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = Reserve::SPACE,
        seeds = [b"reserve", authority.key().as_ref(), &reserve_id.to_le_bytes()],
        bump
    )]
    pub reserve: Account<'info, Reserve>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(obligation_id: u64)]
pub struct OpenPrivateBorrow<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        init,
        payer = owner,
        space = Obligation::SPACE,
        seeds = [b"obligation", owner.key().as_ref(), &obligation_id.to_le_bytes()],
        bump
    )]
    pub obligation: Account<'info, Obligation>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(action_id: u64)]
pub struct RecordAction<'info> {
    #[account(mut)]
    pub actor: Signer<'info>,
    #[account(
        init,
        payer = actor,
        space = ActionReceipt::SPACE,
        seeds = [b"action", actor.key().as_ref(), &action_id.to_le_bytes()],
        bump
    )]
    pub action_receipt: Account<'info, ActionReceipt>,
    pub system_program: Program<'info, System>,
}
