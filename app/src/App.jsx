import React, { useEffect } from "react";
import Profile from "./components/Profile";
import Files from "./components/Files";
import {
  ConnectWallet,
  useAddress,
  useContractRead,
} from "@thirdweb-dev/react";
import Footer from "./components/Footer";
export default function App() {
  useEffect(() => {
    const checkNetwork = async () => {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        if (chainId !== "0x89") {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x89" }], // Polygon's chainId in hex
            });
          } catch {
            alert("Please switch to Polygon network in your wallet");
          }
        }
      }
    };

    checkNetwork();
  }, []);
  return (
    <>
      <Profile />
      <div className="mt-10 mx-auto text-center">
        <ConnectWallet
          theme="dark"
          auth={{
            loginOptional: false,
          }}
        />
      </div>
      <Files />
      <Footer />
    </>
  );
}
