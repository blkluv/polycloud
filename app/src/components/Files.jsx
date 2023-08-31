import { useContext } from "react";
import Card from "./Card";
import { AppContext } from "../context/UserContext";
import { BigNumber, ethers } from "ethers";
import {
  useContractRead,
  useContractWrite,
  useStorage,
} from "@thirdweb-dev/react";
import { Toaster, toast } from "react-hot-toast";
export default function Files() {
  const { contract, userAddress } = useContext(AppContext);
  const { data: files } = useContractRead(contract, "getFilesForUser", [], {
    from: userAddress,
  });
  const { mutateAsync: upload } = useContractWrite(contract, "uploadFile");
  const storage = useStorage();
  return (
    <>
      <Toaster />
      <div className="mt-12">
        <div className="flex justify-around md:flex-row flex-col-reverse">
          <h2 className="text-3xl font-semibold text-center font-mono">
            Your Files
          </h2>
          <button
            className="bg-blue-500 text-white 
           px-2 py-1 rounded-lg hover:text-blue-500 hover:bg-white w-28 mx-auto md:mx-0"
            onClick={async () => {
              const input = document.createElement("input");
              input.type = "file";

              input.onchange = async (e) => {
                const file = e.target.files[0];
                toast.loading("Uploading File on Thirdweb IPFS", { id: 2 });
                const fileCID = await storage.upload(file);
                const fileName = file.name;
                const fileSizeKB = Math.ceil(file.size / 1024 ** 1);
                console.log(fileSizeKB, fileName, fileCID);

                try {
                  toast.loading("Uploading File on PolyCloud", { id: 2 });
                  await upload({
                    args: [fileName.toString(), fileCID.toString(), fileSizeKB],
                    override: {
                      from: userAddress,
                    },
                  });
                  toast.success("File Uploaded Succesfully", { id: 2 });
                } catch (e) {
                  console.log(e);
                  toast.error("Error uploading file, see console", { id: 2 });
                }
              };

              input.click();
            }}
          >
            Upload File
          </button>
        </div>
        {files && files.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 md:gap-32 gap-10 mx-auto md:w-10/12 w-full my-10">
            {files.map((file) => (
              <Card file={file} key={file.fileId.toNumber()} />
            ))}
          </div>
        )}
        {files && files.length == 0 && (
          <div className="text-center mx-auto mt-10 text-xl font-serif ">
            No Files to Display. Upload files now
          </div>
        )}
      </div>
    </>
  );
}
