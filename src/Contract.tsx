// what is this file for?
// this file is for the contract page
// show contract address
// show contract balance
// show contract name
// show contract symbol
// show contract decimals
// show contract total supply
// show contract owner
// show contract transfer
// show contract transfer from
// show contract approve
// show contract allowance

// Path: src/Contract.tsx
// what is this file for?

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useEagerConnect, useInactiveListener, useContract, useContractCall, useContractFunction, useContractTransaction, useContractEvents, useContractMultipleData, useContractSingleData, useContractMultipleCall, useContractSingleCall, useContractSingleCallResult, useContractMultipleCallResult } from './hooks';
function getLibrary(provider) {
    const library = new Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
    }
function Contract() {
    const context = useWeb3React("http://81.191.42.97:10000/");
    const { connector, library, chainId, account, activate, deactivate, active, error } = context;
    const triedEager = useEagerConnect();
    useInactiveListener(!triedEager);
    const contract = useContract("0x5FbDB2315678afecb367f032d93F642f64180aa3", ["function balanceOf(address owner) view returns (uint)", "function transfer(address to, uint amount)"], true);
    const contractCall = useContractCall(contract, "balanceOf", [account]);
    const contractFunction = useContractFunction(contract, "transfer");
    const contractTransaction = useContractTransaction(contract, "transfer");
    const contractEvents = useContractEvents(contract, "Transfer", account);
    const contractMultipleData = useContractMultipleData(contract, "balanceOf", [account]);
    const contractSingleData = useContractSingleData(contract, "balanceOf", account);
    const contractMultipleCall = useContractMultipleCall(contract, "balanceOf", [account]);
    const contractSingleCall = useContractSingleCall(contract, "balanceOf", account);
    const contractSingleCallResult = useContractSingleCallResult(contract, "balanceOf", account);
    const contractMultipleCallResult = useContractMultipleCallResult(contract, "balanceOf", [account]);
    console.log(contractMultipleCallResult);
    console.log(contractSingleCallResult);
    console.log(contractMultipleCall);
    console.log(contractSingleCall);
    console.log(contractMultipleData);
    console.log(contractSingleData);
    console.log(contractEvents);
    console.log(contractTransaction);
    console.log(contractFunction);
    console.log(contractCall);
    console.log(contract);
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <div className="App">
                <header className="App-header">
                    <p>

                        Contract

                    </p>
                </header>
            </div>
        </Web3ReactProvider>
    );
}
ReactDOM.render(
    <React.StrictMode>
        <Contract />
    </React.StrictMode>,
    document.getElementById('root')
);
reportWebVitals();