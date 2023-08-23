import { useContext, useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import UpgradeStorage from "./UpgradeStorage";
import { AppContext } from "../context/UserContext";
import {
  useAddress,
  useConnectionStatus,
  useContractRead,
  useContractWrite,
  useStorage,
} from "@thirdweb-dev/react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const {
    contract,
    userName,
    totalFiles,
    totalStorage,
    usedStorage,
    userImage,
    setUserName,
    setTotalFiles,
    setTotalStorage,
    setUsedStorage,
    setUserImage,
    setUserId,
    setUserAddress,

    userId,
    userAddress,
  } = useContext(AppContext);
  const address = useAddress();
  const { data } = useContractRead(contract, "getUser", [], {
    from: address,
  });
  const storage = useStorage();
  const [open, setOpen] = useState(false);
  const { mutateAsync: editUser } = useContractWrite(contract, "editUser");
  const handleNameEdit = (event) => {
    const newName = event.target.textContent;
    handleNameUpdate(newName);
    setUserName(newName);
  };

  const handleNameUpdate = async (newName) => {
    toast.loading("Editing Name...", { id: 2 });
    try {
      await editUser({
        args: [newName.toString(), userImage.toString()],
      });
      toast.success("Edited Succesfully", { id: 2 });
    } catch (e) {
      toast.error("Error editing account. Check console", {
        id: 2,
      });
      console.log(e);
    }
  };
  const connectionStatus = useConnectionStatus();
  useEffect(() => {
    if (connectionStatus === "disconnected") {
      navigate("/");
    }
    const handleDisconnect = () => {
      navigate("/");
    };
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0 && accounts[0] !== userAddress) {
        navigate("/");
      }
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }
    if (window.ethereum) {
      window.ethereum.on("disconnect", handleDisconnect);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("disconnect", handleDisconnect);
      }
    };
  }, [connectionStatus, window.ethereum]);

  useEffect(() => {
    if (
      userName.length < 1 &&
      address &&
      data &&
      data.userAddress != "0x0000000000000000000000000000000000000000"
    ) {
      setTotalFiles(data.totalFiles.toNumber());
      setTotalStorage(data.totalStorage.toNumber());
      setUsedStorage(data.usedStorage.toNumber());
      setUserName(data.userName);
      setUserImage(data.userImage);
      setUserId(data.userId.toNumber());
      setUserAddress(data.userAddress);
    }
  }, [data]);
  return (
    <>
      <Toaster />
      <p className="text-center mx-auto text-2xl font-mono my-8">
        🚀 Welcome to PolyCloud v2
      </p>
      <div className="mx-auto md:max-w-lg flex justify-around flex-wrap  md:w-3/5 w-1/2">
        {/* Left - Image */}
        <div>
          <img
            className="w-56 h-72 rounded-full border-8 border-gray-200 hover:opacity-20 cursor-pointer"
            src={`https://ipfs.io/ipfs/${userImage.split("//")[1]}`}
            onClick={async () => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";

              input.onchange = async (e) => {
                const file = e.target.files[0];
                toast.loading("Editing Image...", { id: 2 });
                try {
                  const cid = await storage.upload(file);
                  await editUser({
                    args: [userName, cid.toString()],
                  });
                  toast.success("Edited Succesfully", { id: 2 });
                  setUserImage(cid.toString());
                } catch (e) {
                  toast.error("Error editing account. Check console", {
                    id: 2,
                  });
                  console.log(e);
                }
              };

              input.click();
            }}
          />
        </div>

        <div
          className="text-center flex flex-col justify-evenly"
          style={{ spellCheck: "false", MozSpellChecker: "false" }}
        >
          <div className="text-xl font-bold cursor-text text-blue-400 mb-2">
            <span className="text-black">Hello👋</span>{" "}
            <span
              style={{ spellCheck: "false", MozSpellChecker: "false" }}
              contentEditable
              onBlur={(event) => {
                handleNameEdit(event);
              }}
            >
              {userName}
            </span>
          </div>

          <div className="w-full mx-auto">
            <CircularProgressbar
              strokeWidth={10}
              value={usedStorage / 1024 ** 2}
              maxValue={totalStorage / 1024 ** 2}
              text={`${(usedStorage / 1024 ** 2).toFixed(6)} GB / ${
                totalStorage / 1024 ** 2
              } GB`}
              styles={{
                path: {
                  stroke: "#1a56db", // Dark blue progress
                  strokeLinecap: "butt",
                },

                trail: {
                  stroke: "#C7C7BF",
                },

                text: {
                  fill: "#000",
                  fontSize: "8px",
                  dominantBaseline: "middle",
                  textAnchor: "middle",
                },
              }}
            />
            <div className="text-gray-500 my-2">
              Your Total Files: {totalFiles}
            </div>
          </div>
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full
                         hover:bg-purple-600 active:bg-purple-700
                         transition duration-200 ease-in-out 
                         transform hover:scale-105 active:scale-100"
            onClick={() => setOpen(true)}
          >
            Upgrade Storage
          </button>
        </div>
        <UpgradeStorage open={open} onClose={() => setOpen(false)} />
      </div>
    </>
  );
}
