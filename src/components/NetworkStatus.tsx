import { Globe, AlertTriangle, Check } from "lucide-react";

interface NetworkStatusProps {
  chainId: number | null;
  isConnected: boolean;
  getChainName: (chainId: number | null) => string;
}

const RECOMMENDED_CHAINS = [11155111, 5]; // Sepolia, Goerli

export function NetworkStatus({ chainId, isConnected, getChainName }: NetworkStatusProps) {
  if (!isConnected) return null;

  const isRecommended = chainId !== null && RECOMMENDED_CHAINS.includes(chainId);
  const isMainnet = chainId === 1;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
      isMainnet 
        ? "bg-destructive/20 text-destructive border border-destructive/30"
        : isRecommended
        ? "bg-success/20 text-success border border-success/30"
        : "bg-warning/20 text-warning border border-warning/30"
    }`}>
      {isMainnet ? (
        <>
          <AlertTriangle className="w-4 h-4" />
          <span>Mainnet — Real funds at risk!</span>
        </>
      ) : isRecommended ? (
        <>
          <Check className="w-4 h-4" />
          <span>{getChainName(chainId)}</span>
        </>
      ) : (
        <>
          <Globe className="w-4 h-4" />
          <span>{getChainName(chainId)}</span>
        </>
      )}
    </div>
  );
}
