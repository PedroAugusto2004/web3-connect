import { Plus, RefreshCw, Hash, AlertCircle, CheckCircle2, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TransactionStatus } from "@/hooks/useContract";

interface ContractInteractionProps {
  contractAddress: string;
  onAddressChange: (address: string) => void;
  count: number | null;
  isReading: boolean;
  txStatus: TransactionStatus;
  txHash: string | null;
  error: string | null;
  isConnected: boolean;
  onReadCount: () => void;
  onIncrement: () => void;
}

export function ContractInteraction({
  contractAddress,
  onAddressChange,
  count,
  isReading,
  txStatus,
  txHash,
  error,
  isConnected,
  onReadCount,
  onIncrement,
}: ContractInteractionProps) {
  const getStatusMessage = () => {
    switch (txStatus) {
      case "pending":
        return { icon: Loader2, text: "Waiting for approval...", color: "text-warning" };
      case "confirming":
        return { icon: Loader2, text: "Transaction confirming...", color: "text-primary" };
      case "success":
        return { icon: CheckCircle2, text: "Transaction confirmed!", color: "text-success" };
      case "error":
        return { icon: AlertCircle, text: error || "Transaction failed", color: "text-destructive" };
      default:
        return null;
    }
  };

  const status = getStatusMessage();

  return (
    <div className="glass rounded-xl p-6 glow-secondary">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-secondary/20">
          <Hash className="w-6 h-6 text-secondary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Smart Contract</h3>
          <p className="text-sm text-muted-foreground">Interact with your Counter contract</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Contract Address Input */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Contract Address</label>
          <Input
            placeholder="0x..."
            value={contractAddress}
            onChange={(e) => onAddressChange(e.target.value)}
            className="address-text bg-muted/50 border-border focus:border-primary focus:ring-primary"
          />
        </div>

        {/* Counter Display */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Current Count</p>
            <div className="flex items-center justify-center gap-3">
              {isReading ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : (
                <span className="text-5xl font-bold text-gradient">
                  {count !== null ? count : "—"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onReadCount}
            disabled={!isConnected || !contractAddress || isReading}
            className="border-border hover:bg-muted hover:border-primary"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isReading ? "animate-spin" : ""}`} />
            Read Count
          </Button>
          <Button
            onClick={onIncrement}
            disabled={!isConnected || !contractAddress || txStatus !== "idle"}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
          >
            {txStatus !== "idle" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Increment
          </Button>
        </div>

        {/* Transaction Status */}
        {status && (
          <div className={`flex items-center gap-2 p-3 rounded-lg bg-muted/50 ${status.color}`}>
            <status.icon className={`w-4 h-4 ${txStatus === "pending" || txStatus === "confirming" ? "animate-spin" : ""}`} />
            <span className="text-sm">{status.text}</span>
          </div>
        )}

        {/* Transaction Hash */}
        {txHash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-primary hover:bg-muted transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm address-text truncate">{txHash}</span>
          </a>
        )}

        {/* Not Connected Warning */}
        {!isConnected && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/30 text-warning">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Connect your wallet to interact with the contract</span>
          </div>
        )}
      </div>
    </div>
  );
}
