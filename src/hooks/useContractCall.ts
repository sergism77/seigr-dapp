import React from 'react';
import { useMemo } from 'react';
import { Contract } from '@ethersproject/contracts';
import { Contract } from '@ethersproject/contracts';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { useActiveWeb3React } from './useActiveWeb3React';

export function useContract(
    address: string | undefined,
    ABI: any,
    withSignerIfPossible = true
    ) {
    const { library, account } = useActiveWeb3React();
    return useMemo(() => {
        if (!address || !ABI || !library) return null;
        try {
        return new Contract(address, ABI, withSignerIfPossible && account ? library.getSigner(account).connectUnchecked() : library);
        } catch (error) {
        console.error('Failed to get contract', error);
        return null;
        }
    }, [address, ABI, withSignerIfPossible, library, account]);
    }




export function useContractCall(
    contract: Contract | null | undefined,
    functionName: string,
    args: any[] | undefined,
    shouldPoll = false,
    pollInterval = 10000
    ) {
    const { library } = useActiveWeb3React();
    const [value, setValue] = useState<any>();
    
    useEffect(() => {
        if (!contract || !library) return;
    
        const poll = async () => {
        const value = await contract[functionName](...args);
        setValue(value);
        };
    
        poll();
    
        if (shouldPoll) {
        const interval = setInterval(poll, pollInterval);
        return () => clearInterval(interval);
        }
    }, [contract, functionName, args, library, shouldPoll, pollInterval]);
    
    return value;
    }
