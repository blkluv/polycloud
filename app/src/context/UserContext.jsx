// context.js

import { useContract } from "@thirdweb-dev/react";
import { createContext, useState } from "react";

export const AppContext = createContext();

export default function AppContextProvider(props) {
  const [accountExists, setAccountExists] = useState(false);
  const [userName, setUserName] = useState("");
  const [totalFiles, setTotalFiles] = useState(0);
  const [usedStorage, setUsedStorage] = useState(0);
  const [totalStorage, setTotalStorage] = useState(0);
  const [userImage, setUserImage] = useState("");
  const [createAccountModal, setCreateAccountModal] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [userFiles, setUserFiles] = useState([]);
  const [userId, setUserId] = useState(0);
  const [userAddress, setUserAddress] = useState(0);
  const { contract, isLoading, error } = useContract(
    "0xB74D32D065aac336be48EaD9a3F277e824A7334a",
    [
      { inputs: [], stateMutability: "nonpayable", type: "constructor" },
      {
        inputs: [
          { internalType: "string", name: "_userName", type: "string" },
          { internalType: "string", name: "_userImage", type: "string" },
        ],
        name: "createUser",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "string", name: "_userName", type: "string" },
          { internalType: "string", name: "_userImage", type: "string" },
        ],
        name: "editUser",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "getAllFiles",
        outputs: [
          {
            components: [
              { internalType: "uint256", name: "fileId", type: "uint256" },
              { internalType: "string", name: "fileName", type: "string" },
              { internalType: "string", name: "fileCID", type: "string" },
              { internalType: "uint256", name: "fileSize", type: "uint256" },
              {
                internalType: "uint256",
                name: "fileCreatedAt",
                type: "uint256",
              },
            ],
            internalType: "struct PolyCloud.File[]",
            name: "",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getAllFilesCount",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getAllUsers",
        outputs: [
          {
            components: [
              { internalType: "uint256", name: "userId", type: "uint256" },
              { internalType: "string", name: "userName", type: "string" },
              { internalType: "uint256", name: "totalFiles", type: "uint256" },
              {
                internalType: "uint256",
                name: "totalStorage",
                type: "uint256",
              },
              { internalType: "uint256", name: "usedStorage", type: "uint256" },
              { internalType: "string", name: "userImage", type: "string" },
              {
                internalType: "address payable",
                name: "userAddress",
                type: "address",
              },
            ],
            internalType: "struct PolyCloud.User[]",
            name: "",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getAllUsersCount",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getContractBalance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getCurrentTotalStorage",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getCurrentUsedStorage",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getFilesForUser",
        outputs: [
          {
            components: [
              { internalType: "uint256", name: "fileId", type: "uint256" },
              { internalType: "string", name: "fileName", type: "string" },
              { internalType: "string", name: "fileCID", type: "string" },
              { internalType: "uint256", name: "fileSize", type: "uint256" },
              {
                internalType: "uint256",
                name: "fileCreatedAt",
                type: "uint256",
              },
            ],
            internalType: "struct PolyCloud.File[]",
            name: "",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getUser",
        outputs: [
          {
            components: [
              { internalType: "uint256", name: "userId", type: "uint256" },
              { internalType: "string", name: "userName", type: "string" },
              { internalType: "uint256", name: "totalFiles", type: "uint256" },
              {
                internalType: "uint256",
                name: "totalStorage",
                type: "uint256",
              },
              { internalType: "uint256", name: "usedStorage", type: "uint256" },
              { internalType: "string", name: "userImage", type: "string" },
              {
                internalType: "address payable",
                name: "userAddress",
                type: "address",
              },
            ],
            internalType: "struct PolyCloud.User",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "storageToAdd", type: "uint256" },
        ],
        name: "upgradeStorage",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "string", name: "_fileName", type: "string" },
          { internalType: "string", name: "_fileCID", type: "string" },
          { internalType: "uint256", name: "_fileSize", type: "uint256" },
        ],
        name: "uploadFile",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "withdrawAllFunds",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ]
  );
  // let userName = "";
  return (
    <AppContext.Provider
      value={{
        accountExists,
        setAccountExists,
        userName,
        setUserName,
        totalFiles,
        setTotalFiles,
        totalStorage,
        setTotalStorage,
        usedStorage,
        userImage,
        setUsedStorage,
        setUserImage,
        userFiles,
        setUserFiles,
        contract,
        createAccountModal,
        setCreateAccountModal,
        signedIn,
        setSignedIn,
        userId,
        setUserId,
        userAddress,
        setUserAddress,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}
