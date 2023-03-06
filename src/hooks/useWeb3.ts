import React from 'react';
import { useMemo } from 'react';
import { Contract } from '@ethersproject/contracts';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { useActiveWeb3React } from './useActiveWeb3React';

export function useWeb3 () {
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
    export function useEagerConnect () {
    const { activate, active } = useWeb3React();
    const [tried, setTried] = useState(false);
    useEffect(() => {
        if (active) {
        setTried(true);
        }
    }
    , [active]);
    useEffect(() => {
        if (!tried && typeof window.ethereum !== 'undefined') {
        activate();
        }
    }
    , [activate, tried]);
    return tried;
    }
    export function useInactiveListener (suppress = false) {
    const { active, error, activate } = useWeb3React();
    useEffect(() => {
        const { ethereum } = window;
        if (ethereum && ethereum.on && !active && !error && !suppress) {
        const handleConnect = () => {
            activate();
        };
        const handleChainChanged = (chainId: string | number) => {
            activate();
        };
        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length > 0) {
            activate();
            }
        };
        const handleNetworkChanged = (networkId: string | number) => {
            activate();
        };
        ethereum.on('connect', handleConnect);
        ethereum.on('chainChanged', handleChainChanged);
        ethereum.on('accountsChanged', handleAccountsChanged);
        ethereum.on('networkChanged', handleNetworkChanged);
        return () => {
            if (ethereum.removeListener) {
            ethereum.removeListener('connect', handleConnect);
            ethereum.removeListener('chainChanged', handleChainChanged);
            ethereum.removeListener('accountsChanged', handleAccountsChanged);
            ethereum.removeListener('networkChanged', handleNetworkChanged);
            }
        };
        }
    }
    , [active, error, suppress, activate]);
    useEffect(() => {
        if (active && error && suppress) {
        activate();
        }
    }
    , [active, error, suppress, activate]);
    }
    export function useContractTransaction(
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
    }
    , [contract, functionName, args, library, shouldPoll, pollInterval]);

    return value;
    }