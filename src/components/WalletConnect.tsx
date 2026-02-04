import { Wallet, LogOut, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface WalletConnectProps {
  isConnected: boolean;
  isLoading: boolean;
  address: string | null;
  balance: string | null;
  chainId: number | null;
  error: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  getChainName: (chainId: number | null) => string;
}

export function WalletConnect({
  isConnected,
  isLoading,
  address,
  balance,
  chainId,
  error,
  onConnect,
  onDisconnect,
  getChainName,
}: WalletConnectProps) {
  const [copied, setCopied] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <div className="glass rounded-xl p-6 glow-primary">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-primary/20">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Connect Wallet</h3>
            <p className="text-sm text-muted-foreground">Link your MetaMask to get started</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/20 border border-destructive/30">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button
          onClick={onConnect}
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Connecting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Connect MetaMask
            </span>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6 glow-primary">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-3 rounded-lg bg-success/20">
              <Wallet className="w-6 h-6 text-success" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-card animate-pulse-glow" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Wallet Connected</h3>
            <p className="text-sm text-muted-foreground">{getChainName(chainId)}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDisconnect}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <span className="text-sm text-muted-foreground">Address</span>
          <div className="flex items-center gap-2">
            <span className="address-text text-sm text-foreground">{formatAddress(address!)}</span>
            <button
              onClick={copyAddress}
              className="p-1 rounded hover:bg-muted transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-success" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
            <a
              href={`https://etherscan.io/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded hover:bg-muted transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <span className="text-sm text-muted-foreground">Balance</span>
          <span className="font-semibold text-foreground">
            {balance !== null ? `${balance} ETH` : "Loading..."}
          </span>
        </div>
      </div>
    </div>
  );
}
