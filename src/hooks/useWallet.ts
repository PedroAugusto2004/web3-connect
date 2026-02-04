import { useState, useEffect, useCallback } from "react";
import { ethers, BrowserProvider } from "ethers";

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  chainId: number | null;
  isLoading: boolean;
  error: string | null;
}

const SUPPORTED_CHAINS: Record<number, string> = {
  1: "Ethereum Mainnet",
  11155111: "Sepolia Testnet",
  5: "Goerli Testnet",
  137: "Polygon Mainnet",
  80001: "Mumbai Testnet",
};

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: null,
    chainId: null,
    isLoading: false,
    error: null,
  });

  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  const getChainName = (chainId: number | null) => {
    if (!chainId) return "Unknown";
    return SUPPORTED_CHAINS[chainId] || `Chain ${chainId}`;
  };

  const updateBalance = useCallback(async (address: string, provider: BrowserProvider) => {
    try {
      const balance = await provider.getBalance(address);
      const formatted = ethers.formatEther(balance);
      setState(prev => ({ ...prev, balance: parseFloat(formatted).toFixed(4) }));
    } catch (err) {
      console.error("Failed to get balance:", err);
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setState(prev => ({ ...prev, error: "MetaMask is not installed. Please install it to continue." }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const browserProvider = new BrowserProvider(window.ethereum);
      await browserProvider.send("eth_requestAccounts", []);
      
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();
      const network = await browserProvider.getNetwork();
      const chainId = Number(network.chainId);

      setProvider(browserProvider);
      
      setState({
        isConnected: true,
        address,
        balance: null,
        chainId,
        isLoading: false,
        error: null,
      });

      await updateBalance(address, browserProvider);
    } catch (err) {
      const error = err as Error;
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || "Failed to connect wallet",
      }));
    }
  }, [updateBalance]);

  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      address: null,
      balance: null,
      chainId: null,
      isLoading: false,
      error: null,
    });
    setProvider(null);
  }, []);

  // Listen for account and chain changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accountList = accounts as string[];
      if (accountList.length === 0) {
        disconnect();
      } else if (state.isConnected) {
        setState(prev => ({ ...prev, address: accountList[0] }));
        if (provider) {
          updateBalance(accountList[0], provider);
        }
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on?.("accountsChanged", handleAccountsChanged);
    window.ethereum.on?.("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [state.isConnected, provider, disconnect, updateBalance]);

  return {
    ...state,
    provider,
    connect,
    disconnect,
    getChainName,
    refreshBalance: () => {
      if (state.address && provider) {
        updateBalance(state.address, provider);
      }
    },
  };
}
