const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
    'https://rinkeby.infura.io/v3/8d3b5f3b3c5a4c8e9b9b9b9b9b9b9b9b'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    
    console.log('Attempting to deploy from account', accounts[0]);
    
    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ gas: '1000000', from: accounts[0] });
    
    console.log('Contract deployed to', result.options.address);
    }
deploy();

// The first thing we do is require the HDWalletProvider and Web3 libraries. We also require the compiled contract interface and bytecode.

// The HDWalletProvider is a library that allows us to connect to a network using a mnemonic phrase. We will use this to connect to the Rinkeby network.

// The Web3 library is a library that allows us to interact with the Ethereum network. We will use this to deploy our contract.

// The interface and bytecode are the compiled contract interface and bytecode. We will use these to deploy our contract.

// The next step is to create a new HDWalletProvider instance. We will use this to connect to the Rinkeby network. We will pass in the mnemonic phrase and the URL of the Rinkeby network.

// The next step is to create a new Web3 instance. We will use this to deploy our contract. We will pass in the HDWalletProvider instance as the provider.

// The next step is to create a function that will deploy our contract. We will use the async/await syntax to make this function asynchronous.

// The first thing we do is get a list of accounts from the web3 instance. We will use the first account to deploy our contract.

// The next step is to log a message to the console. We will log a message that tells us which account we are using to deploy our contract.

// The next step is to deploy our contract. We will use the web3 instance to create a new Contract instance. We will pass in the contract interface and bytecode. We will then call the deploy method on the Contract instance. We will pass in an object that contains the bytecode. We will then call the send method on the Contract instance. We will pass in an object that contains the gas amount and the account we are using to deploy the contract.

// The next step is to log a message to the console. We will log a message that tells us the address of the contract that was deployed.

// The last step is to call the deploy function. We will do this to deploy our contract.


