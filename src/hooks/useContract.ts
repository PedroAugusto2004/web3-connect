import { useState, useCallback } from "react";
import { ethers, BrowserProvider, Contract } from "ethers";

// Default Counter contract ABI - user should replace with their own
const COUNTER_ABI = [
  {
    inputs: [],
    name: "count",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "increment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export type TransactionStatus = "idle" | "pending" | "confirming" | "success" | "error";

interface ContractState {
  count: number | null;
  txStatus: TransactionStatus;
  txHash: string | null;
  error: string | null;
  isReading: boolean;
}

export function useContract(provider: BrowserProvider | null, contractAddress: string) {
  const [state, setState] = useState<ContractState>({
    count: null,
    txStatus: "idle",
    txHash: null,
    error: null,
    isReading: false,
  });

  const readCount = useCallback(async () => {
    if (!provider || !contractAddress) return;

    setState(prev => ({ ...prev, isReading: true, error: null }));

    try {
      const contract = new Contract(contractAddress, COUNTER_ABI, provider);
      const count = await contract.count();
      setState(prev => ({
        ...prev,
        count: Number(count),
        isReading: false,
      }));
    } catch (err) {
      const error = err as Error;
      setState(prev => ({
        ...prev,
        isReading: false,
        error: error.message || "Failed to read contract",
      }));
    }
  }, [provider, contractAddress]);

  const increment = useCallback(async () => {
    if (!provider || !contractAddress) return;

    setState(prev => ({ ...prev, txStatus: "pending", error: null, txHash: null }));

    try {
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, COUNTER_ABI, signer);

      setState(prev => ({ ...prev, txStatus: "confirming" }));
      const tx = await contract.increment();
      setState(prev => ({ ...prev, txHash: tx.hash }));

      await tx.wait();
      
      setState(prev => ({ ...prev, txStatus: "success" }));

      // Refresh count after successful transaction
      setTimeout(() => {
        readCount();
        setState(prev => ({ ...prev, txStatus: "idle" }));
      }, 2000);
    } catch (err) {
      const error = err as Error;
      let errorMessage = "Transaction failed";
      
      if (error.message.includes("user rejected")) {
        errorMessage = "Transaction rejected by user";
      } else if (error.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for gas";
      }

      setState(prev => ({
        ...prev,
        txStatus: "error",
        error: errorMessage,
      }));

      setTimeout(() => {
        setState(prev => ({ ...prev, txStatus: "idle" }));
      }, 3000);
    }
  }, [provider, contractAddress, readCount]);

  const resetError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    readCount,
    increment,
    resetError,
  };
}
