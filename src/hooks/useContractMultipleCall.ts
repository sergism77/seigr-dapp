import React from 'react';
import { useMemo } from 'react';
import { Contract } from '@ethersproject/contracts';
import { useWeb3React } from '@web3-react/core';    
import { useEffect, useState } from 'react';
import { useActiveWeb3React } from './useActiveWeb3React';

export function useContractMultipleCall (
    contract: Contract | null | undefined,
    functionName: string,
    args: any[] | undefined,
    ) {
    const { library, account } = useActiveWeb3React();
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

//
//
//
