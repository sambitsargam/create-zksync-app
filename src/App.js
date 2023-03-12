import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import Web3 from "web3";
import logo from "./logo.svg";
import "./App.css";
// JSON containing ABI and Bytecode of compiled smart contracts
import contractJson from "./artifacts-zk/contracts/Greeter.sol/Greeter.json";

// Importing the Argent Wallet
import { getEthereumProvider } from "@argent/login";

function App() {
  const [mmStatus, setMmStatus] = useState("Not connected!");
  const [isConnected, setIsConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState(undefined);
  const [displayMessage, setDisplayMessage] = useState("");
  const [web3, setWeb3] = useState(undefined);
  const [getNetwork, setGetNetwork] = useState(undefined);
  const [contracts, setContracts] = useState(undefined);
  const [contractAddress, setContractAddress] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [txnHash, setTxnHash] = useState(null);

  async function ArgentConnect() {
    const ethereumProvider = await getEthereumProvider({
      chainId: 280,
      rpcUrl: "https://zksync2-testnet.zksync.dev",
      walletConnect: {
        metadata: {
          name: "create zksync app",
          description: "A full-stack starter template with React & zk sync Hardhat to develop, deploy, and test Solidity smart contracts on the zk sync era network.",
          url: "https://www.npmjs.com/package/create-zksync-app",
          icons: [
            "https://github.com/sambitsargam/create-zksync-app/blob/HEAD/logo.svg",
          ],
        },
      },
    });
    await ethereumProvider.enable();
  }

  useEffect(() => {
    (async () => {
      // Define web3
      const web3 = new Web3(window.ethereum);
      setWeb3(web3);
      // get networkId
      const networkId = await web3.eth.getChainId();
      setGetNetwork(networkId);
      // INSERT deployed smart contract address
      const contract = "0x9acF530370a231c564856212AE2F04202e2FEC21";
      setContractAddress(contract);
      // Instantiate smart contract instance
      const Greeter = new web3.eth.Contract(contractJson.abi, contract);
      setContracts(Greeter);
      // Set provider
      Greeter.setProvider(window.ethereum);
    })();
  }, []);

  // Connect to Metamask
  async function ConnectWallet() {
    // Check if Metamask is installed
    if (typeof window.ethereum !== "undefined") {
      // Request account access if needed
      await window.ethereum.request({ method: "eth_requestAccounts" });
      // Get account address
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      setAccountAddress(accounts[0]);
      // Set Metamask status
      setMmStatus("Connected!");
      setIsConnected(true);
    } else {
      alert("Please install Metamask!");
    }
  }

  // Read message from smart contract
  async function receive() {
    // Display message
    var displayMessage = await contracts.methods.read().call();
    setDisplayMessage(displayMessage);
  }

  // Write message to smart contract
  async function send() {
    // Get input value of message
    var getMessage = document.getElementById("message").value;
    setLoading(true);
    // Send message to smart contract
    await contracts.methods
      .write(getMessage)
      .send({ from: accountAddress })
      .on("transactionHash", function (hash) {
        setTxnHash(hash);
      });
    setLoading(false);
  }

  return (
    <div className="App">
      {/* Metamask status */}
      <div className="text-center">
        <h1>
          {getNetwork !== 0x118
            ? "Please make sure you're on the zkSync Era testnet network"
            : mmStatus}
        </h1>
      </div>
      <hr />
      <h1 className="text-center text-4xl font-bold mt-8">
        create-zksync-app template 🚀
      </h1>
      {/* Connect to Metamask */}

      <center>
        {isConnected && (
          // Show message if connected
          <div className="text-center text-xl mt-12">
            {/* Show account address */}
            <h1>Connected to {accountAddress}</h1>
          </div>
        )}
        {!isConnected && (
          <>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-8 mb-6"
              onClick={ConnectWallet}
            >
              Connect with Metamask
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-8 mb-6"
              onClick={ArgentConnect}
            >
              Connect with Argent
            </button>
          </>
        )}
      </center>

      {/* Send message */}
      <center className="mt-12">
        <input
          type={"text"}
          placeholder={"Enter message"}
          id="message"
          className="w-60 bg-white rounded border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:bg-white focus:border-indigo-500 text-base outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
        <button
          className="text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded ml-3"
          onClick={isConnected && send}
        >
          Send
        </button>
        {/* Receive message */}
        <button
          className="text-center  bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded ml-3"
          onClick={isConnected && receive}
        >
          Receive
        </button>
      </center>
      <p className="text-center text-sm mt-6">
        {loading == true ? (
          <>
            loading..
            <p className="mt-4 text-xs ">
              Txn hash:{" "}
              <a
                className="text-blue-500"
                href={"https://goerli.explorer.zksync.io/tx/" + txnHash}
                target="_blank"
                rel="noopener noreferrer"
              >
                {txnHash}
              </a>
            </p>
            <p className="mt-2 text-xs">
              Please wait till the Txn is completed :)
            </p>
          </>
        ) : (
          ""
        )}
      </p>
      {/* Display message */}
      <div className="text-center text-3xl mt-10">
        <b>{displayMessage}</b>
      </div>
      {/* Footer developer content */}
      <footer className="footer">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="mt-4 text-xs sm:text-sm text-black">
          Learn more about zkSync Era {""}
          <a
            className="text-blue-500 no-underline hover:underline hover:text-blue-400"
            href="https://era.zksync.io/docs/"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

export default App;
