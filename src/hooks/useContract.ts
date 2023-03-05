import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";
import { Contract } from "@ethersproject/contracts";
import { getContract } from "../utils";
export function useContract(address, ABI, withSignerIfPossible = true) {
    const { library, account } = useWeb3React();
    return useMemo(() => {
        if (!address || !ABI || !library) {
            return null;
        }
        try {
            return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined);
        }
        catch (error) {
            console.error("Failed to get contract", error);
            return null;
        }
    }, [address, ABI, library, withSignerIfPossible, account]);
}