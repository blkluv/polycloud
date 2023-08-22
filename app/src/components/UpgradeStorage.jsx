import { useContext, useState } from "react";
import { AppContext } from "../context/UserContext";
import { useContractWrite } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { Toaster, toast } from "react-hot-toast";

export default function UpgradeStorage({ open, onClose }) {
  const [amount, setAmount] = useState(100);
  const { contract, userAddress, setTotalStorage } = useContext(AppContext);
  const { mutateAsync: buyStorage } = useContractWrite(
    contract,
    "upgradeStorage"
  );
  if (!open) return;
  return (
    <>
      <Toaster />
      <div
        className={`text-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-3xl shadow-2xl border-4 border-red-300 w-96 ${
          open ? "visible z-50" : "invisible"
        }`}
      >
        <h2 className="text-sm font-medium mb-4">
          How much storage do you want to buy?
        </h2>

        <hr className="border-gray-300" />

        <p className="text-blue-500 font-bold underline my-4">
          Price: 100GB = 1 MATIC
        </p>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded w-1/2 mx-auto block"
        />

        <p className="text-gray-500 text-sm mb-4 mt-1">
          You will be charged {amount / 100} MATIC
        </p>

        <hr className="border-blue-500" />

        <div className="flex justify-end space-x-4 mt-4">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="bg-blue-300 hover:bg-blue-600 text-white px-3 py-2 rounded"
            onClick={async () => {
              toast.loading("Buying Storage...", { id: 2 });
              console.log(amount * 1024 * 1024);
              try {
                await buyStorage({
                  args: [amount * 1024 * 1024],

                  overrides: {
                    from: userAddress,
                    value: ethers.utils.parseEther((amount / 100).toString()),
                  },
                });
                toast.success("Storage increased successfully", { id: 2 });
                setTotalStorage((prev) => prev + amount * 1024 * 1024);
              } catch (e) {
                toast.error("Error buying storage, check console", { id: 2 });
                console.log(e);
              }

              onClose();
            }}
          >
            Buy Storage
          </button>
        </div>
      </div>
    </>
  );
}
