import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useEagerConnect, useInactiveListener, useContract, useContractCall, useContractFunction, useContractTransaction, useContractEvents, useContractMultipleData, useContractSingleData, useContractMultipleCall, useContractSingleCall, useContractSingleCallResult, useContractMultipleCallResult } from './hooks';
import { render } from '@testing-library/react';
// if the user is not connected to the wallet, then the user will be prompted to connect to the wallet or create a new Seigr Wallet
// if the user is connected to the wallet, then the user will be redirected to the dashboard page
// show connect to wallet button and create Seigr Wallet button

function Home() {
    const context = useWeb3React("http://81.191.42.97:10000/");
    const { connector, library, chainId, account, activate, deactivate, active, error } = context;
    const triedEager = useEagerConnect();
    useInactiveListener(!triedEager);

    return (
        <div>
            <h1>Home</h1>
            <p>Chain ID: {chainId}</p>
            <p>Account: {account}</p>
            <p>Active: {active ? "Yes" : "No"}</p>
            <p>Error: {error}</p>
        </div>
    );
}

export default Home;