import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEagerConnect, useInactiveListener, useContract, useContractCall, useContractFunction, useContractTransaction, useContractEvents, useContractMultipleData, useContractSingleData, useContractMultipleCall, useContractSingleCall, useContractSingleCallResult, useContractMultipleCallResult } from "./hooks";
function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}
function App() {
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
        <div>
            <h1>hello</h1>
        </div>
    );
}
ReactDOM.render(
    <React.StrictMode>
        <Web3ReactProvider getLibrary={getLibrary}>
            <App />
        </Web3ReactProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
reportWebVitals();

function injected() {
    return new InjectedConnector({ supportedChainIds: [5319] });
}
export { injected };
