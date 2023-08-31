import {
  ConnectWallet,
  useAddress,
  useContractRead,
} from "@thirdweb-dev/react";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "./components/Banner";
import Note from "./components/Disclaimer";
import { AppContext } from "./context/UserContext";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const navigate = useNavigate();
  const {
    contract,
    setUserName,
    setTotalFiles,
    setTotalStorage,
    setUsedStorage,
    setUserImage,
    setUserId,
    setUserAddress,
  } = useContext(AppContext);
  const address = useAddress();
  const { data } = useContractRead(contract, "getUser", [], {
    from: address,
  });

  useEffect(() => {
    if (
      address &&
      data &&
      data.userAddress == "0x0000000000000000000000000000000000000000"
    ) {
      console.log(data);
      toast.custom(
        <div className="bg-gray-200 text-red-500  font-light text-sm border-2 border-red-500 p-2 px-3 rounded-lg text-center">
          <p>🟥Account NOT found🟥</p>
          <p>Redirecting to Create Account page</p>
        </div>,
        {
          duration: 500,
          position: "top-center",
        }
      );
      setTimeout(() => {
        toast.remove()
      }, 1000);
      setTimeout(() => {
        navigate("/create");
      }, 4000);
    } else if (
      address &&
      data &&
      data.userAddress != "0x0000000000000000000000000000000000000000"
    ) {
      toast.custom(
        <div className="bg-gray-200 text-blue-500 border-2 border-blue-500 text-sm text-center font-light rounded-lg p-2 px-3">
          <p>📘Account found📘</p>
          <p>Redirecting to Home Page</p>
        </div>,
        {
          duration: 500,
          position: "top-center",
        }
      );
      setTimeout(() => {
        toast.remove()
      }, 1000);
      setTotalFiles(data.totalFiles.toNumber());
      setTotalStorage(data.totalStorage.toNumber());
      setUsedStorage(data.usedStorage.toNumber());
      setUserName(data.userName);
      setUserImage(data.userImage);
      setUserId(data.userId.toNumber());
      setUserAddress(data.userAddress);
      setTimeout(() => {
        navigate("/home");
      }, 4000);
    }
  }, [data]);
  return (
    <>
      <Toaster />
      <Banner />
      <div className="mt-10 mx-auto text-center">
        <ConnectWallet
          theme="light"
          auth={{
            loginOptional: false,
          }}
        />
        <Note />
      </div>
    </>
  );
}
