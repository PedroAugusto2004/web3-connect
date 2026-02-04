import { useState } from "react";
import { Boxes, Github, FileCode } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useContract } from "@/hooks/useContract";
import { WalletConnect } from "@/components/WalletConnect";
import { ContractInteraction } from "@/components/ContractInteraction";
import { NetworkStatus } from "@/components/NetworkStatus";

const Index = () => {
  const [contractAddress, setContractAddress] = useState("");
  const wallet = useWallet();
  const contract = useContract(wallet.provider, contractAddress);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Boxes className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">Web3 dApp</span>
            </div>
            <NetworkStatus 
              chainId={wallet.chainId} 
              isConnected={wallet.isConnected}
              getChainName={wallet.getChainName}
            />
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-foreground">Build with </span>
            <span className="text-gradient">Blockchain</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect your wallet, read on-chain data, and send transactions. 
            Your gateway to decentralized applications.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileCode className="w-4 h-4 text-primary" />
              React + TypeScript
            </span>
            <span className="w-1 h-1 bg-muted-foreground rounded-full" />
            <span className="flex items-center gap-1">
              <Boxes className="w-4 h-4 text-secondary" />
              Ethers.js v6
            </span>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 pb-16">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <WalletConnect
              isConnected={wallet.isConnected}
              isLoading={wallet.isLoading}
              address={wallet.address}
              balance={wallet.balance}
              chainId={wallet.chainId}
              error={wallet.error}
              onConnect={wallet.connect}
              onDisconnect={wallet.disconnect}
              getChainName={wallet.getChainName}
            />
            <ContractInteraction
              contractAddress={contractAddress}
              onAddressChange={setContractAddress}
              count={contract.count}
              isReading={contract.isReading}
              txStatus={contract.txStatus}
              txHash={contract.txHash}
              error={contract.error}
              isConnected={wallet.isConnected}
              onReadCount={contract.readCount}
              onIncrement={contract.increment}
            />
          </div>

          {/* Instructions */}
          <div className="max-w-4xl mx-auto mt-8">
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Quick Start Guide</h3>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">1</span>
                  <span>Deploy the Counter contract using <a href="https://remix.ethereum.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Remix IDE</a> on Sepolia testnet</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">2</span>
                  <span>Connect your MetaMask wallet (make sure you're on Sepolia)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">3</span>
                  <span>Paste your deployed contract address and start interacting!</span>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 py-6">
          <div className="container mx-auto px-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>Built for Web3 developers</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Github className="w-4 h-4" />
              View Source
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
