import{Pixi}from "./pixi.js";const app=document.getElementById("app");let pixi=new Pixi();app.appendChild(pixi.app.view);document.getElementById("appButtons").appendChild(pixi.addModeRadioButtons());disableRightClickContextMenu();function disableRightClickContextMenu(){window.addEventListener("contextmenu",e=>e.preventDefault())}