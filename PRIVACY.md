# Privacy Model

## Private
- User collateral, debt, LTV, health factor, and liquidation threshold.
- Borrow and repay accounting after the visible token movement.

## Public
- Vault totals, supported assets, oracle accounts, interest parameters, aggregate utilization, and token transfers.

## Arcium Role
Arcium computes LTV, interest, withdrawal eligibility, and liquidation checks over encrypted borrower state. SPL token transfers are still public in this MVP; private token movement is a future extension.
