export const ChainlessPermissionedSwap = [
  {
    type: 'function',
    constant: false,
    payable: false,
    name: 'add_fiat_token',
    inputs: [
      {
        name: 'token',
        type: 'address',
      },
      {
        name: 'min_amount',
        type: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    constant: false,
    payable: false,
    name: 'add_invest_token',
    inputs: [
      {
        name: 'token',
        type: 'address',
      },
      {
        name: 'min_amount',
        type: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    constant: false,
    payable: false,
    name: 'fulfill_tx',
    inputs: [
      {
        name: 'tx_hash',
        type: 'bytes32',
      },
      {
        name: 'tx_nonce',
        type: 'uint256',
      },
      {
        name: 'receive_amount',
        type: 'uint256',
      },
      {
        name: 'receive_token',
        type: 'address',
      },
      {
        name: 'recipient',
        type: 'address',
      },
      {
        name: 'payer',
        type: 'address',
      },
      {
        name: 'pay_with',
        type: 'address',
      },
      {
        name: 'pay_amount',
        type: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    constant: false,
    payable: false,
    name: 'get_amount_pending_tx',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    constant: false,
    payable: false,
    name: 'get_min_request',
    inputs: [
      {
        name: 'token',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: 'fiat_amout',
        type: 'uint256',
      },
      {
        name: 'invest_amount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    constant: false,
    payable: false,
    name: 'get_pending_tx_hashes',
    inputs: [
      {
        name: 'take',
        type: 'uint256',
      },
      {
        name: 'skip',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bytes32[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    constant: false,
    payable: false,
    name: 'initialize',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    constant: false,
    payable: false,
    name: 'invest',
    inputs: [
      {
        name: 'token',
        type: 'address',
      },
      {
        name: 'recipient',
        type: 'address',
      },
      {
        name: 'pay_with',
        type: 'address',
      },
      {
        name: 'pay_amount',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    constant: false,
    payable: false,
    name: 'is_tx_pending',
    inputs: [
      {
        name: 'hash',
        type: 'bytes32',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    constant: false,
    payable: false,
    name: 'owner',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    constant: false,
    payable: false,
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    constant: false,
    payable: false,
    name: 'transfer',
    inputs: [
      {
        name: 'token',
        type: 'address',
      },
      {
        name: 'recipient',
        type: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    constant: false,
    payable: false,
    name: 'transferOwnership',
    inputs: [
      {
        name: 'newOwner',
        type: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    constant: false,
    payable: false,
    name: 'withdraw',
    inputs: [
      {
        name: 'token',
        type: 'address',
      },
      {
        name: 'recipient',
        type: 'address',
      },
      {
        name: 'pay_with',
        type: 'address',
      },
      {
        name: 'pay_amount',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'Initialized',
    inputs: [
      {
        name: 'version',
        type: 'uint64',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SwapExecuted',
    inputs: [
      {
        name: 'tx_hash',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'recipient',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SwapRequested',
    inputs: [
      {
        name: 'tx_hash',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'recipient',
        type: 'address',
        indexed: true,
      },
      {
        name: 'receive_token',
        type: 'address',
        indexed: true,
      },
      {
        name: 'payer',
        type: 'address',
        indexed: false,
      },
      {
        name: 'pay_with',
        type: 'address',
        indexed: false,
      },
      {
        name: 'pay_amount',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'tx_nonce',
        type: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AddressEmptyCode',
    inputs: [
      {
        name: 'target',
        type: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'AddressInsufficientBalance',
    inputs: [
      {
        name: 'account',
        type: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'FailedInnerCall',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidInitialization',
    inputs: [],
  },
  {
    type: 'error',
    name: 'NotInitializing',
    inputs: [],
  },
  {
    type: 'error',
    name: 'OwnableInvalidOwner',
    inputs: [
      {
        name: 'owner',
        type: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'OwnableUnauthorizedAccount',
    inputs: [
      {
        name: 'account',
        type: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'SafeERC20FailedOperation',
    inputs: [
      {
        name: 'token',
        type: 'address',
      },
    ],
  },
] as const;
