import {
  useAddress,
  useConnectionStatus,
  useContractWrite,
  useStorage,
} from "@thirdweb-dev/react";
import { useContext, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { AppContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { SiEthereum } from "react-icons/si";
export default function CreateAccount() {
  const { contract } = useContext(AppContext);
  const [filled, setFilled] = useState(false);
  const [imageSelected, setImageSelected] = useState();
  const [name, setName] = useState("");
  const storage = useStorage();
  const navigate = useNavigate();
  const address = useAddress();
  const { mutateAsync: createAccount } = useContractWrite(
    contract,
    "createUser"
  );
  async function handleCreateAccount() {
    if (!imageSelected || name.length == 0) {
      toast.error("Please upload an image and enter your name");
      return;
    }
    if (name.length > 15) {
      toast.error("Name must be less than 15 characters");
      return;
    }
    console.log(name, imageSelected);
    toast.loading("Creating account...", { id: 2 });
    try {
      const cid = await storage.upload(imageSelected);
      await createAccount({
        args: [name.toString(), cid.toString()],

        override: {
          from: address,
        },
      });
      toast.success("Account created successfully.", { id: 2 });
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (e) {
      toast.error("Error creating account. Check console", { id: 2 });
      console.log(e);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }
  const connectionStatus = useConnectionStatus();
  useEffect(() => {
    if (connectionStatus === "disconnected") {
      navigate("/");
    }
    const handleDisconnect = () => {
      navigate("/");
    };
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0 && accounts[0] !== address) {
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
  return (
    <>
      <Toaster />
      <div className=" max-w-md mx-auto p-4 mt-20 rounded-md">
        <h1 className="text-3xl font-bold text-center">
          Welcome to Cloud
        </h1>

        <p
          className="italic underline text-center cursor-pointer flex mt-2"
          onClick={() => {
            window.open("https://linktr.ee/luvnft", "_blank");
          }}
        >
          Made with LUV{" "}
          <SiEthereum className="mt-1 text-xl" /> blkluv.eth{" "}
          <SiEthereum className="mt-1 text-xl" />
        </p>

        <h2 className="text-center text-2xl font-medium mt-4">
          Create Account
        </h2>
        <label className="text-center font-bold">
          Choose your display image
        </label>
        {!imageSelected && (
          <input
            type="file"
            accept="image/*"
            className="border p-2 w-full my-2"
            onChange={(e) => {
              setImageSelected(e.target.files[0]);
            }}
          />
        )}
        {imageSelected && (
          <img
            src={URL.createObjectURL(imageSelected)}
            className="mx-auto my-2"
            width="200"
            height="200"
          />
        )}
        <input
          type="text"
          placeholder="Enter your name"
          maxLength={15}
          className="border p-2 w-full mb-4"
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value.length > 0 && imageSelected) {
              setFilled(true);
            } else {
              setFilled(false);
            }
          }}
        />

        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-full disabled:opacity-50 ${
            filled ? "cursor-pointer" : "cursor-not-allowed"
          } 
        `}
          disabled={!filled}
          title={
            !filled ? "Enter name and upload image to enable this" : "Login"
          }
          onClick={handleCreateAccount}
        >
          Create Account
          {!filled && (
            <span className="hidden absolute px-3 py-2 text-sm bg-gray-100 rounded-lg">
              Connect Wallet to Create Account
            </span>
          )}
        </button>
      </div>
    </>
  );
}
