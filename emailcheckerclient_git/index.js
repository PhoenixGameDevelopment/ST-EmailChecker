
const gip = "localhost" 
//const gip = "192.168.x.x";//YOUR LAN IP HERE

console.log("EmailReader: Client Module loaded"); 

import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";

//You'll likely need to import some other functions from the main script
import { saveSettingsDebounced } from "../../../../script.js";
import { callPopup } from "../../../../script.js";

// Keep track of where your extension is located, name should match repo name
const extensionName = "emailcheckerclient_git";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {};

const ws = new WebSocket('ws://'+gip+':3000')
var numemails = 3;

// Loads the extension settings if they exist, otherwise initializes them to the defaults.
async function loadSettings() {
  //Create the settings if they don't exist
  extension_settings[extensionName] = extension_settings[extensionName] || {};
  if (Object.keys(extension_settings[extensionName]).length === 0) {
    Object.assign(extension_settings[extensionName], defaultSettings);
  }

  // Updating settings in the UI
  $("#example_setting").prop("checked", extension_settings[extensionName].example_setting).trigger("input");
}

// This function is called when the extension settings are changed in the UI
function onExampleInput(event) {
  const value = Boolean($(event.target).prop("checked"));
  extension_settings[extensionName].example_setting = value;
  saveSettingsDebounced();
}

async function test(txt){
	   const context = getContext();
	
	   if(txt == "STARTUPMESSAGE")
	  	 return;	   

   console.log("test:" + txt);
	 context.executeSlashCommands('/reasoning-set The following content are emails:\n ' + txt + ' ').pipe
}

export default {
    name: 'Email Checker',
    author: 'PhoenixGameDevelopment',
    version: '1.0',
    icon: 'fa-solid fa-envelope',
};

ws.onopen = () => {
  console.log('ws opened on browser')
}

ws.onmessage = (message) => {
  console.log(`message received`, message.data); 
  test(message.data);
}

async function getEmails() {

 numemails = $('#num_emails').val();
    console.log("Get Emails: " + numemails);
    if(numemails < 1)
    numemails = 1;
 ws.send('getemails_'+numemails)
};

// This function is called when the extension is loaded
jQuery(async () => {
  // This is an example of loading HTML from a file
  const settingsHtml = await $.get(`${extensionFolderPath}/example.html`);
console.log("ex: " + extensionFolderPath);
  // extension_settings and extensions_settings2 are the left and right columns of the settings menu
  // Left should be extensions that deal with system functions and right should be visual/UI related 
  $("#extensions_settings2").append(settingsHtml);

  // These are examples of listening for events
  $("#example_setting").on("input", onExampleInput);   
  
      $('#email_test').on('click', async () => {
        const result = await getEmails();
    });

  loadSettings();
});

