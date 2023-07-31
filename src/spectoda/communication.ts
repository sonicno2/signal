// @ts-nocheck

// import esPkg from 'essentia.js';
import { setLoggingLevel } from "../lib/spectoda-js/Logging"
import { TangleDevice } from "../lib/spectoda-js/TangleDevice"
import { TangleMsgBox } from "../lib/webcomponents/dialog-component"

const primaryColor = "#ff8c5c"

if (typeof window !== "undefined") {
  TangleMsgBox.setStyles(`
     .tangle-msg-box-dialog-button:last-of-type {
           background: ${primaryColor} !important;
     }
      .tangle-msg-box-dialog-button:last-of-type:hover {
         background: ${primaryColor} !important;
      }
      .tangle-msg-box-dialog-header {
      }
      .tangle-msg-box-dialog-textbox {
      }
      .tangle-msg-box-dialog-header, .tangle-msg-box-dialog-body, .tangle-msg-box-dialog-footer  {
           background: #0a0c27 !important;
      }
      .tangle-msg-box-dialog-textbox {
           background: #1a1c34;
      }
      .tangle-msg-box-dialog-option {
           background: #1a1c34;
      }
      `)
}

const spectodaDevice = new TangleDevice("default", 0)
// console.log("AutoConnect")
// Matty key
if (typeof window !== "undefined") {
  spectodaDevice.assignOwnerSignature(
    localStorage.getItem("ownerSignature") || "a06cd5c4d5741b61fee69422f2590926"
  )
  spectodaDevice.assignOwnerKey(
    localStorage.getItem("ownerKey") || "bfd39c89ccc2869f240508e9a0609420"
  )
  // // Lukas
  // spectodaDevice.assignOwnerSignature("65adda4326914576405c9e3a62f4904d");
  // spectodaDevice.assignOwnerKey("bfd39c89ccc2869f240508e9a0609420");
  //@ts-ignore
  window.spectodaDevice = spectodaDevice
  process.env.NODE_ENV === "development" && setLoggingLevel(4)

  let url = new URL(location.href)
  let params = new URLSearchParams(url.search)

  if (params.get("demo")) {
    setTimeout(() => {
      spectodaDevice.assignConnector("dummy")
    }, 300)
  }
}

// process.env.NODE_ENV === "production" && spectodaDevice.assignConnector("webbluetooth");
export { spectodaDevice }

// const essentia = new esPkg.Essentia(esPkg.EssentiaWASM);
