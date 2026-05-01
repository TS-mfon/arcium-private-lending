# Deployment

```bash
yarn install
arcium build
arcium test
solana config set --url devnet --keypair ~/.config/solana/arcium-rtg-deployer.json
arcium deploy --cluster-offset 456 --recovery-set-size 4 --rpc-url https://api.devnet.solana.com
```

Use devnet assets only. This MVP demonstrates confidential protocol accounting, not production liquidity.
