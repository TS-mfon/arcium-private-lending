# Arcium Private Lending

Confidential lending and borrowing dapp for Solana and Arcium. The app gives users separate pages for supply/borrow, repay/withdraw, and liquidation workflows.

## Live Status

- Network: Solana devnet
- Program: `7W6PS52sHgz74525XbmnP7J3neRQa7HEagixu3b2ZqnV`
- Frontend: https://arciumprivatelending.vercel.app

## Fuller Dapp Flow

1. Connect a Solana wallet.
2. Supply USDC, deposit collateral, or request a private borrow.
3. Repay debt, withdraw collateral, or request a health check.
4. Submit liquidation only after a private health result marks an obligation eligible.
5. Review the private workspace for local obligation drafts and explorer-confirmed receipts.

Every form sends a real wallet-signed transaction to the deployed program. The UI keeps the private lending draft in browser local storage and links it to the transaction signature so the user can verify the action on Solana Explorer without exposing full debt or collateral details.

## How Arcium Is Used

Arcium is the confidential-computation layer for LTV, interest, health-factor, borrow-capacity, and liquidation checks. Sensitive borrower data is designed to be private input while Solana records only the public settlement and verification path.

The MVP program records explorer-verifiable action receipts. The privacy layer is structured so future Arcium computation can evaluate private account health while revealing only whether an action is allowed.

## Privacy Benefits

- Borrow and collateral details do not need to be public.
- Health checks can run without broadcasting the full position.
- Predatory liquidation monitoring becomes harder.
- Protocol safety can remain verifiable while user account data stays confidential.

## Local Versus On-Chain Data

The transaction receipt is on-chain. The raw lending draft shown in the private workspace is local to the browser and wallet. Clearing browser storage removes the local draft but does not remove the Solana transaction.

## Commands

```bash
yarn install
arcium build
arcium test
```
