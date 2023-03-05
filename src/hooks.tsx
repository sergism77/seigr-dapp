import { useCallback, useEffect, useState } from "react";
import React from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { injected } from './connectors';
import { Contract } from "ethers";
import { ethers } from "ethers";
import abi from "./abi.json";
import BigNumber from "./bignumber";
import { syncBuiltinESMExports } from "module";
import { ConnectorUpdate } from '@web3-react/types';
import { AbstractConnector } from '@web3-react/abstract-connector';



const walletconnect = new WalletConnectConnector({
    rpc: { 5319: "http://81.191.42.97:10000/" },
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
    pollingInterval: 15000,
});


// useEagerConnect will try to connect the wallet when the page is loaded
// if the wallet is connected, it will return true
// if the wallet is not connected, it will return false



export const ConnectWallet = () => {
    const { active, account, activate, deactivate } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [activatingConnector, setActivatingConnector] = useState<any>("conecting...");
    const [error, setError] = useState<Error | null>(null);
    const [activating, setActivating] = useState(false);
    const [deactivating, setDeactivating] = useState(false);
    const triedEager = useEagerConnect();
    useInactiveListener(!triedEager);
    const activateInjected = useCallback(async () => {
        setActivatingConnector(injected);
        await activate(injected);
    }, [activate]);
    const activateWalletConnect = useCallback(async () => {
        setActivatingConnector(walletconnect);
        await activate(walletconnect);
    }, [activate]);
    const deactivateWallet = useCallback(async () => {
        setDeactivating(true);
        await deactivate();
        setDeactivating(false);
    }, [deactivate]);
    useEffect(() => {
        if (activatingConnector && activatingConnector === injected) {
            activateInjected();
        } else if (activatingConnector && activatingConnector === walletconnect) {
            activateWalletConnect();
        }
    }, [activatingConnector, activateInjected, activateWalletConnect]);
    if (active) {
        return (
            <div className="wallet">
                <p>{account}</p>
                <button onClick={deactivateWallet}>Disconnect</button>
            </div>
        );
    } else {
        return (
            <div className="wallet">
                <button onClick={activateInjected}>Connect</button>
            </div>
        );
    }
};

 const useEagerConnect = () => {
    const { activate, active } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [tried, setTried] = useState(false);

    useEffect(() => {
        injected.isAuthorized().then((isAuthorized) => {
            if (isAuthorized) {
                activate(injected, undefined, true).catch(() => {
                    setTried(true);
                });
            } else {
                setTried(true);
            }
        });
    }, [activate]);

    useEffect(() => {
        if (tried && !active) {
            walletconnect.isAuthorized().then((isAuthorized) => {
                if (isAuthorized) {
                    activate(walletconnect, undefined, true).catch(() => {
                        setTried(true);
                    });
                } else {
                    setTried(true);
                }
            });
        }
    }, [tried, activate, active]);

    useEffect(() => {
        if (tried && !active) {
            walletconnect.isAuthorized().then((isAuthorized) => {
                if (isAuthorized) {
                    activate(walletconnect, undefined, true).catch(() => {
                        setTried(true);
                    });
                } else {
                    setTried(true);
                }
            });
        }
    }, [tried, activate, active]);

    return tried;
};

export { useEagerConnect };



// useContract will return the contract instance
// if the wallet is connected, it will return the contract instance
// if the wallet is not connected, it will return null

const useContract = () => {
    const { active, account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [contract, setContract] = useState<any>(null);
    
    useEffect(() => {
        if (active && account && library) {
            const contract = new ethers.Contract("0x8c7b8c1c3b1f4e2b5c8f6c1c3b1f4e2b5c8f6c1c", abi, library.getSigner());
            setContract(contract);
        } else {
            setContract(null);
        }
    }, [active, account, library]);

    return contract;
};
export { useContract };

// fix  export 'ethers'.'providers' (imported as 'ethers') was not found in 'ethers' 


export { ethers };

export { BigNumber };

export { walletconnect };

export { injected };


//
//
// useContract will return the contract instance
// if the wallet is connected, it will return the contract instance
// if the wallet is not connected, it will return null



// useInactiveListener will try to connect the wallet when the page is loaded
// if the wallet is connected, it will return true
// if the wallet is not connected, it will return false

const useInactiveListener = (suppress: boolean = false) => {
    const { active, error, activate } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [tried, setTried] = useState(false);

    useEffect(() => {
        const { ethereum } = window as any;
        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const handleConnect = () => {
                setTried(false);
                activate(injected);
            };
            const handleChainChanged = (chainId: string | number) => {
                setTried(false);
                activate(injected);
            };
            const handleAccountsChanged = (accounts: string[]) => {
                setTried(false);
                if (accounts.length > 0) {
                    activate(injected);
                }
            };
            const handleNetworkChanged = (networkId: string | number) => {
                setTried(false);
                activate(injected);
            };

            ethereum.on("connect", handleConnect);
            ethereum.on("chainChanged", handleChainChanged);
            ethereum.on("accountsChanged", handleAccountsChanged);
            ethereum.on("networkChanged", handleNetworkChanged);

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener("connect", handleConnect);
                    ethereum.removeListener("chainChanged", handleChainChanged);
                    ethereum.removeListener("accountsChanged", handleAccountsChanged);
                    ethereum.removeListener("networkChanged", handleNetworkChanged);
                }
            };
        }
    }, [active, error, suppress, activate]);

    useEffect(() => {
        if (tried && !active) {
            walletconnect.isAuthorized().then((isAuthorized) => {
                if (isAuthorized) {
                    activate(walletconnect, undefined, true).catch(() => {
                        setTried(true);
                    });
                } else {
                    setTried(true);
                }
            });
        }
    }, [tried, activate, active]);

    return tried;
};
export { useInactiveListener };

export const useContractSend = (contract, method, args) => {
    const { active, account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const send = useCallback(async () => {
        if (active && account && library) {
            try {
                setLoading(true);
                const tx = await contract[method](...args);
                const receipt = await tx.wait();
                setData(receipt);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
    }, [active, account, library, contract, method, args]);

    return [data, loading, error, send];
};
    export const useContractSendWithSigner = (contract, method, args) => {
        const { active, account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
        const [data, setData] = useState(null);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);

        const send = useCallback(async () => {
            if (active && account && library) {
                try {
                    setLoading(true);
                    const tx = await contract.connect(library.getSigner())[method](...args);
                    const receipt = await tx.wait();
                    setData(receipt);
                } catch (error) {
                    setError(error);
                } finally {
                    setLoading(false);
                }
            }
        }, [active, account, library, contract, method, args]);

        return [data, loading, error, send];
    };

export const useContractCall = (contract, method, args) => {
    const { active, account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const call = useCallback(async () => {
        if (active && account && library) {
            try {
                setLoading(true);
                const result = await contract[method](...args);
                setData(result);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    }, [active, account, library, contract, method, args]);

    return [data, loading, call];
};  

export const useContractCallWithSigner = (contract, method, args) => {
    const { active, account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const call = useCallback(async () => {
        if (active && account && library) {
            try {
                setLoading(true);
                const result = await contract.connect(library.getSigner())[method](...args);
                setData(result);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    }, [active, account, library, contract, method, args]);

    return [data, loading, call];
};

export const useContractCallWithSignerAndArgs = (contract, method, args) => {
    const { active, account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const call = useCallback(async () => {
        if (active && account && library) {
            try {
                setLoading(true);
                const result = await contract.connect(library.getSigner())[method](args);
                setData(result);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    }, [active, account, library, contract, method, args]);

    return [data, loading, call];
};

export const useContractFunctionWithSignerAndArgs = (contract, method, args) => {
    const { active, account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const send = useCallback(async () => {
        if (active && account && library) {
            try {
                setLoading(true);
                const tx = await contract.connect(library.getSigner())[method](args);
                const receipt = await tx.wait();
                setData(receipt);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }   
        }   
    }, [active, account, library, contract, method, args]);

    return [data, loading, error, send];
};

export const useContractFunctionWithSignerAndArgsAndValue = (contract, method, args, value) => {
    const { active, account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const send = useCallback(async () => {
        if (active && account && library) {
            try {
                setLoading(true);
                const tx = await contract.connect(library.getSigner())[method](args, { value: value });
                const receipt = await tx.wait();
                setData(receipt);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
    }, [active, account, library, contract, method, args, value]);

    return [data, loading, error, send];
};

export const useContractFunctionWithSignerAndValueAndGasLimit = (contract, method, args, value, gasLimit) => {
    const { active, account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const send = useCallback(async () => {
        if (active && account && library) {
            try {
                setLoading(true);
                const tx = await contract.connect(library.getSigner())[method](...args, { value: value, gasLimit: gasLimit });
                const receipt = await tx.wait();
                setData(receipt);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
    }, [active, account, library, contract, method, args, value, gasLimit]);

    return [data, loading, error, send];
};

export const useContractFunctionWithSigner = (contract, method, args) => {
    const { active, account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const send = useCallback(async () => {
        if (active && account && library) {
            try {
                setLoading(true);
                const tx = await contract.connect(library.getSigner())[method](...args);
                const receipt = await tx.wait();
                setData(receipt);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
    }, [active, account, library, contract, method, args]);

    return [data, loading, error, send];
};

export const useContractFunction = (contract, method, args) => {
    const { active, account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const send = useCallback(async () => {
        if (active && account && library) {
            try {
                setLoading(true);
                const tx = await contract[method](...args);
                const receipt = await tx.wait();
                setData(receipt);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
    }, [active, account, library, contract, method, args]);

    return [data, loading, error, send];
};

export const useContractFunctionWithSignerAndGasLimitAndGasPrice = (contract, method, args, gasLimit, gasPrice) => {
    const { active, account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const send = useCallback(async () => {
        if (active && account && library) {
            try {
                setLoading(true);
                const tx = await contract.connect(library.getSigner())[method](...args, { gasLimit: gasLimit, gasPrice: gasPrice });
                const receipt = await tx.wait();
                setData(receipt);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
    }, [active, account, library, contract, method, args, gasLimit, gasPrice]);

    return [data, loading, error, send];
};

export const useContractFunctionWithSignerAndGasLimitAndGasPriceAndValue = (contract, method, args, gasLimit, gasPrice, value) => {
    const { active, account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const send = useCallback(async () => {
        if (active && account && library) {
            try {
                setLoading(true);
                const tx = await contract.connect(library.getSigner())[method](...args, { gasLimit: gasLimit, gasPrice: gasPrice, value: value });
                const receipt = await tx.wait();
                setData(receipt);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
    }, [active, account, library, contract, method, args, gasLimit, gasPrice, value]);

    return [data, loading, error, send];
};

export const useContractFunctionWithSignerAndGasLimitAndValue = (contract, method, args, gasLimit, value) => {
    const { active, account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const send = useCallback(async () => {
        if (active && account && library) {
            try {
                setLoading(true);
                const tx = await contract.connect(library.getSigner())[method](...args, { gasLimit: gasLimit, value: value });
                const receipt = await tx.wait();
                setData(receipt);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
    }, [active, account, library, contract, method, args, gasLimit, value]);

    return [data, loading, error, send];
};

export const useContractFunctionWithSignerAndGasLimit = (contract, method, args, gasLimit) => {
    const { active, account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const send = useCallback(async () => {
        if (active && account && library) {
            try {
                setLoading(true);
                const tx = await contract.connect(library.getSigner())[method](...args, { gasLimit: gasLimit });
                const receipt = await tx.wait();
                setData(receipt);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
    }, [active, account, library, contract, method, args, gasLimit]);

    return [data, loading, error, send];
};

export const useContractFunctionWithSignerAndGasPrice = (contract, method, args, gasPrice) => {
    const { active, account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const send = useCallback(async () => {
        if (active && account && library) {
            try {
                setLoading(true);
                const tx = await contract.connect(library.getSigner())[method](...args, { gasPrice: gasPrice });
                const receipt = await tx.wait();
                setData(receipt);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
    }, [active, account, library, contract, method, args, gasPrice]);

    return [data, loading, error, send];
};

export const useContractFunctionWithSignerAndValue = (contract, method, args, value) => {
    const { active, account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const send = useCallback(async () => {
        if (active && account && library) {
            try {
                setLoading(true);
                const tx = await contract.connect(library.getSigner())[method](...args, { value: value });
                const receipt = await tx.wait();
                setData(receipt);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
    }, [active, account, library, contract, method, args, value]);

    return [data, loading, error, send];
};

const useWalletModal = () => {
    const [show, setShow] = useState(false);
    const toggleWalletModal = useCallback(() => {
        setShow(!show);
    }, [show]);
    return [show, toggleWalletModal];
};

const useMemo = React.useMemo;
const provider = new ethers.providers.JsonRpcProvider("http://81.191.42.97:10000/");
const signer = provider.getSigner();
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contract = new ethers.Contract(contractAddress, abi, signer);
const formatEther = ethers.utils.formatEther;
const parseEther = ethers.utils.parseEther;
const ERC20 = contract;

export const useERC20 = () => {
    const [balance, setBalance] = useState(0);
    const [allowance, setAllowance] = useState(0);
    const [decimals, setDecimals] = useState(0);
    const [symbol, setSymbol] = useState("");
    const [name, setName] = useState("");
    const [totalSupply, setTotalSupply] = useState(0);
    const [contract, setContract] = useState(null);
    const { active, account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [tried, setTried] = useState(false);
    const [connectorName, setConnectorName] = useState("Injected");
    const { connector, activate: activateConnector, error } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const currentConnector = connectorsByName[connectorName];
    const activatingConnector = useEagerConnect();
    const connected = useInactiveListener(!tried || !!activatingConnector || connector !== currentConnector);

    useEffect(() => {
        if (activatingConnector && activatingConnector === currentConnector) {
            setTried(true);
        }
    }, [activatingConnector, currentConnector]);

    useEffect(() => {
        if (connected && !tried) {
            setTried(true);
        }
    }, [connected, tried]);

    useEffect(() => {
        if (error) {
            setTried(true);
        }
    }, [error]);

    const tryActivation = async (connector: AbstractConnector | undefined) => {
        setConnectorName(connectorName);
        if (connector) {
            activateConnector(connector, undefined, true).catch((error) => {
                if (error instanceof UnsupportedChainIdError) {
                    activateConnector(connector);
                } else {
                    setTried(true);
                }
            });
        }
    };

    const onConnect = useCallback(() => {
        tryActivation(currentConnector);
    }, [currentConnector]);

    useEffect(() => {
        if (active) {
            const contract = new ethers.Contract(contractAddress, abi, signer);
            setContract(contract);
        }
    }, [active]);

    useEffect(() => {
        if (contract) {
            contract.balanceOf(account).then((balance) => {
                setBalance(balance);
            });
            contract.allowance(account, contractAddress).then((allowance) => {
                setAllowance(allowance);
            });
            contract.decimals().then((decimals) => {
                setDecimals(decimals);
            });
            contract.symbol().then((symbol) => {
                setSymbol(symbol);
            });
            contract.name().then((name) => {
                setName(name);
            });
            contract.totalSupply().then((totalSupply) => {
                setTotalSupply(totalSupply);
            });
        }
    }, [contract]);

    return [balance, allowance, decimals, symbol, name, totalSupply, contract, onConnect];
};

export const useERC20Balance = () => {
    const [balance, setBalance] = useState(0);
    const { active, account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [tried, setTried] = useState(false);
    const [connectorName, setConnectorName] = useState("Injected");
    const { connector, activate: activateConnector, error } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const currentConnector = connectorsByName[connectorName];
    const activatingConnector = useEagerConnect();
    const connected = useInactiveListener(!tried || !!activatingConnector || connector !== currentConnector);

    useEffect(() => {
        if (activatingConnector && activatingConnector === currentConnector) {
            setTried(true);
        }
    }, [activatingConnector, currentConnector]);

    useEffect(() => {
        if (connected && !tried) {
            setTried(true);
        }
    }, [connected, tried]);

    useEffect(() => {
        if (error) {
            setTried(true);
        }
    }, [error]);

    const tryActivation = async (connector: AbstractConnector | undefined) => {
        setConnectorName(connectorName);
        if (connector) {
            activateConnector(connector, undefined, true).catch((error) => {
                if (error instanceof UnsupportedChainIdError) {
                    activateConnector(connector);
                } else {
                    setTried(true);
                }
            });
        }
    };

    const onConnect = useCallback(() => {
        tryActivation(currentConnector);
    }, [currentConnector]);

    useEffect(() => {
        if (active) {
            const contract = new ethers.Contract(contractAddress, abi, signer);
            contract.balanceOf(account).then((balance) => {
                setBalance(balance);
            });
        }
    }, [active]);

    return [balance, onConnect];
};

export const useERC20Allowance = () => {
    const [allowance, setAllowance] = useState(0);
    const { active, account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [tried, setTried] = useState(false);
    const [connectorName, setConnectorName] = useState("Injected");
    const { connector, activate: activateConnector, error } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const currentConnector = connectorsByName[connectorName];
    const activatingConnector = useEagerConnect();
    const connected = useInactiveListener(!tried || !!activatingConnector || connector !== currentConnector);

    useEffect(() => {
        if (activatingConnector && activatingConnector === currentConnector) {
            setTried(true);
        }
    }, [activatingConnector, currentConnector]);

    useEffect(() => {
        if (connected && !tried) {
            setTried(true);
        }
    }, [connected, tried]);

    useEffect(() => {
        if (error) {
            setTried(true);
        }
    }, [error]);

    const tryActivation = async (connector: AbstractConnector | undefined) => {
        setConnectorName(connectorName);
        if (connector) {
            activateConnector(connector, undefined, true).catch((error) => {
                if (error instanceof UnsupportedChainIdError) {
                    activateConnector(connector);
                } else {
                    setTried(true);
                }
            });
        }
    };

    const onConnect = useCallback(() => {
        tryActivation(currentConnector);
    }, [currentConnector]);

    useEffect(() => {
        if (active) {
            const contract = new ethers.Contract(contractAddress, abi, signer);
            contract.allowance(account, contractAddress).then((allowance) => {
                setAllowance(allowance);
            });
        }
    }, [active]);

    return [allowance, onConnect];
};

export const useERC20Decimals = () => {
    const [decimals, setDecimals] = useState(0);
    const { active, account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [tried, setTried] = useState(false);
    const [connectorName, setConnectorName] = useState("Injected");
    const { connector, activate: activateConnector, error } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const currentConnector = connectorsByName[connectorName];
    const activatingConnector = useEagerConnect();
    const connected = useInactiveListener(!tried || !!activatingConnector || connector !== currentConnector);

    useEffect(() => {
        if (activatingConnector && activatingConnector === currentConnector) {
            setTried(true);
        }
    }, [activatingConnector, currentConnector]);

    useEffect(() => {
        if (connected && !tried) {
            setTried(true);
        }
    }, [connected, tried]);

    useEffect(() => {
        if (error) {
            setTried(true);
        }
    }, [error]);

    const tryActivation = async (connector: AbstractConnector | undefined) => {
        setConnectorName(connectorName);
        if (connector) {
            activateConnector(connector, undefined, true).catch((error) => {
                if (error instanceof UnsupportedChainIdError) {
                    activateConnector(connector);
                } else {
                    setTried(true);
                }
            });
        }
    };

    const onConnect = useCallback(() => {
        tryActivation(currentConnector);
    }, [currentConnector]);

    useEffect(() => {
        if (active) {
            const contract = new ethers.Contract(contractAddress, abi, signer);
            contract.decimals().then((decimals) => {
                setDecimals(decimals);
            });
        }
    }, [active]);

    return [decimals, onConnect];
};

export const useERC20Symbol = () => {
    const [symbol, setSymbol] = useState("");
    const { active, account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [tried, setTried] = useState(false);
    const [connectorName, setConnectorName] = useState("Injected");
    const { connector, activate: activateConnector, error } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const currentConnector = connectorsByName[connectorName];
    const activatingConnector = useEagerConnect();
    const connected = useInactiveListener(!tried || !!activatingConnector || connector !== currentConnector);

    useEffect(() => {
        if (activatingConnector && activatingConnector === currentConnector) {
            setTried(true);
        }
    }, [activatingConnector, currentConnector]);

    useEffect(() => {
        if (connected && !tried) {
            setTried(true);
        }
    }, [connected, tried]);

    useEffect(() => {
        if (error) {
            setTried(true);
        }
    }, [error]);

    const tryActivation = async (connector: AbstractConnector | undefined) => {
        setConnectorName(connectorName);
        if (connector) {
            activateConnector(connector, undefined, true).catch((error) => {
                if (error instanceof UnsupportedChainIdError) {
                    activateConnector(connector);
                } else {
                    setTried(true);
                }
            });
        }
    };

    const onConnect = useCallback(() => {
        tryActivation(currentConnector);
    }, [currentConnector]);

    useEffect(() => {
        if (active) {
            const contract = new ethers.Contract(contractAddress, abi, signer);
            contract.symbol().then((symbol) => {
                setSymbol(symbol);
            });
        }
    }, [active]);

    return [symbol, onConnect];
};

export function useWalletModalToggle() {
    const [show, setShow] = useState(false);
    const toggleWalletModal = useCallback(() => {
        setShow(!show);
    }, [show]);
    return [show, toggleWalletModal];
}

export function useWalletModalOpen() {
    const [show, setShow] = useState(false);
    const openWalletModal = useCallback(() => {
        setShow(true);
    }, []);
    return [show, openWalletModal];
}

export function useWalletModalClose() {
    const [show, setShow] = useState(false);
    const closeWalletModal = useCallback(() => {
        setShow(false);
    }, []);
    return [show, closeWalletModal];
}

export function useWeb3ReactManager() {
    const { active, error, activate, deactivate } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const { connector, activate: activateConnector } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const { connector: currentConnector } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const { connector: activatingConnector, error: activatingConnectorError } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const { account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const { chainId } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const { connector: walletconnect } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const { connector: walletlink } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const { connector: fortmatic } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const { connector: portis } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");

    const triedEager = useEagerConnect();
    useInactiveListener(!triedEager || !!activatingConnector);
    const [walletModalOpen, toggleWalletModal] = useWalletModal();
    const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>();
    const [pendingError, setPendingError] = useState<boolean>();
    const [pendingWalletModalOpen, togglePendingWalletModal] = useWalletModal();
    const tryActivation = async (connector: AbstractConnector | undefined) => {
        setActivatingConnector(connector);
        setActivatingConnectorError(undefined);
        setPendingWallet(connector);
        togglePendingWalletModal();
        await activate(connector, undefined, true).catch((error) => {
            setActivatingConnectorError(error);
            setPendingError(true);
        });
        setActivatingConnector(undefined);
        setPendingWallet(undefined);
        togglePendingWalletModal();
    };
    const context = {
        account,
        chainId,
        library,
        active,
        error,
        activate,
        deactivate,
        connector,
        activatingConnector,
        activatingConnectorError,
        triedEager,
        walletModalOpen,
        toggleWalletModal,
        pendingWallet,
        pendingError,
        pendingWalletModalOpen,
        togglePendingWalletModal,
        tryActivation,
        walletconnect,
        walletlink,
        fortmatic,
        portis,
    };
    return context;
}


export function useWeb3ReactCore() {
    const context = useContext(Web3ReactContext);
    if (context === undefined) {
        throw new Error("useWeb3ReactCore must be used within a Web3ReactProvider");
    }
    return context;
}




export interface Web3ReactProviderProps {
    getLibrary: (provider: any, connector: AbstractConnector) => Web3Provider;
    children: ReactNode;
}

export interface Web3ReactProviderCoreProps extends Web3ReactProviderProps {
    context: React.Context<Web3ReactContextInterface<Web3Provider>>;
}

export function Web3ReactProviderCoreImpl({
    getLibrary,
    context,
    children,
}: Web3ReactProviderCoreProps) {
    const manager = useWeb3ReactManager();
    const contextValue = useMemo(() => {
        return {
            ...manager,
            getLibrary,
        };
    }, [manager, getLibrary]);

    return <context.Provider value={contextValue}>{children}</context.Provider>;
}

export function Web3ReactProviderCore({ getLibrary, children }: Web3ReactProviderProps) {
    return (
        <Web3ReactProviderCoreImpl getLibrary={getLibrary} context={Web3ReactContext}>
            {children}
        </Web3ReactProviderCoreImpl>
    );
}


export function Web3ReactProvider({ getLibrary, children }: Web3ReactProviderProps) {
    const context = useWeb3ReactManager();
    return (
        <Web3ReactContext.Provider value={context}>
            <Web3ReactProviderCore getLibrary={getLibrary}>{children}</Web3ReactProviderCore>
        </Web3ReactContext.Provider>
    );
}



export function useEthers() {
    const { library, chainId, account, activate, deactivate, active, error } = useWeb3React<Web3Provider>();
    return {
        library,
        chainId,
        account,
        activate,
        deactivate,
        active,
        error,
    };
}


export function useEthersContract(address: string | undefined, ABI: any, withSignerIfPossible = true) {
    const { library, account } = useWeb3React<Web3Provider>();
    return useMemo(() => {
        if (!address || !ABI || !library) return;
        try {
            return new Contract(address, ABI, withSignerIfPossible && account ? library.getSigner(account).connectUnchecked() : library);
        } catch (error) {
            console.log("Failed to get contract", error);
            return null;
        }
    }, [address, ABI, withSignerIfPossible, library, account]);
}

export function useEthersContractReadOnly(address: string | undefined, ABI: any) {
    const { library } = useWeb3React<Web3Provider>();
    return useMemo(() => {
        if (!address || !ABI || !library) return;
        try {
            return new Contract(address, ABI, library);
        } catch (error) {
            console.log("Failed to get contract", error);
            return null;
        }
    }, [address, ABI, library]);
}

export function useEthersContractFunction(contract: Contract | null | undefined, functionName: string, options?: ContractFunctionOptions) {
    const { library, account } = useWeb3React<Web3Provider>();
    const [state, setState] = useState<ContractFunctionState>({});
    const [args, setArgs] = useState<any[]>([]);
    const [tx, setTx] = useState<ContractTransaction | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [receipt, setReceipt] = useState<ContractReceipt | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [called, setCalled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [confirmed, setConfirmed] = useState<boolean>(false);
    const [confirmedBlockNumber, setConfirmedBlockNumber] = useState<number | null>(null);
    const [confirmedBlock, setConfirmedBlock] = useState<Block | null>(null);
    const [confirmedTransaction, setConfirmedTransaction] = useState<TransactionResponse | null>(null);
    const [confirmedReceipt, setConfirmedReceipt] = useState<ContractReceipt | null>(null);
    const [confirmedError, setConfirmedError] = useState<Error | null>(null);
    const [confirmedCalled, setConfirmedCalled] = useState<boolean>(false);
    const [confirmedLoading, setConfirmedLoading] = useState<boolean>(false);
    const [confirmedArgs, setConfirmedArgs] = useState<any[]>([]);
    const [confirmedTx, setConfirmedTx] = useState<ContractTransaction | null>(null);
    const [confirmedTxHash, setConfirmedTxHash] = useState<string | null>(null);
    const send = useCallback(
        async (...args: any[]) => {
            if (!contract || !library || !account) return;
            setCalled(true);
            setLoading(true);
            setArgs(args);
            try {
                const tx = await contract.estimateGas[functionName](...args, options);
                setTx(tx);
                const txHash = await tx.send({ from: account });
                setTxHash(txHash);
                const receipt = await txHash.wait();
                setReceipt(receipt);
                setError(null);
                setCalled(false);
                setLoading(false);
            } catch (error) {
                setError(error);
                setCalled(false);
                setLoading(false);
            }
        },
        [contract, library, account, functionName, options]
    );

    const sendConfirmed = useCallback(
        async (...args: any[]) => {
            if (!contract || !library || !account) return;
            setConfirmedCalled(true);
            setConfirmedLoading(true);
            setConfirmedArgs(args);
            try {
                const tx = await contract.estimateGas[functionName](...args, options);
                setConfirmedTx(tx);
                const txHash = await tx.send({ from: account });
                setConfirmedTxHash(txHash);
                const receipt = await txHash.wait();
                setConfirmedReceipt(receipt);
                setConfirmedError(null);
                setConfirmedCalled(false);
                setConfirmedLoading(false);
            } catch (error) {
                setConfirmedError(error);
                setConfirmedCalled(false);
                setConfirmedLoading(false);
            }
        },
        [contract, library, account, functionName, options]
    );
        
    useEffect(() => {
        if (!contract || !library || !account) return;
        const blockNumber = library.getBlockNumber();
        const block = library.getBlock(blockNumber);
        const transaction = library.getTransaction(txHash);
        Promise.all([blockNumber, block, transaction]).then(([blockNumber, block, transaction]) => {
            setConfirmedBlockNumber(blockNumber);
            setConfirmedBlock(block);
            setConfirmedTransaction(transaction);
        });
    }, [contract, library, account, txHash]);

    useEffect(() => {
        if (!contract || !library || !account) return;
        const blockNumber = library.getBlockNumber();
        const block = library.getBlock(blockNumber);
        const transaction = library.getTransaction(confirmedTxHash);
        Promise.all([blockNumber, block, transaction]).then(([blockNumber, block, transaction]) => {
            setConfirmedBlockNumber(blockNumber);
            setConfirmedBlock(block);
            setConfirmedTransaction(transaction);
        });
    }, [contract, library, account, confirmedTxHash]);

    return {
        send,
        sendConfirmed,
        state,
        args,
        tx,
        txHash,
        receipt,
        error,
        called,
        loading,
        confirmed,
        confirmedBlockNumber,
        confirmedBlock,
        confirmedTransaction,
        confirmedReceipt,
        confirmedError,
        confirmedCalled,
        confirmedLoading,
        confirmedArgs,
        confirmedTx,
        confirmedTxHash,
    };
}

// fix export 'useContractTransaction' was not found in './hooks'

export function useContractTransaction(contract: Contract | null | undefined, functionName: string, options?: ContractFunctionOptions) {
    const { library, account } = useWeb3React<Web3Provider>();
    const [state, setState] = useState<ContractFunctionState>({});
    const [args, setArgs] = useState<any[]>([]);
    const [tx, setTx] = useState<ContractTransaction | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [receipt, setReceipt] = useState<ContractReceipt | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [called, setCalled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [confirmed, setConfirmed] = useState<boolean>(false);
    const [confirmedBlockNumber, setConfirmedBlockNumber] = useState<number | null>(null);
    const [confirmedBlock, setConfirmedBlock] = useState<Block | null>(null);
    const [confirmedTransaction, setConfirmedTransaction] = useState<TransactionResponse | null>(null);
    const [confirmedReceipt, setConfirmedReceipt] = useState<ContractReceipt | null>(null);
    const [confirmedError, setConfirmedError] = useState<Error | null>(null);
    const [confirmedCalled, setConfirmedCalled] = useState<boolean>(false);
    const [confirmedLoading, setConfirmedLoading] = useState<boolean>(false);
    const [confirmedArgs, setConfirmedArgs] = useState<any[]>([]);
    const [confirmedTx, setConfirmedTx] = useState<ContractTransaction | null>(null);
    const [confirmedTxHash, setConfirmedTxHash] = useState<string | null>(null);
    const send = useCallback(
        async (...args: any[]) => {
            if (!contract || !library || !account) return;
            setCalled(true);
            setLoading(true);
            setArgs(args);
            try {
                const tx = await contract.estimateGas[functionName](...args, options);
                setTx(tx);
                const txHash = await tx.send({ from: account });
                setTxHash(txHash);
                const receipt = await txHash.wait();
                setReceipt(receipt);
                setError(null);
                setCalled(false);
                setLoading(false);
            } catch (error) {
                setError(error);
                setCalled(false);
                setLoading(false);
            }
        },
        [contract, library, account, functionName, options]
    );

    const sendConfirmed = useCallback(
        async (...args: any[]) => {
            if (!contract || !library || !account) return;
            setConfirmedCalled(true);
            setConfirmedLoading(true);
            setConfirmedArgs(args);
            try {
                const tx = await contract.estimateGas[functionName](...args, options);
                setConfirmedTx(tx);
                const txHash = await tx.send({ from: account });
                setConfirmedTxHash(txHash);
                const receipt = await txHash.wait();
                setConfirmedReceipt(receipt);
                setConfirmedError(null);
                setConfirmedCalled(false);
                setConfirmedLoading(false);
            } catch (error) {
                setConfirmedError(error);
                setConfirmedCalled(false);
                setConfirmedLoading(false);
            }
        },
        [contract, library, account, functionName, options]
    );

    useEffect(() => {
        if (!contract || !library || !account) return;
        const blockNumber = library.getBlockNumber();
        const block = library.getBlock(blockNumber);
        const transaction = library.getTransaction(txHash);
        Promise.all([blockNumber, block, transaction]).then(([blockNumber, block, transaction]) => {
            setConfirmedBlockNumber(blockNumber);
            setConfirmedBlock(block);
            setConfirmedTransaction(transaction);
        });
    }, [contract, library, account, txHash]);

    useEffect(() => {
        if (!contract || !library || !account) return;
        const blockNumber = library.getBlockNumber();
        const block = library.getBlock(blockNumber);
        const transaction = library.getTransaction(confirmedTxHash);
        Promise.all([blockNumber, block, transaction]).then(([blockNumber, block, transaction]) => {
            setConfirmedBlockNumber(blockNumber);
            setConfirmedBlock(block);
            setConfirmedTransaction(transaction);
        });
    }, [contract, library, account, confirmedTxHash]);

    return {
        send,
        sendConfirmed,
        state,
        args,
        tx,
        txHash,
        receipt,
        error,
        called,
        loading,
        confirmed,
        confirmedBlockNumber,
        confirmedBlock,
        confirmedTransaction,
        confirmedReceipt,
        confirmedError,
        confirmedCalled,
        confirmedLoading,
        confirmedArgs,
        confirmedTx,
        confirmedTxHash,
    };
}

// fix export 'useEthersContractEvents' was not found in './hooks'

export function useEthersContractEvents(contract: Contract | null | undefined, eventName: string, options?: ContractEventOptions) {
    const { library, account } = useWeb3React<Web3Provider>();
    const [state, setState] = useState<ContractEventState>({});
    const [args, setArgs] = useState<any[]>([]);
    const [called, setCalled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [result, setResult] = useState<any>();

    const call = useCallback(
        async (...args: any[]) => {
            if (!contract || !library || !account) return;
            setCalled(true);
            setLoading(true);
            setArgs(args);
            try {
                const result = await contract.queryFilter(eventName, ...args, options);
                setResult(result);
                setError(null);
                setCalled(false);
                setLoading(false);
            } catch (error) {
                setError(error);
                setCalled(false);
                setLoading(false);
            }
        },
        [contract, library, account, eventName, options]
    );

    return {
        call,
        state,
        args,
        result,
        error,
        called,
        loading,
    };
}

// fix export 'useContractEvents' was not found in './hooks'

export function useContractEvents(contract: Contract | null | undefined, eventName: string, options?: ContractEventOptions) {
    const { library, account } = useWeb3React<Web3Provider>();
    const [state, setState] = useState<ContractEventState>({});
    const [args, setArgs] = useState<any[]>([]);
    const [called, setCalled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [result, setResult] = useState<any>();

    const call = useCallback(
        async (...args: any[]) => {
            if (!contract || !library || !account) return;
            setCalled(true);
            setLoading(true);
            setArgs(args);
            try {
                const result = await contract.queryFilter(eventName, ...args, options);
                setResult(result);
                setError(null);
                setCalled(false);
                setLoading(false);
            } catch (error) {
                setError(error);
                setCalled(false);
                setLoading(false);
            }
        },
        [contract, library, account, eventName, options]
    );

    return {
        call,
        state,
        args,
        result,
        error,
        called,
        loading,
    };
}

// fix export 'useContractMultipleData' was not found in './hooks'

export function useContractMultipleData(
    contract: Contract | null | undefined,
    functionName: string,
    options?: ContractFunctionOptions,
    ...args: any[]
) {
    const { library, account } = useWeb3React<Web3Provider>();
    const [state, setState] = useState<ContractMultipleDataState>({});
    const [called, setCalled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [result, setResult] = useState<any>();

    const call = useCallback(
        async (...args: any[]) => {
            if (!contract || !library || !account) return;
            setCalled(true);
            setLoading(true);
            try {
                const result = await contract.callStatic[functionName](...args, options);
                setResult(result);
                setError(null);
                setCalled(false);
                setLoading(false);
            } catch (error) {
                setError(error);
                setCalled(false);
                setLoading(false);
            }
        },
        [contract, library, account, functionName, options]
    );

    return {
        call,
        state,
        result,
        error,
        called,
        loading,
    };
}

// fix export 'useContractSingleData' was not found in './hooks'

export function useContractSingleData(
    contract: Contract | null | undefined,
    functionName: string,
    options?: ContractFunctionOptions,
    ...args: any[]
) {
    const { library, account } = useWeb3React<Web3Provider>();
    const [state, setState] = useState<ContractSingleDataState>({});
    const [called, setCalled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [result, setResult] = useState<any>();

    const call = useCallback(
        async (...args: any[]) => {
            if (!contract || !library || !account) return;
            setCalled(true);
            setLoading(true);
            try {
                const result = await contract.callStatic[functionName](...args, options);
                setResult(result);
                setError(null);
                setCalled(false);
                setLoading(false);
            } catch (error) {
                setError(error);
                setCalled(false);
                setLoading(false);
            }
        },
        [contract, library, account, functionName, options]
    );

    return {
        call,
        state,
        result,
        error,
        called,
        loading,
    };
}

// fix export 'useContractMultipleCall' was not found in './hooks'

export function useContractMultipleCall(
    contract: Contract | null | undefined,
    functionName: string,
    options?: ContractFunctionOptions,
    ...args: any[]
) {
    const { library, account } = useWeb3React<Web3Provider>();
    const [state, setState] = useState<ContractMultipleCallState>({});
    const [called, setCalled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [result, setResult] = useState<any>();

    const call = useCallback(
        async (...args: any[]) => {
            if (!contract || !library || !account) return;
            setCalled(true);
            setLoading(true);
            try {
                const result = await contract.callStatic[functionName](...args, options);
                setResult(result);
                setError(null);
                setCalled(false);
                setLoading(false);
            } catch (error) {
                setError(error);
                setCalled(false);
                setLoading(false);
            }
        },
        [contract, library, account, functionName, options]
    );

    return {
        call,
        state,
        result,
        error,
        called,
        loading,
    };
}

// fix export 'useContractSingleCall' was not found in './hooks'

export function useContractSingleCall(
    contract: Contract | null | undefined,
    functionName: string,
    options?: ContractFunctionOptions,
    ...args: any[]
) {
    const { library, account } = useWeb3React<Web3Provider>();
    const [state, setState] = useState<ContractSingleCallState>({});
    const [called, setCalled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [result, setResult] = useState<any>();

    const call = useCallback(
        async (...args: any[]) => {
            if (!contract || !library || !account) return;
            setCalled(true);
            setLoading(true);
            try {
                const result = await contract.callStatic[functionName](...args, options);
                setResult(result);
                setError(null);
                setCalled(false);
                setLoading(false);
            } catch (error) {
                setError(error);
                setCalled(false);
                setLoading(false);
            }
        },
        [contract, library, account, functionName, options]
    );

    return {
        call,
        state,
        result,
        error,
        called,
        loading,
    };
}

// fix export 'useContractSingleCallResult' was not found in './hooks'

export function useContractSingleCallResult(
    contract: Contract | null | undefined,
    functionName: string,
    options?: ContractFunctionOptions,
    ...args: any[]
) {
    const { library, account } = useWeb3React<Web3Provider>();
    const [state, setState] = useState<ContractSingleCallResultState>({});
    const [called, setCalled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [result, setResult] = useState<any>();

    const call = useCallback(
        async (...args: any[]) => {
            if (!contract || !library || !account) return;
            setCalled(true);
            setLoading(true);
            try {
                const result = await contract.callStatic[functionName](...args, options);
                setResult(result);
                setError(null);
                setCalled(false);
                setLoading(false);
            } catch (error) {
                setError(error);
                setCalled(false);
                setLoading(false);
            }
        },
        [contract, library, account, functionName, options]
    );

    return {
        call,
        state,
        result,
        error,
        called,
        loading,
    };
}

// fix export 'useContractMultipleCallResult' was not found in './hooks'

export function useContractMultipleCallResult(
    contract: Contract | null | undefined,
    functionName: string,
    options?: ContractFunctionOptions,
    ...args: any[]
) {
    const { library, account } = useWeb3React<Web3Provider>();
    const [state, setState] = useState<ContractMultipleCallResultState>({});
    const [called, setCalled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [result, setResult] = useState<any>();

    const call = useCallback(
        async (...args: any[]) => {
            if (!contract || !library || !account) return;
            setCalled(true);
            setLoading(true);
            try {
                const result = await contract.callStatic[functionName](...args, options);
                setResult(result);
                setError(null);
                setCalled(false);
                setLoading(false);
            } catch (error) {
                setError(error);
                setCalled(false);
                setLoading(false);
            }
        },
        [contract, library, account, functionName, options]
    );

    return {
        call,
        state,
        result,
        error,
        called,
        loading,
    };
}



export function useEthersContractFunctionReadOnly(contract: Contract | null | undefined, functionName: string, options?: ContractFunctionOptions) {
    const { library, account } = useWeb3React<Web3Provider>();
    const [state, setState] = useState<ContractFunctionState>({});
    const [args, setArgs] = useState<any[]>([]);
    const [called, setCalled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [result, setResult] = useState<any>();

    const call = useCallback(
        async (...args: any[]) => {
            if (!contract || !library || !account) return;
            setCalled(true);
            setLoading(true);
            setArgs(args);
            try {
                const result = await contract.callStatic[functionName](...args, options);
                setResult(result);
                setError(null);
                setCalled(false);
                setLoading(false);
            } catch (error) {
                setError(error);
                setCalled(false);
                setLoading(false);
            }
        },
        [contract, library, account, functionName, options]
    );

    return {
        call,
        state,
        args,
        error,
        called,
        loading,
        result,
    };
}

export function useEthersContractLoader(injectedProvider: any, localProvider: any, account: string | null | undefined, ABI: any, address: string | undefined) {
    const [readContracts, setReadContracts] = useState<any>();
    const [writeContracts, setWriteContracts] = useState<any>();

    useEffect(() => {
        if (typeof window !== "undefined" && window.ethereum) {
            setInjectedProvider(new ethers.providers.Web3Provider(window.ethereum));
        }
    }, []);

    useEffect(() => {
        if (injectedProvider && injectedProvider !== localProvider && account) {
            const readContracts = getReadContracts(injectedProvider, address, ABI);
            const writeContracts = getWriteContracts(injectedProvider, account, address, ABI);
            setReadContracts(readContracts);
            setWriteContracts(writeContracts);
        }
    }, [injectedProvider, localProvider, account, ABI, address]);

    return [readContracts, writeContracts];
}

export function useEthersLoader(localProvider: any, account: string | null | undefined) {
    const [injectedProvider, setInjectedProvider] = useState<any>();
    const [readContracts, setReadContracts] = useState<any>();
    const [writeContracts, setWriteContracts] = useState<any>();

    useEffect(() => {
        if (typeof window !== "undefined" && window.ethereum) {
            setInjectedProvider(new ethers.providers.Web3Provider(window.ethereum));
        }
    }, []);

    useEffect(() => {
        if (injectedProvider && injectedProvider !== localProvider && account) {
            const readContracts = getReadContracts(injectedProvider);
            const writeContracts = getWriteContracts(injectedProvider, account);
            setReadContracts(readContracts);
            setWriteContracts(writeContracts);
        }
    }, [injectedProvider, localProvider, account]);

    return [readContracts, writeContracts];
}

export function useEthersProvider() {
    const { library } = useWeb3React<Web3Provider>();
    return library;
}

export function useEthersSigner() {
    const { library, account } = useWeb3React<Web3Provider>();
    return library?.getSigner(account);
}

export function useEthersTransactionListener(txHash: string | undefined, onConfirmation: (tx: TransactionResponse) => void) {
    const { library, account } = useWeb3React<Web3Provider>();

    useEffect(() => {
        if (!txHash || !library || !account) return;
        const transaction = library.getTransaction(txHash);
        transaction.then((tx) => {
            if (tx.confirmations > 0) {
                onConfirmation(tx);
            }
        });
    }, [txHash, library, account, onConfirmation]);
}

export function useEthersTransactionReceipt(txHash: string | undefined) {
    const { library, account } = useWeb3React<Web3Provider>();
    const [receipt, setReceipt] = useState<TransactionReceipt | undefined>();

    useEffect(() => {
        if (!txHash || !library || !account) return;
        const transaction = library.getTransactionReceipt(txHash);
        transaction.then((tx) => {
            setReceipt(tx);
        });
    }, [txHash, library, account]);

    return receipt;
}

export function useEthersTransactionStatus(txHash: string | undefined) {
    const { library, account } = useWeb3React<Web3Provider>();
    const [status, setStatus] = useState<number | undefined>();

    useEffect(() => {
        if (!txHash || !library || !account) return;
        const transaction = library.getTransaction(txHash);
        transaction.then((tx) => {
            setStatus(tx.status);
        });
    }, [txHash, library, account]);

    return status;
}

export function useEthersTransactions() {
    const { library, account } = useWeb3React<Web3Provider>();
    const [transactions, setTransactions] = useState<TransactionResponse[] | undefined>();

    useEffect(() => {
        if (!library || !account) return;
        const transaction = library.listTransactions(account);
        transaction.then((tx) => {
            setTransactions(tx);
        });
    }, [library, account]);

    return transactions;
}

export function useEthersTransaction(txHash: string | undefined) {
    const { library, account } = useWeb3React<Web3Provider>();
    const [transaction, setTransaction] = useState<TransactionResponse | undefined>();

    useEffect(() => {
        if (!txHash || !library || !account) return;
        const transaction = library.getTransaction(txHash);
        transaction.then((tx) => {
            setTransaction(tx);
        });
    }, [txHash, library, account]);

    return transaction;
}

export function useEthersTransactionCount() {
    const { library, account } = useWeb3React<Web3Provider>();
    const [count, setCount] = useState<number | undefined>();

    useEffect(() => {
        if (!library || !account) return;
        const transaction = library.getTransactionCount(account);
        transaction.then((tx) => {
            setCount(tx);
        });
    }, [library, account]);

    return count;
}


export function useEthersBalance() {
    const { library, account } = useWeb3React<Web3Provider>();
    const [balance, setBalance] = useState<BigNumber | undefined>();

    useEffect(() => {
        if (!library || !account) return;
        const transaction = library.getBalance(account);
        transaction.then((tx) => {
            setBalance(tx);
        });
    }, [library, account]);

    return balance;
}

export function useEthersBlockNumber() {
    const { library, account } = useWeb3React<Web3Provider>();
    const [blockNumber, setBlockNumber] = useState<number | undefined>();

    useEffect(() => {
        if (!library || !account) return;
        const transaction = library.getBlockNumber();
        transaction.then((tx) => {
            setBlockNumber(tx);
        });
    }, [library, account]);

    return blockNumber;
}

export function useEthersBlock(blockNumber: number | undefined) {
    const { library, account } = useWeb3React<Web3Provider>();
    const [block, setBlock] = useState<Block | undefined>();

    useEffect(() => {
        if (!library || !account || !blockNumber) return;
        const transaction = library.getBlock(blockNumber);
        transaction.then((tx) => {
            setBlock(tx);
        });
    }, [library, account, blockNumber]);

    return block;
}

export function useEthersGasPrice() {
    const { library, account } = useWeb3React<Web3Provider>();
    const [gasPrice, setGasPrice] = useState<BigNumber | undefined>();

    useEffect(() => {
        if (!library || !account) return;
        const transaction = library.getGasPrice();
        transaction.then((tx) => {
            setGasPrice(tx);
        });
    }, [library, account]);

    return gasPrice;
}

export function useEthersEstimateGas(transaction: TransactionRequest | undefined) {
    const { library, account } = useWeb3React<Web3Provider>();
    const [gasLimit, setGasLimit] = useState<BigNumber | undefined>();

    useEffect(() => {
        if (!library || !account || !transaction) return;
        const transaction = library.estimateGas(transaction);
        transaction.then((tx) => {
            setGasLimit(tx);
        });
    }, [library, account, transaction]);

    return gasLimit;
}

export function useEthersCall(transaction: TransactionRequest | undefined) {
    const { library, account } = useWeb3React<Web3Provider>();
    const [result, setResult] = useState<string | undefined>();

    useEffect(() => {
        if (!library || !account || !transaction) return;
        const transaction = library.call(transaction);
        transaction.then((tx) => {
            setResult(tx);
        });
    }, [library, account, transaction]);

    return result;
}

export function useEthersEvents(contract: Contract | undefined, eventName: string, filter?: EventFilter) {
    const { library, account } = useWeb3React<Web3Provider>();
    const [events, setEvents] = useState<any[] | undefined>();

    useEffect(() => {
        if (!library || !account || !contract) return;
        const transaction = contract.queryFilter(eventName, filter);
        transaction.then((tx) => {
            setEvents(tx);
        });
    }, [library, account, contract, eventName, filter]);

    return events;
}

export function useContractExistsAtAddress(address: string | undefined, ABI: any) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [exists, setExists] = useState<boolean | undefined>();
    useEffect(() => {
        if (!address || !ABI || !library) return;
        library.eth
            .getCode(address)
            .then((code: string) => {
                setExists(code !== "0x");
            })
            .catch(() => {
                setExists(false);
            });
    }, [address, ABI, library]);
    return exists;
}

export function useContractLoader(localProvider: any, account: string | null | undefined) {
    const [injectedProvider, setInjectedProvider] = useState<any>();
    const [readContracts, setReadContracts] = useState<any>();
    const [writeContracts, setWriteContracts] = useState<any>();

    useEffect(() => {
        if (typeof window !== "undefined" && window.ethereum) {
            const injectedProvider = new ethers.providers.Web3Provider(window.ethereum);
            setInjectedProvider(injectedProvider);
        }
    }, []);

    useEffect(() => {
        if (localProvider && account && injectedProvider) {
            async function loadContracts() {
                const signer = injectedProvider.getSigner();
                const readContracts = {};
                const writeContracts = {};
                for (const c of Object.keys(Contracts)) {
                    const contract = Contracts[c];
                    const address = contract.address;
                    const abi = contract.abi;
                    const name = contract.name;
                    if (typeof address !== "undefined") {
                        try {
                            readContracts[name] = new ethers.Contract(address, abi, localProvider);
                            writeContracts[name] = new ethers.Contract(address, abi, signer);
                        } catch (e) {
                            console.log("ERROR LOADING CONTRACT", c, e);
                        }
                    }
                }
                setReadContracts(readContracts);
                setWriteContracts(writeContracts);
            }
            loadContracts();
        }
    }, [localProvider, account, injectedProvider]);

    return [readContracts, writeContracts];
}

export function useContractReader<T = any>(readContracts: any, contractName: string, functionName: string, args: any[], pollTime: number) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [value, setValue] = useState<T>();
    useEffect(() => {
        if (!readContracts) {
            return;
        }
        let stale = false;
        const updateValue = async () => {
            try {
                const contract = readContracts[contractName];
                if (contract) {
                    const newValue = await contract[functionName](...args);
                    if (!stale) {
                        setValue(newValue);
                    }
                }
            } catch (e) {
                console.log("ERROR READING CONTRACT", e);
            }
        };
        updateValue();
        const poll = setInterval(updateValue, pollTime);
        return () => {
            stale = true;
            clearInterval(poll);
        };
    }, [readContracts, contractName, functionName, args, pollTime, library]);
    return value;
}

export function useEventListener(readContracts: any, contractName: string, eventName: string, pollTime: number, filter: any) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [value, setValue] = useState<any>();
    useEffect(() => {
        if (!readContracts) {
            return;
        }
        let stale = false;
        const updateValue = async () => {
            try {
                const contract = readContracts[contractName];
                if (contract) {
                    const newValue = await contract.queryFilter(contract.filters[eventName](...filter));
                    if (!stale) {
                        setValue(newValue);
                    }
                }
            } catch (e) {
                console.log("ERROR READING CONTRACT", e);
            }
        };
        updateValue();
        const poll = setInterval(updateValue, pollTime);
        return () => {
            stale = true;
            clearInterval(poll);
        };
    }, [readContracts, contractName, eventName, pollTime, library, filter]);
    return value;
}

export function useBalance(account: string | null | undefined) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [balance, setBalance] = useState<BigNumber>();
    useEffect(() => {
        if (!account || !library) {
            return;
        }
        let stale = false;
        const updateBalance = async () => {
            try {
                const newBalance = await library.getBalance(account);
                if (!stale) {
                    setBalance(newBalance);
                }
            } catch (e) {
                console.log("ERROR GETTING BALANCE", e);
            }
        };
        updateBalance();
        const poll = setInterval(updateBalance, 10000);
        return () => {
            stale = true;
            clearInterval(poll);
        };
    }, [account, library]);
    return balance;
}

export function useGasPrice() {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [gasPrice, setGasPrice] = useState<BigNumber>();
    useEffect(() => {
        if (!library) {
            return;
        }
        let stale = false;
        const updateGasPrice = async () => {
            try {
                const newGasPrice = await library.getGasPrice();
                if (!stale) {
                    setGasPrice(newGasPrice);
                }
            } catch (e) {
                console.log("ERROR GETTING GAS PRICE", e);
            }
        };
        updateGasPrice();
        const poll = setInterval(updateGasPrice, 10000);
        return () => {
            stale = true;
            clearInterval(poll);
        };
    }, [library]);
    return gasPrice;
}

export function useBlockNumber() {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [blockNumber, setBlockNumber] = useState<number>();
    useEffect(() => {
        if (!library) {
            return;
        }
        let stale = false;
        const updateBlockNumber = async () => {
            try {
                const newBlockNumber = await library.getBlockNumber();
                if (!stale) {
                    setBlockNumber(newBlockNumber);
                }
            } catch (e) {
                console.log("ERROR GETTING BLOCK NUMBER", e);
            }
        };
        updateBlockNumber();
        const poll = setInterval(updateBlockNumber, 10000);
        return () => {
            stale = true;
            clearInterval(poll);
        };
    }, [library]);
    return blockNumber;
}


export function useBlockTimestamp() {
    const blockNumber = useBlockNumber();
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [blockTimestamp, setBlockTimestamp] = useState<number>();
    useEffect(() => {
        if (!!library) {
            let stale = false;
            library
                .getBlock(blockNumber)
                .then((block) => {
                    if (!stale) {
                        setBlockTimestamp(block.timestamp);
                    }
                })
                .catch(() => {
                    if (!stale) {
                        setBlockTimestamp(undefined);
                    }
                });
            return () => {
                stale = true;
                setBlockTimestamp(undefined);
            };
        }
    }
        , [blockNumber, library, setBlockTimestamp]);
    return blockTimestamp;
}


export function useEtherBalance() {
    const { account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [etherBalance, setEtherBalance] = useState<BigNumber>();
    useEffect(() => {
        if (!!account && !!library) {
            let stale = false;
            library
                .getBalance(account)
                .then((balance) => {
                    if (!stale) {
                        setEtherBalance(balance);
                    }
                })
                .catch(() => {
                    if (!stale) {
                        setEtherBalance(undefined);
                    }
                });
            return () => {
                stale = true;
                setEtherBalance(undefined);
            };
        }
    }
        , [account, library, setEtherBalance]);
    return etherBalance;
}

export function useEtherBalanceFormatted() {
    const etherBalance = useEtherBalance();
    return etherBalance ? formatEther(etherBalance) : etherBalance;
}

export function useTokenBalance(tokenAddress: string) {
    const { account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [tokenBalance, setTokenBalance] = useState<BigNumber>();
    useEffect(() => {
        if (!!account && !!library) {
            let stale = false;
            const tokenContract = new Contract(tokenAddress, ERC20.abi, library);
            tokenContract
                .balanceOf(account)
                .then((balance) => {
                    if (!stale) {
                        setTokenBalance(balance);
                    }
                })
                .catch(() => {
                    if (!stale) {
                        setTokenBalance(undefined);
                    }
                });
            return () => {
                stale = true;
                setTokenBalance(undefined);
            };
        }
    }
        , [account, library, tokenAddress, setTokenBalance]);
    return tokenBalance;
}

export function useTokenBalanceFormatted(tokenAddress: string) {
    const tokenBalance = useTokenBalance(tokenAddress);
    return tokenBalance ? formatEther(tokenBalance) : tokenBalance;
}

export function useTokenAllowance(tokenAddress: string, spenderAddress: string) {
    const { account, library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    const [tokenAllowance, setTokenAllowance] = useState<BigNumber>();
    useEffect(() => {
        if (!!account && !!library) {
            let stale = false;
            const tokenContract = new Contract(tokenAddress, ERC20.abi, library);
            tokenContract
                .allowance(account, spenderAddress)
                .then((balance) => {
                    if (!stale) {
                        setTokenAllowance(balance);
                    }
                })
                .catch(() => {
                    if (!stale) {
                        setTokenAllowance(undefined);
                    }
                });
            return () => {
                stale = true;
                setTokenAllowance(undefined);
            };
        }
    }
        , [account, library, tokenAddress, spenderAddress, setTokenAllowance]);
    return tokenAllowance;
}

export function useTokenAllowanceFormatted(tokenAddress: string, spenderAddress: string) {
    const tokenAllowance = useTokenAllowance(tokenAddress, spenderAddress);
    return tokenAllowance ? formatEther(tokenAllowance) : tokenAllowance;
}

export function useTokenContract(tokenAddress: string) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    return useMemo(() => {
        if (!library) {
            return null;
        }
        return new Contract(tokenAddress, ERC20.abi, library);
    }
        , [library, tokenAddress]);
}

export function useTokenContractFormatted(tokenAddress: string) {
    const tokenContract = useTokenContract(tokenAddress);
    return tokenContract ? formatEther(tokenContract) : tokenContract;
}

export function useTokenContractAllowance(tokenAddress: string, spenderAddress: string) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    return useMemo(() => {
        if (!library) {
            return null;
        }
        return new Contract(tokenAddress, ERC20.abi, library);
    }
        , [library, tokenAddress, spenderAddress]);
}

export function useTokenContractAllowanceFormatted(tokenAddress: string, spenderAddress: string) {
    const tokenContract = useTokenContractAllowance(tokenAddress, spenderAddress);
    return tokenContract ? formatEther(tokenContract) : tokenContract;
}

export function useTokenContractBalance(tokenAddress: string) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    return useMemo(() => {
        if (!library) {
            return null;
        }
        return new Contract(tokenAddress, ERC20.abi, library);
    }
        , [library, tokenAddress]);
}

export function useTokenContractBalanceFormatted(tokenAddress: string) {
    const tokenContract = useTokenContractBalance(tokenAddress);
    return tokenContract ? formatEther(tokenContract) : tokenContract;
}

export function useTokenContractDecimals(tokenAddress: string) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    return useMemo(() => {
        if (!library) {
            return null;
        }
        return new Contract(tokenAddress, ERC20.abi, library);
    }
        , [library, tokenAddress]);
}

export function useTokenContractDecimalsFormatted(tokenAddress: string) {
    const tokenContract = useTokenContractDecimals(tokenAddress);
    return tokenContract ? formatEther(tokenContract) : tokenContract;
}

export function useTokenContractName(tokenAddress: string) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    return useMemo(() => {
        if (!library) {
            return null;
        }
        return new Contract(tokenAddress, ERC20.abi, library);
    }
        , [library, tokenAddress]);
}

export function useTokenContractNameFormatted(tokenAddress: string) {
    const tokenContract = useTokenContractName(tokenAddress);
    return tokenContract ? formatEther(tokenContract) : tokenContract;
}

export function useTokenContractSymbol(tokenAddress: string) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    return useMemo(() => {
        if (!library) {
            return null;
        }
        return new Contract(tokenAddress, ERC20.abi, library);
    }
        , [library, tokenAddress]);
}

export function useTokenContractSymbolFormatted(tokenAddress: string) {
    const tokenContract = useTokenContractSymbol(tokenAddress);
    return tokenContract ? formatEther(tokenContract) : tokenContract;
}

export function useTokenContractTotalSupply(tokenAddress: string) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    return useMemo(() => {
        if (!library) {
            return null;
        }
        return new Contract(tokenAddress, ERC20.abi, library);
    }
        , [library, tokenAddress]);
}

export function useTokenContractTotalSupplyFormatted(tokenAddress: string) {
    const tokenContract = useTokenContractTotalSupply(tokenAddress);
    return tokenContract ? formatEther(tokenContract) : tokenContract;
}

export function useTokenContractTransfer(tokenAddress: string) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    return useMemo(() => {
        if (!library) {
            return null;
        }
        return new Contract(tokenAddress, ERC20.abi, library);
    }
        , [library, tokenAddress]);
}

export function useTokenContractTransferFormatted(tokenAddress: string) {
    const tokenContract = useTokenContractTransfer(tokenAddress);
    return tokenContract ? formatEther(tokenContract) : tokenContract;
}

export function useTokenContractTransferFrom(tokenAddress: string) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    return useMemo(() => {
        if (!library) {
            return null;
        }
        return new Contract(tokenAddress, ERC20.abi, library);
    }

        , [library, tokenAddress]);
}

export function useTokenContractTransferFromFormatted(tokenAddress: string) {
    const tokenContract = useTokenContractTransferFrom(tokenAddress);
    return tokenContract ? formatEther(tokenContract) : tokenContract;
}

export function useTokenContractApprove(tokenAddress: string) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    return useMemo(() => {
        if (!library) {
            return null;
        }
        return new Contract(tokenAddress, ERC20.abi, library);
    }
        , [library, tokenAddress]);
}

export function useTokenContractApproveFormatted(tokenAddress: string) {
    const tokenContract = useTokenContractApprove(tokenAddress);
    return tokenContract ? formatEther(tokenContract) : tokenContract;
}

export function useTokenContractTransferOwnership(tokenAddress: string) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    return useMemo(() => {
        if (!library) {
            return null;
        }
        return new Contract(tokenAddress, ERC20.abi, library);
    }
        , [library, tokenAddress]);
}

export function useTokenContractTransferOwnershipFormatted(tokenAddress: string) {
    const tokenContract = useTokenContractTransferOwnership(tokenAddress);
    return tokenContract ? formatEther(tokenContract) : tokenContract;
}

export function useTokenContractRenounceOwnership(tokenAddress: string) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    return useMemo(() => {
        if (!library) {
            return null;
        }
        return new Contract(tokenAddress, ERC20.abi, library);
    }
        , [library, tokenAddress]);
}

export function useTokenContractRenounceOwnershipFormatted(tokenAddress: string) {
    const tokenContract = useTokenContractRenounceOwnership(tokenAddress);
    return tokenContract ? formatEther(tokenContract) : tokenContract;
}

export function useTokenContractMint(tokenAddress: string) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    return useMemo(() => {
        if (!library) {
            return null;
        }
        return new Contract(tokenAddress, ERC20.abi, library);
    }
        , [library, tokenAddress]);
}

export function useTokenContractMintFormatted(tokenAddress: string) {
    const tokenContract = useTokenContractMint(tokenAddress);
    return tokenContract ? formatEther(tokenContract) : tokenContract;
}

export function useTokenContractBurn(tokenAddress: string) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    return useMemo(() => {
        if (!library) {
            return null;
        }
        return new Contract(tokenAddress, ERC20.abi, library);
    }
        , [library, tokenAddress]);
}

export function useTokenContractBurnFormatted(tokenAddress: string) {
    const tokenContract = useTokenContractBurn(tokenAddress);
    return tokenContract ? formatEther(tokenContract) : tokenContract;
}

export function useTokenContractPause(tokenAddress: string) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    return useMemo(() => {
        if (!library) {
            return null;
        }
        return new Contract(tokenAddress, ERC20.abi, library);
    }
        , [library, tokenAddress]);
}

export function useTokenContractPauseFormatted(tokenAddress: string) {
    const tokenContract = useTokenContractPause(tokenAddress);
    return tokenContract ? formatEther(tokenContract) : tokenContract;
}

export function useTokenContractUnpause(tokenAddress: string) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    return useMemo(() => {
        if (!library) {
            return null;
        }
        return new Contract(tokenAddress, ERC20.abi, library);
    }
        , [library, tokenAddress]);
}

export function useTokenContractUnpauseFormatted(tokenAddress: string) {
    const tokenContract = useTokenContractUnpause(tokenAddress);
    return tokenContract ? formatEther(tokenContract) : tokenContract;
}

export function useTokenContractAddMinter(tokenAddress: string) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    return useMemo(() => {
        if (!library) {
            return null;
        }
        return new Contract(tokenAddress, ERC20.abi, library);
    }
        , [library, tokenAddress]);
}

export function useTokenContractAddMinterFormatted(tokenAddress: string) {
    const tokenContract = useTokenContractAddMinter(tokenAddress);
    return tokenContract ? formatEther(tokenContract) : tokenContract;
}

export function useTokenContractRenounceMinter(tokenAddress: string) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    return useMemo(() => {
        if (!library) {
            return null;
        }
        return new Contract(tokenAddress, ERC20.abi, library);
    }
        , [library, tokenAddress]);
}

export function useTokenContractRenounceMinterFormatted(tokenAddress: string) {
    const tokenContract = useTokenContractRenounceMinter(tokenAddress);
    return tokenContract ? formatEther(tokenContract) : tokenContract;
}

export function useTokenContractAddPauser(tokenAddress: string) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    return useMemo(() => {
        if (!library) {
            return null;
        }
        return new Contract(tokenAddress, ERC20.abi, library);
    }
        , [library, tokenAddress]);
}

export function useTokenContractAddPauserFormatted(tokenAddress: string) {
    const tokenContract = useTokenContractAddPauser(tokenAddress);
    return tokenContract ? formatEther(tokenContract) : tokenContract;
}

export function useTokenContractRenouncePauser(tokenAddress: string) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    return useMemo(() => {
        if (!library) {
            return null;
        }
        return new Contract(tokenAddress, ERC20.abi, library);
    }
        , [library, tokenAddress]);
}

export function useTokenContractRenouncePauserFormatted(tokenAddress: string) {
    const tokenContract = useTokenContractRenouncePauser(tokenAddress);
    return tokenContract ? formatEther(tokenContract) : tokenContract;
}

export function useTokenContractIncreaseAllowance(tokenAddress: string) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    return useMemo(() => {
        if (!library) {
            return null;
        }
        return new Contract(tokenAddress, ERC20.abi, library);
    }
        , [library, tokenAddress]);
}

export function useTokenContractIncreaseAllowanceFormatted(tokenAddress: string) {
    const tokenContract = useTokenContractIncreaseAllowance(tokenAddress);
    return tokenContract ? formatEther(tokenContract) : tokenContract;
}

export function useTokenContractDecreaseAllowance(tokenAddress: string) {
    const { library } = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
    return useMemo(() => {
        if (!library) {
            return null;
        }
        return new Contract(tokenAddress, ERC20.abi, library);
    }
        , [library, tokenAddress]);
}

export function useTokenContractDecreaseAllowanceFormatted(tokenAddress: string) {
    const tokenContract = useTokenContractDecreaseAllowance(tokenAddress);
    return tokenContract ? formatEther(tokenContract) : tokenContract;
}

