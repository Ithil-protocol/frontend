# The Web3 Wizard

## Project Description

The Web3 Wizard is a pioneering financial interoperability layer that seamlessly connects the entire web3 space. Our platform facilitates new value creation via innovative crowdlending mechanisms, offering a unique blend of technology and finance.

## Installation

Ensure you have `pnpm` installed on your system. If not, you can install it globally via npm:

```bash
npm install -g pnpm
```

Once pnpm is installed, set up the project dependencies:

```bash
pnpm install
```

## Development Server

To start the development server, run:

```bash
pnpm dev
```

## Tools and Libraries

**TypeScript**: Adds static typing to JavaScript, enhancing code reliability and maintainability.

**ESLint:** Identifies and corrects problematic patterns in JavaScript/TypeScript.

**Prettier:** An opinionated code formatter, ensuring consistent coding style.

**Lint-Staged:** Lints staged git files, enforcing coding standards before commits.

**Husky:** Simplifies and manages git hooks for better workflow.

> Note: Husky should automatically install with pnpm install. If it doesn't, run:
>
> ```bash
> pnpm run prepare
> ```

## Environment Configuration

Network Configuration:
Add `NEXT_PUBLIC_NETWORK` to your `.env` file and specify either `testnet` or `mainnet`.

## API Keys:

In the `.env.local` file, add `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` and `NEXT_PUBLIC_ALCHEMY_API_KEY`.

## Contract Addresses Configuration

To modify global contract addresses (not specific to a token), update `deploy/contracts.json`.

For contract addresses associated with unique tokens, edit `deploy/assets.json`.

After making changes to contract addresses, execute `pnpm wagmi`. Do not modify addresses in the source code manually.
