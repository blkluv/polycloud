const hre = require("hardhat");

async function main() {
  const PolyCloud = await hre.ethers.getContractFactory("PolyCloud");
  const polycloud = await PolyCloud.deploy();
  await polycloud.deployed();

  console.log(`Deployed to address ${polycloud.address}`);

  // add ETHERSCAN_API_KEY and deploy on network OTHER than hardhat
  if (hre.network.name !== "hardhat" && process.env.ETHERSCAN_API_KEY) {
    await polycloud.deployTransaction.wait(6);
    verify(polycloud.address, []);
  }
}
const verify = async (contractAddress, args) => {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
};
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
