use anchor_lang::prelude::*;

#[account]
pub struct Reserve {
    pub authority: Pubkey,
    pub reserve_id: u64,
    pub collateral_label: String,
    pub debt_label: String,
    pub ltv_bps: u16,
    pub liquidation_threshold_bps: u16,
    pub liquidity: u64,
    pub status: u8,
    pub bump: u8,
}

impl Reserve {
    pub const MAX_LABEL: usize = 24;
    pub const SPACE: usize = 8 + 32 + 8 + 4 + Self::MAX_LABEL + 4 + Self::MAX_LABEL + 2 + 2 + 8 + 1 + 1;
}

#[account]
pub struct Obligation {
    pub owner: Pubkey,
    pub reserve_label: String,
    pub obligation_id: u64,
    pub public_collateral_amount: u64,
    pub encrypted_debt_hash: [u8; 32],
    pub status: u8,
    pub bump: u8,
}

impl Obligation {
    pub const MAX_RESERVE_LABEL: usize = 24;
    pub const SPACE: usize = 8 + 32 + 4 + Self::MAX_RESERVE_LABEL + 8 + 8 + 32 + 1 + 1;
}

#[account]
pub struct ActionReceipt {
    pub actor: Pubkey,
    pub action_id: u64,
    pub action_type: u8,
    pub payload_hash: [u8; 32],
    pub created_ts: i64,
    pub bump: u8,
}

impl ActionReceipt {
    pub const SPACE: usize = 8 + 32 + 8 + 1 + 32 + 8 + 1;
}
