import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from '../App';
import reportWebVitals from '../reportWebVitals';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useEagerConnect, useInactiveListener, useContract, useContractCall, useContractFunction, useContractTransaction, useContractEvents, useContractMultipleData, useContractSingleData, useContractMultipleCall, useContractSingleCall, useContractSingleCallResult, useContractMultipleCallResult } from '../hooks';
import { render } from '@testing-library/react';

function Dashboard() {
    const context = useWeb3React("http://81.191.42.97:10000/");
    const { connector, library, chainId, account, activate, deactivate, active, error } = context;
    const triedEager = useEagerConnect();
    useInactiveListener(!triedEager);

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Chain ID: {chainId}</p>
            <p>Account: {account}</p>
            <p>Active: {active ? "Yes" : "No"}</p>
            <p>Error: {error}</p>
        </div>
    );
}

export default Dashboard;