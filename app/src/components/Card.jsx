import React from "react";
import banner from "../assets/banner.png";
import { saveAs } from "file-saver";
import { BsCloudDownloadFill } from "react-icons/bs";
import { BsFillShareFill } from "react-icons/bs";
import { Toaster, toast } from "react-hot-toast";
export default function Card({ file }) {
  const millis = file.fileCreatedAt * 1000;
  const date = new Date(millis);
  const fileSize = file.fileSize.toNumber();

  const localeDate = date.toLocaleDateString("en-GB");
  const extension = file.fileName.match(/\.([^\.]+)$/)[1];

  let gatewayURL, downloadURL;

  if (extension.match(/jpg|jpeg|png|gif|webp|tiff|psd/)) {
    // Image types
    gatewayURL = `https://ipfs.io/ipfs/${file.fileCID.split("//")[1]}`;
    downloadURL = `https://ipfs.io/ipfs/${file.fileCID.split("//")[1]}`;
  } else if (extension.match(/zip|rar|7z|tar|gz|bz2/)) {
    // Archive types
    gatewayURL = "https://archive.gateway.com";
    downloadURL = "https://archive.download.com";
  } else if (extension.match(/exe|dmg|apk|msi/)) {
    // Software types
    gatewayURL = "https://software.gateway.com";
    downloadURL = "https://software.download.com";
  } else if (extension.match(/doc|docx|pdf|xls|ppt|txt/)) {
    // Document types
    gatewayURL = "https://document.gateway.com";
    downloadURL = "https://document.download.com";
  } else if (extension.match(/mp4|mov|avi|mkv|wmv|mpeg|flv/)) {
    // Video types
    gatewayURL = "https://video.gateway.com";
    downloadURL = "https://video.download.com";
  } else if (extension.match(/mp3|wav|wma|aac|ogg|flac/)) {
    // Audio types
    gatewayURL = "https://audio.gateway.com";
    downloadURL = "https://audio.download.com";
  } else {
    // Other types
    gatewayURL = "https://other.gateway.com";
    downloadURL = "https://other.download.com";
  }
  const handleDownload = (e) => {
    e.stopPropagation();
    saveAs(downloadURL, `PolyCloudV2_${file.fileName}`);
  };
  return (
    <div className="">
      <Toaster />
      <div
        className="max-w-xs border-blue-300 border-2 mx-auto w-72 bg-white rounded-lg shadow-md overflow-hidden h-full min-h-full cursor-pointer"
        onClick={() => {
          window.open(gatewayURL, "_blank");
        }}
      >
        <img
          src={gatewayURL}
          alt={file.fileName}
          className="w-96p mx-auto h-72 object-cover border-blue-900 border-b-4"
        />

        <h3 className="font-bold text-lg text-center">{file.fileName}</h3>

        <div className="flex text-blue-500 justify-around my-2 items-center">
          <p>
            {fileSize < 1050
              ? `${fileSize} KB`
              : `${fileSize * 1024 * 1024} GB`}
          </p>
          <div className="items-center align-middle">
            <button
              onClick={async (e) => {
                e.stopPropagation();
                toast.loading("Copying SHAREABLE link", { id: 2 });
                const result = await fetch(
                  `https://api.shrtco.de/v2/shorten?url=${gatewayURL}`
                );
                const data = await result.json();
                if (data.ok) {
                  toast.success("Copied SHAREABLE link", { id: 2 });
                  const copiedLink = data.result.full_short_link2;
                  navigator.clipboard.writeText(copiedLink);
                } else {
                  toast.error("Error copying SHAREABLE link, try again", {
                    id: 2,
                  });
                }
              }}
            >
              <BsFillShareFill />
            </button>
            <button className="text-xl pl-3" onClick={handleDownload}>
              <BsCloudDownloadFill />
            </button>
          </div>
        </div>
        <div className="text-center mb-2 text-gray-400 text-xs">
          Uploaded On: {localeDate}
        </div>
      </div>
    </div>
  );
}
