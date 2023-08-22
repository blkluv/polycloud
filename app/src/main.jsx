import React from "react";
import ReactDOM from "react-dom/client";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import App from "./App.jsx";
import "./index.css";
import { Polygon } from "@thirdweb-dev/chains";
import AppContextProvider from "./context/UserContext.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateAccount from "./components/CreateAccount.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./Home.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <App />,
  },
  {
    path: "/create",
    element: <CreateAccount />,
  },
]);
/*
ACTIVE CHAINS NAME for Thirdweb
Ethereum: "ethereum"
Goerli: "goerli"polygon
Polygon: "polygon"
Mumbai: "mumbai"
Arbitrum One: "arbitrum"
Arbitrum Goerli: "arbitrum-goerli"
Optimism: "optimism"
Optimism Goerli Testnet: "optimism-goerli"
Binance SmartChain: "binance"
Binance SmartChain Testnet: "binance-testnet"
Fantom Opera: "fantom"
Fantom Testnet: "fantom-testnet"
Avalanche C Chain: "avalanche-fuji"
Avalanche Fuji Testnet: "avalanche-fuji-testnet"
Localhost: "localhost"
*/
const clientId = "9ee9d8bd353b0c9d0562a3a4f9a60b2d";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThirdwebProvider
      activeChain={Polygon}
      supportedChains={[Polygon]}
      clientId={clientId}
    >
      <Navbar />
      <AppContextProvider>
        <RouterProvider router={router} />
      </AppContextProvider>
    </ThirdwebProvider>
  </React.StrictMode>
);

// Contract Deployed on :- https://polygonscan.com/address/0xB74D32D065aac336be48EaD9a3F277e824A7334a
