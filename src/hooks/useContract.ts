
import React from 'react';
import { useMemo } from 'react';
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

    export function Debounce (props: any) {
        const { children, wait, options } = props;
        const callback = useDebounceCallback(children, wait, options);
        return <>{callback}</>;
        }
    
    export function DebounceInput (props: any) {
        const { value, onChange, wait, options, ...rest } = props;
        const debouncedOnChange = useDebounceCallback(onChange, wait, options);
        return <input value={value} onChange={debouncedOnChange} {...rest} />;
        }
        
    export function useDebounceCallback (callback: any, wait: any, options: any) {
        const { leading, trailing } = options || {};
        const [state, setState] = useState({});
        const timeout = React.useRef<any>();
        const callbackRef = React.useRef<any>();
        callbackRef.current = callback;
        const cleanup = React.useCallback(() => {
        if (timeout.current) {
        clearTimeout(timeout.current);
        }
        }, []);
        useEffect(() => {
        return cleanup;
        }, [cleanup]);
        const debouncedCallback = React.useCallback(
        (...args: any) => {
        setState({});
        if (timeout.current) {
        clearTimeout(timeout.current);
        }
        if (leading) {
        const callNow = !timeout.current;
        timeout.current = setTimeout(() => {
        timeout.current = undefined;
        }, wait);
        if (callNow) {
        callbackRef.current(...args);
        }
        } else {
        timeout.current = setTimeout(() => {
        callbackRef.current(...args);
        }, wait);
        }
        },
        [wait, leading]
        );
        const cancel = React.useCallback(() => {
        cleanup();
        }, [cleanup]);
        const flush = React.useCallback(() => {
        cleanup();
        if (timeout.current) {
        callbackRef.current();
        }
        }, [cleanup]);
        return [debouncedCallback, cancel, flush];
        }
