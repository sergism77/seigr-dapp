import React from 'react';
import { useMemo } from 'react';
import { Contract } from '@ethersproject/contracts';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { useActiveWeb3React } from './useActiveWeb3React';

export function useActiveWeb3React () {
    const context = useWeb3React();
    const contextNetwork = useWeb3React('NETWORK');
    return context.active ? context : contextNetwork;
}
