import { ConnectWallet } from "@thirdweb-dev/react";
import banner from "../assets/banner.png";
export default function Banner() {
  return (
    <div className="max-w-3xl mx-auto flex flex-wrap mt-20 w-3/5 text-center">
      {/* Left Image */}
      <img src={banner} className="md:w-1/2 w-full animate-bounce" />

      {/* Right Content */}
      <div className="md:w-2/5 w-full md:pl-6">
        <h1 className="text-4xl font-bold">Cloud</h1>

        <p className="my-4 font-serif">
          {" "}
          LUV NFT Cloud provides user-friendly decentralized storage,
          allowing you to effortlessly share IPFS links for seamless 
          file distribution.
        </p>
        <p className="font-bold text-xl text-gray-400">
          CONNECT YOUR WALLET TO CONTINUE
        </p>
      </div>
    </div>
  );
}
