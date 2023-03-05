// Path: src/Withdraw.tsx
// what is this file for?
// this file is for the withdraw page
// show withdraw address
// show withdraw balance
// show withdraw name
// show withdraw symbol
// show withdraw decimals
// show withdraw total supply
// show withdraw owner
// show withdraw transfer
// show withdraw transfer from
// show withdraw approve
// show withdraw allowance
//
// Path: src/Withdraw.tsx

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
function Withdraw() {
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
                        Withdraw    
                    </p>
                    <p>
                        Withdraw Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
                    </p>
                    <p>
                        Withdraw Balance: {contractCall}
                    </p>
                    <p>
                        Withdraw Name:
                    </p>
                    <p>
                        Withdraw Symbol:
                    </p>
                    <p>
                        Withdraw Decimals:
                    </p>
                    <p>
                        Withdraw Total Supply:
                    </p>
                    <p>
                        Withdraw Owner:
                    </p>
                    <p>
                        Withdraw Transfer:
                    </p>
                    <p>
                        Withdraw Transfer From:
                    </p>
                    <p>
                        Withdraw Approve:
                    </p>
                    <p>
                        Withdraw Allowance:
                    </p>
                </header>
            </div>
        </Web3ReactProvider>
    );
}

export default Withdraw;