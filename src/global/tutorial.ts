import { ShepherdOptionsWithType } from 'react-shepherd';

export const steps: ShepherdOptionsWithType[] = [
  {
    id: 'step-intro',
    buttons: [
      {
        classes: 'shepherd-button-secondary',
        text: 'Exit',
        type: 'cancel',
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Next',
        type: 'next',
      },
    ],
    highlightClass: 'highlight',
    cancelIcon: {
      enabled: true,
    },
    title: 'Welcome!',
    text: [
      'We will guide you through the frontend and its pages in a few simple steps.',
    ],
  },
  {
    id: 'step-connect',
    attachTo: { element: '#connector', on: 'bottom' },
    buttons: [
      {
        classes: 'shepherd-button-secondary',
        text: 'Back',
        type: 'back',
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Next',
        type: 'next',
      },
    ],
    highlightClass: 'highlight',
    cancelIcon: {
      enabled: true,
    },
    title: 'Connect with your web3 wallet',
    text: [
      'First of all you need to connect with your installed wallet (MetaMask or WalletConnect) and set the network to Goerli.',
    ],
  },
  {
    id: 'step-navigate-faucet',
    attachTo: { element: '#navigation', on: 'bottom' },
    buttons: [
      {
        classes: 'shepherd-button-secondary',
        text: 'Back',
        type: 'back',
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Next',
        type: 'next',
      },
    ],
    highlightClass: 'highlight',
    cancelIcon: {
      enabled: true,
    },
    title: 'Navigate',
    text: ['Go to the faucet page.'],
  },
  {
    id: 'step-redeem',
    attachTo: { element: '#redeem', on: 'bottom' },
    buttons: [
      {
        classes: 'shepherd-button-secondary',
        text: 'Back',
        type: 'back',
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Next',
        type: 'next',
      },
    ],
    highlightClass: 'highlight',
    cancelIcon: {
      enabled: true,
    },
    title: 'Get some test ERC20 tokens',
    text: [
      'Use the faucet to get some test tokens by clicking on Redeem and confirming the transaction on your wallet.',
    ],
  },
  {
    id: 'step-navigate-stake',
    attachTo: { element: '#navigation', on: 'bottom' },
    buttons: [
      {
        classes: 'shepherd-button-secondary',
        text: 'Back',
        type: 'back',
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Next',
        type: 'next',
      },
    ],
    highlightClass: 'highlight',
    cancelIcon: {
      enabled: true,
    },
    title: 'Navigate',
    text: ['Go to the stake page.'],
  },
  {
    id: 'step-stake-dashboard',
    attachTo: { element: '#stake', on: 'top' },
    buttons: [
      {
        classes: 'shepherd-button-secondary',
        text: 'Back',
        type: 'back',
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Next',
        type: 'next',
      },
    ],
    highlightClass: 'highlight',
    cancelIcon: {
      enabled: true,
    },
    title: 'Staking dashboard',
    text: ['Click on any of these rows to open the action tabs.'],
  },
  {
    id: 'step-stake',
    attachTo: { element: '#stake-ctrl-panel', on: 'top' },
    buttons: [
      {
        classes: 'shepherd-button-secondary',
        text: 'Back',
        type: 'back',
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Next',
        type: 'next',
      },
    ],
    highlightClass: 'highlight',
    cancelIcon: {
      enabled: true,
    },
    title: 'Deposit',
    text: [
      'Click on the button and insert an amount to deposit and stake on the Vault.',
    ],
  },
  {
    id: 'step-navigate-trade',
    attachTo: { element: '#navigation', on: 'bottom' },
    buttons: [
      {
        classes: 'shepherd-button-secondary',
        text: 'Back',
        type: 'back',
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Next',
        type: 'next',
      },
    ],
    highlightClass: 'highlight',
    cancelIcon: {
      enabled: true,
    },
    title: 'Navigate',
    text: ['Go to the trade page.'],
  },
  {
    id: 'step-stake',
    attachTo: { element: '#strategies', on: 'top' },
    buttons: [
      {
        classes: 'shepherd-button-secondary',
        text: 'Back',
        type: 'back',
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Next',
        type: 'next',
      },
    ],
    highlightClass: 'highlight',
    cancelIcon: {
      enabled: true,
    },
    title: 'Choose a Strategy',
    text: [
      'Here you can see all available strategies, their expected APY range and the risk profile.',
    ],
  },
];

export const options = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true,
    },
  },
  useModalOverlay: true,
};
