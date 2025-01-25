import { useState } from "react";

const BlockchainTransfer = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  // Connect MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setAccount(accounts[0]);

        // Get balance
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        });

        const balanceInEther = (parseInt(balance, 16) / 1e18).toFixed(4);
        setBalance(balanceInEther);
      } catch (error) {
        console.error("Connection failed", error);
      }
    }
  };

  // Transfer funds
  const transferFunds = async () => {
    if (!window.ethereum || !account) {
      alert("Connect wallet first");
      return;
    }

    try {
      const transactionParameters = {
        to: recipient,
        from: account,
        value: `0x${(parseFloat(amount) * 1e18).toString(16)}`,
      };

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      alert(`Transfer successful! Transaction Hash: ${txHash}`);
    } catch (error) {
      console.error("Transfer failed", error);
      alert("Transaction failed");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          💸 Blockchain Transfer
        </h2>

        {!account ? (
          <button
            onClick={connectWallet}
            className="w-full bg-blue-500 text-white py-2 rounded flex items-center justify-center"
          >
            👛 Connect Wallet
          </button>
        ) : (
          <>
            <div className="mb-4">
              <p>Connected Account: {account}</p>
              <p>Balance: {balance} ETH</p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Recipient Address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Amount (ETH)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button
                onClick={transferFunds}
                className="w-full bg-green-500 text-white py-2 rounded"
              >
                ➡️ Transfer Funds
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlockchainTransfer;
