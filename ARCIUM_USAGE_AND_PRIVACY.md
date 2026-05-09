# Arcium Usage and Privacy Benefits

## Project

Arcium Private Lending is a Solana dapp for confidential lending and borrowing workflows. It is designed to reduce leakage around collateral, debt, health factors, and liquidation risk.

## How Arcium Is Used

The dapp is designed around Arcium confidential computation. Wallet signatures and action receipts happen on Solana, while sensitive lending values are treated as private inputs for Arcium-powered computation.

The intended Arcium flow is:

1. A user connects a Solana wallet and selects a reserve or lending action.
2. The user prepares a supply, borrow, repay, withdraw, or liquidation action.
3. Sensitive values such as private debt, collateral composition, and health factor inputs should not be exposed as readable public state.
4. The frontend submits a wallet-signed Solana transaction to the deployed Arcium program, creating an explorer-verifiable action receipt.
5. Arcium confidential computation can evaluate LTV, interest, borrow capacity, and liquidation eligibility over private inputs.
6. Only the minimum result needed for protocol safety and settlement should be revealed.

The deployed MVP includes a live Solana program instruction for wallet-signed action receipts. This proves user interactions are real transactions while avoiding fake balances or fabricated state.

## Privacy Benefits

Traditional on-chain lending makes user positions visible. Anyone can inspect collateral, borrows, health factors, and liquidation thresholds. This enables predatory monitoring and targeted liquidations.

Using Arcium improves the design because:

- Borrow and collateral details can remain confidential.
- Health checks can run without exposing the full position.
- Liquidation eligibility can be verified without publishing every account detail.
- Users receive stronger financial privacy than fully transparent lending markets.
- Protocol risk logic can still be computed and settled on-chain.

## Why This Matters

Private credit markets need verifiable solvency without exposing every borrower. Arcium gives lending protocols a way to compute over confidential account data while preserving useful on-chain settlement.
