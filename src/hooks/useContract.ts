
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

export function useContractFunction(
    contract: Contract | null | undefined,
    functionName: string,
    options?: any
    ) {
    const { library, account } = useActiveWeb3React();
    const [state, setState] = useState<{
        send: (...args: any[]) => Promise<any>;
        state: 'None' | 'Mining' | 'Success' | 'Fail';
        error: Error | null;
    }>({
        send: (...args: any[]) => Promise.resolve(),
        state: 'None',
        error: null,
    });
    
    useEffect(() => {
        if (!contract || !library) return;
    
        const send = async (...args: any[]) => {
        setState((state) => ({ ...state, state: 'Mining' }));
        try {
            const tx = await contract[functionName](...args, options);
            await tx.wait();
            setState((state) => ({ ...state, state: 'Success' }));
        } catch (error) {
            console.error('Failed to send transaction', error);
            setState((state) => ({ ...state, state: 'Fail', error }));
        }
        };
    
        setState((state) => ({ ...state, send }));
    }, [contract, functionName, library]);
    
    return state;
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

export function useContractCalls(
    calls: {
        contract: Contract | null | undefined;
        functionName: string;
        args: any[] | undefined;
    }[]
    ) {
    const { library } = useActiveWeb3React();
    const [values, setValues] = useState<any[]>([]);
    
    useEffect(() => {
        if (!library) return;
    
        const poll = async () => {
        const values = await Promise.all(
            calls.map(async ({ contract, functionName, args }) => {
            if (!contract) return null;
            return await contract[functionName](...args);
            })
        );
        setValues(values);
        };
    
        poll();
    
        const interval = setInterval(poll, 10000);
        return () => clearInterval(interval);
    }, [library, calls]);
    
    return values;
    }

export function useContractEvents(
    contract: Contract | null | undefined,
    eventName: string,
    eventFilter?: any
    ) {
    const { library } = useActiveWeb3React();
    const [events, setEvents] = useState<any[]>([]);
    
    useEffect(() => {
        if (!contract || !library) return;
    
        const poll = async () => {
        const events = await contract.queryFilter(eventName, eventFilter);
        setEvents(events);
        };
    
        poll();
    
        const interval = setInterval(poll, 10000);
        return () => clearInterval(interval);
    }, [contract, eventName, eventFilter, library]);
    
    return events;
    }

export function useContractMultipleData(
    contract: Contract | null | undefined,
    functionName: string,
    argsList: any[][]
    ) {
    const { library } = useActiveWeb3React();
    const [values, setValues] = useState<any[]>([]);
    
    useEffect(() => {
        if (!contract || !library) return;
    
        const poll = async () => {
        const values = await Promise.all(
            argsList.map(async (args) => {
            return await contract[functionName](...args);
            })
        );
        setValues(values);
        };
    
        poll();
    
        const interval = setInterval(poll, 10000);
        return () => clearInterval(interval);
    }, [contract, functionName, argsList, library]);
    
    return values;
    }

export function useContractSingleData(
    contract: Contract | null | undefined,
    functionName: string,
    args: any[]
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
    
        const interval = setInterval(poll, 10000);
        return () => clearInterval(interval);
    }, [contract, functionName, args, library]);
    
    return value;
    }

export function useContractTransaction(
    contract: Contract | null | undefined,
    functionName: string,
    options?: any
    ) {
    const { library, account } = useActiveWeb3React();
    const [state, setState] = useState<{
        send: (...args: any[]) => Promise<any>;
        state: 'None' | 'Mining' | 'Success' | 'Fail';
        error: Error | null;
    }>({
        send: (...args: any[]) => Promise.resolve(),
        state: 'None',
        error: null,
    });
    
    useEffect(() => {
        if (!contract || !library) return;
    
        const send = async (...args: any[]) => {
        setState((state) => ({ ...state, state: 'Mining' }));
        try {
            const tx = await contract[functionName](...args, options);
            await tx.wait();
            setState((state) => ({ ...state, state: 'Success' }));
        } catch (error) {
            console.error('Failed to send transaction', error);
            setState((state) => ({ ...state, state: 'Fail', error }));
        }
        };
    
        setState((state) => ({ ...state, send }));
    }, [contract, functionName, library]);
    
    return state;
    }

export function useContractWrite(
    contract: Contract | null | undefined,
    functionName: string,
    options?: any
    ) {
    const { library, account } = useActiveWeb3React();
    const [state, setState] = useState<{
        send: (...args: any[]) => Promise<any>;
        state: 'None' | 'Mining' | 'Success' | 'Fail';
        error: Error | null;
    }>({
        send: (...args: any[]) => Promise.resolve(),
        state: 'None',
        error: null,
    });
    
    useEffect(() => {
        if (!contract || !library) return;
    
        const send = async (...args: any[]) => {
        setState((state) => ({ ...state, state: 'Mining' }));
        try {
            const tx = await contract[functionName](...args, options);
            await tx.wait();
            setState((state) => ({ ...state, state: 'Success' }));
        } catch (error) {
            console.error('Failed to send transaction', error);
            setState((state) => ({ ...state, state: 'Fail', error }));
        }
        };
    
        setState((state) => ({ ...state, send }));
    }, [contract, functionName, library]);
    
    return state;
    }

export function useDebounce(value: any, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
        const handler = setTimeout(() => {
        setDebouncedValue(value);
        }, delay);
    
        return () => {
        clearTimeout(handler);
        };
    }, [value, delay]);
    
    return debouncedValue;
    }

export function useDebounceCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
    ) {
    const callbackRef = useRef(callback);
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);
    
    return useCallback(
        debounce((...args: any[]) => callbackRef.current(...args), delay),
        [delay]
    );
    }

export function useDebounceFn<T extends (...args: any[]) => any>(
    fn: T,
    delay: number,
    options?: Options
    ) {
    const { run, cancel, ...rest } = useThrottleFn(fn, delay, {
        trailing: false,
        ...options,
    });
    return {
        run: useDebounceCallback(run, delay),
        cancel,
        ...rest,
    };
    }

export function useDebounceValue<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
        const handler = setTimeout(() => {
        setDebouncedValue(value);
        }, delay);
    
        return () => {
        clearTimeout(handler);
        };
    }, [value, delay]);
    
    return debouncedValue;
    }

export function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
    ) {
    const callbackRef = useRef(callback);
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);
    
    return useCallback(
        debounce((...args: any[]) => callbackRef.current(...args), delay),
        [delay]
    );
    }

export function useDebouncedFn<T extends (...args: any[]) => any>(
    fn: T,
    delay: number,
    options?: Options
    ) {
    const { run, cancel, ...rest } = useThrottleFn(fn, delay, {
        trailing: false,
        ...options,
    });
    return {
        run: useDebounceCallback(run, delay),
        cancel,
        ...rest,
    };
    }

export function useDebouncedValue<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
        const handler = setTimeout(() => {
        setDebouncedValue(value);
        }, delay);
    
        return () => {
        clearTimeout(handler);
        };
    }, [value, delay]);
    
    return debouncedValue;
    }

export function useDeepCompareEffect(callback: EffectCallback, dependencies: DependencyList) {
    const ref = useRef<DependencyList>();
    if (!deepEqual(ref.current, dependencies)) {
        ref.current = dependencies;
    }
    useEffect(callback, ref.current);
    }

export function useDeepCompareMemoize(value: any) {
    const ref = useRef();
    
    if (!deepEqual(value, ref.current)) {
        ref.current = value;
    }
    
    return ref.current;
    }

export function useDeepCompareEffectNoCheck(callback: EffectCallback, dependencies: DependencyList) {
    const ref = useRef<DependencyList>();
    if (!deepEqual(ref.current, dependencies)) {
        ref.current = dependencies;
    }
    useEffect(callback, ref.current);
    }

export function useDeepCompareMemoizeNoCheck(value: any) {
    const ref = useRef();
    
    if (!deepEqual(value, ref.current)) {
        ref.current = value;
    }
    
    return ref.current;
    }

