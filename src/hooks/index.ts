import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { useMemo } from "react";
import { useEagerConnect, useInactiveListener } from "./useWeb3";
import { useContractCall, useContractFunction, useContractTransaction, useContractEvents, useContractMultipleData, useContractSingleData, useContractMultipleCall, useContractSingleCall, useContractSingleCallResult, useContractMultipleCallResult } from "./useContract";
export { useEagerConnect, useInactiveListener, useContract, useContractCall, useContractFunction, useContractTransaction, useContractEvents, useContractMultipleData, useContractSingleData, useContractMultipleCall, useContractSingleCall, useContractSingleCallResult, useContractMultipleCallResult };
export function useContract(address, ABI, withSignerIfPossible) {


    const { library, account } = useWeb3React();
    return useMemo(() => {
        if (!address || !ABI || !library) return null;
        try {
            return new Contract(address, ABI, withSignerIfPossible && account ? library.getSigner(account).connectUnchecked() : library);
        } catch (error) {
            console.log(error);
            return null;
        }
    }, [address, ABI, withSignerIfPossible, library, account]);
}
