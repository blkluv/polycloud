import React from "react";
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
  // const extension = "mp3";

  let gatewayURL;
  const downloadURL = `https://ipfs.io/ipfs/${file.fileCID.split("//")[1]}`;

  if (extension.match(/jpg|jpeg|png|gif|webp|tiff|psd|svg/)) {
    // Image types
    gatewayURL = `https://ipfs.io/ipfs/${file.fileCID.split("//")[1]}`;
  } else if (extension.match(/zip|rar|7z|tar|gz|bz2/)) {
    // Archive types
    gatewayURL =
      "https://ipfs.io/ipfs/QmTUF6yNztg42MMh1v9fptzGBjC6fYfq4T1yRPnCa6qPBg/archive.png";
  } else if (extension.match(/exe|dmg|apk|msi|deb|rpm/)) {
    // Software types
    gatewayURL =
      "https://ipfs.io/ipfs/QmTUF6yNztg42MMh1v9fptzGBjC6fYfq4T1yRPnCa6qPBg/software.png";
  } else if (extension.match(/doc|docx|pdf|txt|rtf|odf/)) {
    // Document types
    gatewayURL =
      "https://ipfs.io/ipfs/QmTUF6yNztg42MMh1v9fptzGBjC6fYfq4T1yRPnCa6qPBg/document.png";
  } else if (extension.match(/mp4|mov|avi|mkv|wmv|flv|3gp|webm|ogg/)) {
    // Video types
    gatewayURL = `https://ipfs.io/ipfs/QmcHB268Uss2RUsqR1qwazQMVDgtGRYqVCjrd6Zdrt8cch`;
  } else if (extension.match(/mp3|wav|wma|aac|ogg|flac|m4a/)) {
    // Audio types
    gatewayURL = `https://ipfs.io/ipfs/${file.fileCID.split("//")[1]}`;
  } else if (extension.match(/stl|obj|dae|blend|fbx|3ds/)) {
    // 3D cad
    gatewayURL =
      "https://ipfs.io/ipfs/QmTUF6yNztg42MMh1v9fptzGBjC6fYfq4T1yRPnCa6qPBg/3dcad.png";
  } else if (extension.match(/sql|db|sqlite|parquet/)) {
    //  Databases types
    gatewayURL =
      "https://ipfs.io/ipfs/QmTUF6yNztg42MMh1v9fptzGBjC6fYfq4T1yRPnCa6qPBg/database.png";
  } else if (extension.match(/xls|xlsx|ods|numbers/)) {
    // Spreadsheet types
    gatewayURL =
      "https://ipfs.io/ipfs/QmTUF6yNztg42MMh1v9fptzGBjC6fYfq4T1yRPnCa6qPBg/spreadsheet.png";
  } else if (extension.match(/ppt|pptx/)) {
    // Presentation types
    gatewayURL =
      "https://ipfs.io/ipfs/QmTUF6yNztg42MMh1v9fptzGBjC6fYfq4T1yRPnCa6qPBg/presentation.png";
  } else if (extension.match(/psd|ai|afdesign|sketch/)) {
    // Design types
    gatewayURL =
      "https://ipfs.io/ipfs/QmTUF6yNztg42MMh1v9fptzGBjC6fYfq4T1yRPnCa6qPBg/design.png";
  } else if (extension.match(/shp|geojson|kml/)) {
    // GIS types
    gatewayURL =
      "https://ipfs.io/ipfs/QmTUF6yNztg42MMh1v9fptzGBjC6fYfq4T1yRPnCa6qPBg/gis.png";
  } else if (extension.match(/ttf|otf|woff|woff2/)) {
    // Font types
    gatewayURL =
      "https://ipfs.io/ipfs/QmTUF6yNztg42MMh1v9fptzGBjC6fYfq4T1yRPnCa6qPBg/font.png";
  } else if (extension.match(/exe|msi|apk|dmg|deb|rpm|pkg/)) {
    // Executable types
    gatewayURL =
      "https://ipfs.io/ipfs/QmTUF6yNztg42MMh1v9fptzGBjC6fYfq4T1yRPnCa6qPBg/executable.png";
  } else if (extension.match(/html|htm|js|css|php/)) {
    // Web types
    gatewayURL =
      "https://ipfs.io/ipfs/QmTUF6yNztg42MMh1v9fptzGBjC6fYfq4T1yRPnCa6qPBg/web.png";
  } else if (extension.match(/json|xml|yaml|toml/)) {
    // Data types
    gatewayURL =
      "https://ipfs.io/ipfs/QmTUF6yNztg42MMh1v9fptzGBjC6fYfq4T1yRPnCa6qPBg/data.png";
  } else if (extension.match(/cpp|h|swift|Java|cs|go|rb|fs|rs|ts|jsx/)) {
    // Code types
    gatewayURL =
      "https://ipfs.io/ipfs/QmTUF6yNztg42MMh1v9fptzGBjC6fYfq4T1yRPnCa6qPBg/code.png";
  } else if (extension.match(/iso|img|vhd|vmdk|ova|vdi/)) {
    // Disk Image types
    gatewayURL =
      "https://ipfs.io/ipfs/QmTUF6yNztg42MMh1v9fptzGBjC6fYfq4T1yRPnCa6qPBg/disk.png";
  } else if (extension.match(/md|markdown|rst|adoc|tex/)) {
    // Text types
    gatewayURL =
      "https://ipfs.io/ipfs/QmTUF6yNztg42MMh1v9fptzGBjC6fYfq4T1yRPnCa6qPBg/text.png";
  } else if (extension.match(/sol|vy|ipld|car/)) {
    // Blockchain types
    gatewayURL =
      "https://ipfs.io/ipfs/QmTUF6yNztg42MMh1v9fptzGBjC6fYfq4T1yRPnCa6qPBg/blockchain.png";
  } else if (extension.match(/torrent|magnet/)) {
    // Torrent types
    gatewayURL =
      "https://ipfs.io/ipfs/QmTUF6yNztg42MMh1v9fptzGBjC6fYfq4T1yRPnCa6qPBg/torrent.png";
  } else if (extension.match(/log|conf|ini|reg/)) {
    //  Config types
    gatewayURL =
      "https://ipfs.io/ipfs/QmTUF6yNztg42MMh1v9fptzGBjC6fYfq4T1yRPnCa6qPBg/config.png";
  } else {
    // Other types
    gatewayURL =
      "https://ipfs.io/ipfs/QmTUF6yNztg42MMh1v9fptzGBjC6fYfq4T1yRPnCa6qPBg/other.png";
  }
  const handleDownload = (e) => {
    e.stopPropagation();
    saveAs(downloadURL, `PolyCloudV2_${file.fileName}`);
  };
  return (
    <div>
      <Toaster />
      <div
        className="max-w-xs border-blue-300 border-2 mx-auto w-72 bg-white rounded-lg shadow-md overflow-hidden h-full min-h-full cursor-pointer"
        onClick={() => {
          window.open(downloadURL, "_blank");
        }}
      >
        <img
          src={gatewayURL}
          alt={file.fileName}
          className="w-96p mx-auto h-72 object-cover border-blue-900 border-b-4"
        />

        <h3 className="font-bold text-lg text-center">
          {file.fileName.length > 10
            ? file.fileName.slice(0, 11)
            : file.fileName}
        </h3>

        <div className="flex text-blue-500 justify-around my-2 items-center">
          <p>
            {fileSize < 1050
              ? `${fileSize} KB`
              : `${(fileSize / (1024 * 1024)).toFixed(7)} GB`}
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
