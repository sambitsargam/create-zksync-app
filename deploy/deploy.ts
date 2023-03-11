import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
require ("dotenv").config();

const PRIVATE_KEY = '0x' + process.env.ZKS_PRIVATE_KEY || '';
// Get private key from the environment variable
if (!PRIVATE_KEY) {
  throw new Error("Please set ZKS_PRIVATE_KEY in the environment variables.");
}
// An example of a deploy script that will deploy and call a simple contract.
// eslint-disable-next-line import/no-anonymous-default-export
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the contract`);

  // Initialize the wallet.
  const wallet = new Wallet(PRIVATE_KEY);

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("Greeter");


  // Deploy this contract. The returned object will be of a `Contract` type, similar to the ones in `ethers`.
  // The address of the governance is an argument for contract constructor.
  const counterContract = await deployer.deploy(artifact);

  // Show the contract info.
  const contractAddress = counterContract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
}











