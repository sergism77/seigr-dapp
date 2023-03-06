import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { useMemo } from "react";
import { useEagerConnect, useInactiveListener } from "./useWeb3";
import { useContractCall, useContractFunction, useContractTransaction, useContractEvents, useContractMultipleData, useContractSingleData, useContractMultipleCall, useContractSingleCall, useContractSingleCallResult, useContractMultipleCallResult } from "./useContract";
import { useBlockNumber } from "./useBlockNumber";
import { useActiveWeb3React } from "./useActiveWeb3React";
import { useDebounceCallback, Debounce, DebounceInput } from "./useDebounce";


export function index() {
  const { library, account } = useActiveWeb3React();
  return useMemo(() => {
    if (!library) return null;
    try {
      return library;
    } catch (error) {
      console.log(error);
      return null;
    }
  }, [library]);
}