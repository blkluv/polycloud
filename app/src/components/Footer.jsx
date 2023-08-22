import { useContext } from "react";
import { AppContext } from "../context/UserContext";
import { useContractRead } from "@thirdweb-dev/react";
import { ethers } from "ethers";

export default function Footer() {
  const { contract, userAddress } = useContext(AppContext);
  const { data: totalUsers } = useContractRead(
    contract,
    "getAllUsersCount",
    [],
    {
      from: userAddress,
    }
  );

  const { data: totalFiles } = useContractRead(
    contract,
    "getAllFilesCount",
    [],
    {
      from: userAddress,
    }
  );
  const { data: contractBalance } = useContractRead(
    contract,
    "getContractBalance",
    [],
    {
      from: userAddress,
    }
  );

  return (
    <>
      {totalFiles && totalUsers && contractBalance && (
        <div className="border-t-4 border-blue-500 p-4 flex flex-wrap text-center mt-4 text-blue-500 justify-around">
          <div>Total Users on PolyCloudV2: {totalUsers.toString()}</div>
          <div>Total Files on PolyCloudV2: {totalFiles.toString()}</div>
          <div>
            Contract Balance: {ethers.utils.formatEther(contractBalance)} MATIC
          </div>
        </div>
      )}
    </>
  );
}
