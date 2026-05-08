# Arcium Private Lending

An Arcium RTG developer submission for confidential lending and borrowing on Solana.

## What It Builds

This repo contains an Arcium/Anchor project for private borrower accounting. User collateral, debt, LTV, health factor, and liquidation eligibility are modeled as encrypted computation inputs. Arcium computes the risk result privately and returns only the approval or liquidation settlement needed by the Solana program.

The current generated circuit is the buildable Arcium integration base. The lending domain layer is documented in `PRIVACY.md`, `DEPLOYMENT.md`, and the Vercel demo in `app/`.

## Frontend Demo

The `app/` directory contains a static interactive frontend with borrower inputs, live LTV/health-factor decisions, and a verified deployment panel. The panel looks for public deployment metadata at `app/deployment.json`, `deployment.json`, `deployments/arcium_private_lending.json`, or `deployments/latest.json`. If no deployment JSON is present, it reads available local config such as `Anchor.toml` and shows `not deployed yet`.

Example deployment metadata:

```json
{
  "programId": "YourDeployedProgramId",
  "cluster": "devnet",
  "signature": "DeploymentTransactionSignature",
  "deployedAt": "2026-05-03T00:00:00Z",
  "explorerUrl": "https://explorer.solana.com/address/YourDeployedProgramId?cluster=devnet"
}
```

## Privacy Benefit

Public lending exposes account health and invites predatory liquidation. Private computation lets protocols verify safety without broadcasting the full borrower state.

## Arcium Flow

1. User encrypts position data.
2. Program queues LTV, borrow, repay, withdrawal, or liquidation computation.
3. Arcium computes the result over encrypted shares.
4. Callback verifies the signed output.
5. Program executes only the public token movement required by the result.

## Commands

```bash
yarn install
arcium build
arcium test
```

## RTG Notes

- Functional Solana/Arcium project scaffolded with `arcium init`.
- Open-source repo ready.
- English explanation included.
- Frontend demo included under `app/`.
