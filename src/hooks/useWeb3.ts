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