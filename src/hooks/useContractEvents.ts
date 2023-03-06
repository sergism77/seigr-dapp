import React from 'react';
import { useMemo } from 'react';
import { Contract } from '@ethersproject/contracts';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { useActiveWeb3React } from './useActiveWeb3React';

export function useContractEvents (
    contract: Contract | null | undefined,
    eventName: string,
    filter: any,
    ) {
    const { library, account } = useActiveWeb3React();
    const [value, setValue] = useState<any>();
    
    useEffect(() => {
        if (!contract || !library) return;

        const poll = async () => {
        const value = await contract.queryFilter(eventName, filter);
        setValue(value);
        };

        poll();

        if (shouldPoll) {
        const interval = setInterval(poll, pollInterval);
        return () => clearInterval(interval);
        }
    }, [contract, eventName, filter, library, shouldPoll, pollInterval]);
    
    return value;
    }

//
//
//
