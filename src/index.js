import * as Blockly from 'blockly';
import {blocks} from './blocks/pythonBlocks.js';
import {pythonGenerator} from './generators/pythonGenerators.js';
import {save, load} from './serialization.js';
import {toolbox} from './toolbox.js';
import './index.css';


Blockly.common.defineBlocks(blocks);
Blockly.Blocks['variable'].init = function() {
    this.jsonInit({
      "type": 'variable',
      "message0": '%1',
      "args0": [
        {
          "type": 'field_input',
          "name": 'VAR_NAME',
        },
      ],
      "output": null,
      "colour": 330,
    });
    const myTextInput = this.getField('VAR_NAME');
    myTextInput.setValidator(function(text) {
    const regex = /^[a-zA-Z_ığüşçö$][a-zA-Z0-9_ığüşçö$]*$/;
    if (text.match(regex)) {
        return text;
    }
    return null;
  });
};
Blockly.Blocks['variable_set'].init = function() {
    this.jsonInit({
      "type": 'variable_set',
      "message0": '%1 değişkeninin değerini %2 olarak ayarla',
      "args0": [
        {
          "type": 'field_input',
          "name": 'VAR_NAME',
          "text": 'değişken_ismi',
        },
        {
          "type": 'input_value',
          "name": 'VALUE',
        },
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 330,
    });
    const myTextInput = this.getField('VAR_NAME');
    myTextInput.setValidator(function(text) {
    const regex = /^[a-zA-Z_ığüşçö$][a-zA-Z0-9_ığüşçö$]*$/;
    if (text.match(regex)) {
        return text;
    }
    return null;
  });
};

const codeDiv = document.getElementById('generatedCode').firstChild;
const blocklyDiv = document.getElementById('blocklyDiv');
const ws = Blockly.inject(blocklyDiv, {toolbox});

const updateCodeDisplay = () => {
  const code = pythonGenerator.workspaceToCode(ws);
  pythonGenerator.clear_names_set();
  codeDiv.innerText = code;
};

load(ws);
updateCodeDisplay();

ws.addChangeListener((e) => {
  if (e.isUiEvent || e.type === Blockly.Events.FINISHED_LOADING || ws.isDragging()) {
    return;
  }
  updateCodeDisplay();
});

document.addEventListener('DOMContentLoaded', () => {
  const downloadButton = document.getElementById('downloadDataButton');
  const fileInput = document.getElementById('fileInput');
  const fileStatus = document.getElementById('fileStatus');
  const clearButton = document.getElementById('clearButton');
  const askAIButton = document.getElementById('AskAIButton');
  const dropdownButton = document.getElementById('examplesDropdown');
  const dropdownMenu = document.getElementById('dropdownContent');


  if (downloadButton) {
    downloadButton.addEventListener('click', () => {
      const userData = Blockly.serialization.workspaces.save(ws);
      const jsonString = JSON.stringify(userData, null, 2);
      const blob = new Blob([jsonString], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'user_data.json';
      a.click();
      URL.revokeObjectURL(url);
      console.log('Veri indirme işlemi başlatıldı.');
    });
    updateCodeDisplay();
  }

  if (fileInput) {
    fileInput.addEventListener('change', (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        fileStatus.textContent = `Dosya: ${selectedFile.name}`;
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileContent = e.target.result;
          try {
            const jsonData = JSON.parse(fileContent);
            Blockly.Events.disable();
            Blockly.serialization.workspaces.load(jsonData, ws, false);
            Blockly.Events.enable();
            updateCodeDisplay();
          } catch (error) {
            console.error('Dosya okuma veya JSON ayrıştırma hatası:', error);
            fileStatus.textContent = `Hata: Geçersiz dosya formatı.`;
          }
        };
        reader.onerror = (error) => {
          console.error('Dosya okuma hatası:', error);
          fileStatus.textContent = 'Dosya okuma hatası.';
        };
        reader.readAsText(selectedFile);
      } else {
        fileStatus.textContent = 'Dosya seçilmedi';
      }
    });
    updateCodeDisplay();
  }

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      Blockly.serialization.workspaces.load({}, ws, false);
      updateCodeDisplay();
    });
  }
  if (askAIButton) {

  }

  dropdownButton.addEventListener('click', function(event) {
    dropdownMenu.classList.toggle('show');
    event.stopPropagation(); // Butona tıklama olayının yayılmasını engeller
  });

  document.addEventListener('click', function(event) {
    if (!dropdownMenu.contains(event.target) && !dropdownButton.contains(event.target)) {
        dropdownMenu.classList.remove('show');
    }
  });

  function getFileContentSync(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
    } catch (err) {
    console.error('Dosya okuma hatası:', err);
    return null;
    }
  }

if (dropdownContent) {
    const items = dropdownContent.querySelectorAll("a.dropdown-item");

    items.forEach(item => {
      item.addEventListener("click", async function(event) {
        event.preventDefault();
        const path = this.getAttribute("data");

        try {
          const response = await fetch(path);
          if (!response.ok) {
            throw new Error(`Dosya yüklenemedi: ${response.statusText}`);
          }
          const jsonData = await response.json();
          
          Blockly.Events.disable();
          Blockly.serialization.workspaces.load(jsonData, ws, false);
          Blockly.Events.enable();
          updateCodeDisplay();

        } catch (error) {
          console.error('Örnek dosya yükleme hatası:', error);
          alert(`Örnek yüklenirken bir hata oluştu: ${error.message}`);
        }
      });
    });
  }



if (askAIButton) {
    askAIButton.addEventListener('click', async () => {
      const promptText = document.getElementById('promptInputField').value;
      const codeDiv = document.getElementById('generatedCode').firstChild;

      if (!promptText) {
        codeDiv.innerText = 'Lütfen yapay zekaya sormak istediğiniz şeyi girin.';
        return;
      }
      
      codeDiv.innerText = 'Yapay zeka yanıtı bekleniyor...';

      // Servis hesabı bilgileri (hassas olduğu için dikkatli olun)
      const serviceAccount = {
        "type": "service_account",
        "project_id": "dulcet-glyph-468013-g8",
        "private_key_id": "b644869ea3be3794e9fc6f4f4dd2253769ae15f6",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC+7GCcfFpaI2US\nryUI8+XcW6Fg5/ZYhwcjHzsZa0vVxPrePz2aN112v52a8Nzw2aLyNtYFH09gun+f\nhwXroeNC5lpt0OqNPu8n2T33LujlyhPnrGBECruj8fjD6LKMwMXkZdDCGpjzEPuB\nl8pgayM2YcpK9AK4X4loc2sGSLJ0vcUmL/njXmwQXfu4BFdaH2hkohSineuRQfJD\nhO46CAtJjcDLG+aGd+SofbaI/klJ2JRKwc4cRdx6voDqegw/ub5P7gMlPj5MU+Xi\nZXJJUeWP4NYrqqOlSpMm0tGBT+TPfZULG40lIH7Md+FrTVQdlOfK6gq7druBjCWt\ncHTWczRvAgMBAAECggEAQdKXykubENmEFql4kLoZpNuYayL9zO6cmNDDHNPfnM8h\nGG9gKyNsXyzXxtvEqGq4IV6jcbemM7iImHTCJ0c0ZVOqmJK+0ryAUlI06VvsYpDF\nRQmqVLsIjxC0zcITkLBDaadqjgkCc0aHF1pAJPa6+JxFVIsExxD0/CRSoSN+Fv3f\nBdUA1JYUtzmyWvKOVgefhJ0EK3NMX9xG9E4WPmOIaKG2bR98NJGFLsX5FvMVkJ5M\nQJb+YtRu/kKC/a9QxOUNc8nmHm7HQAP/PBUhCAkHsealbrBMoXMU4504w8UYm7sH\nqmSEsia4xPMNU19MU5vl8ecyJjhalECPPHH055p5TQKBgQDxw74z3QN8xO9N/uNY\nvhccBHJcDWE00SzH7ZADYm6+e/Xo7rb+4pTQ0zlJFPInCeqLPwvcA1dCmFp/tcDN\nRVvhUD8asMC4J+Az6L5H2+FEXElbFTvz7Z3aMeB4px7m/ZqQDNTaz/0ykcU7dF7/\nEmNIpqfP9+cqKafCvZjgyaJYLQKBgQDKKkZTeb+g3oh/y2q0oMe9BgJP5HJnah5p\ntGBa902gwgjzrDgc5ark1QWdUY5rY7Tac5yIR/RRtuk1/ysB3zRczhwTUa3yeQGg\nLLD+Tk3MTtqdNGddDLGs9LgD1KWWEMvOHFa3bG8GJPraPL2U8P7yXqt/bQJrIwBQ\nxkfhE+MkiwKBgBRM6miyczuD0dBLyc1G0OvyV6PxH6tusQLsqL4QAtqN0B1KBiWq\n4vIR+mpvjtHGXGJq3dUQlsApyNeWbGUQIOHveg0EsHoGJyZUsb2Y8fZqhWJXixw1\nZJ7Qt1eKOOcOfm8AFNN2yXz4joYqhFuIsLuF+utUlp2Mt+B7SR3+8FnVAoGAUcho\nSryl2N4tOgWAVTH1m3Ii3U79OPik9P4TPLluneng1TKGQKpoR8olS08C3k6nivfa\nCweQvr3P+hgPveIdvK1kjiwswjpRfgqWT0o+DriXl6Drb6kC94TILESJ9/szd13f\ndrRW9ZVgJYkM6IPVnxbNKe9fWxf9uK99xH/XE6ECgYEAqiNJP6Q/z8HIr4lvBMd5\n37FfREnnfybSpE4ywKH1EUegOaFbIedK+/uAXXdiArWGW446FZrl+zifJWInGK48\npMhYs90NO77/GQCHbQTlcTw8kKZUYxhui7bQkXv4ORrDn3TcqRXYXm6Ms4X5Sn47\nUBqKlYGkpIk1VADrqRluv8I=\n-----END PRIVATE KEY-----\n",
        "client_email": "hackabuy@dulcet-glyph-468013-g8.iam.gserviceaccount.com",
      };

      const header = { "alg": "RS256", "typ": "JWT" };
      const now = Math.floor(Date.now() / 1000);
      const payload = {
        "iss": serviceAccount.client_email,
        "scope": "https://www.googleapis.com/auth/cloud-platform",
        "aud": "https://oauth2.googleapis.com/token",
        "exp": now + 3600,
        "iat": now
      };
      const sHeader = JSON.stringify(header);
      const sPayload = JSON.stringify(payload);
      const sJWS = KJUR.jws.JWS.sign("RS256", sHeader, sPayload, serviceAccount.private_key);

      try {
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${sJWS}`
        });

        if (!tokenResponse.ok) {
          throw new Error(`Token alma hatası! Durum: ${tokenResponse.status}`);
        }

        const tokenResult = await tokenResponse.json();
        const accessToken = tokenResult.access_token;
        
        // Özel model için doğru uç nokta ve model kimliği
        const projectId = 'dulcet-glyph-468013-g8';
        const location = 'us-central1';
        const endpointId = '5052619867979513856';

        const customModelApiEndpoint = `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/endpoints/${endpointId}:predict`;

        // Özel modelin beklediği JSON gövdesi
        const aiResponse = await fetch(customModelApiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            "instances": [
              { "prompt": promptText } // Modelinizin beklediği giriş formatı
            ]
          }),
        });

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          throw new Error(`AI API hatası! Durum: ${aiResponse.status}, Yanıt: ${errorText}`);
        }

        const aiResult = await aiResponse.json();
        console.log("Özel AI modelinden gelen yanıt:", aiResult);
        
        // Yanıtın yapısı modelinize göre değişebilir.
        // Genellikle predictions anahtarı altında gelir.
        const generatedBlocklyCode = aiResult.predictions[0];
        
        // JSON string'ini ayrıştırıp Blockly'ye yükleme
        try {
          const blocklyData = JSON.parse(generatedBlocklyCode);
          Blockly.Events.disable();
          Blockly.serialization.workspaces.load(blocklyData, ws, false);
          Blockly.Events.enable();
          updateCodeDisplay();
          codeDiv.innerText = "Yapay zeka kodunuzu bloklara dönüştürdü!";
        } catch (jsonError) {
          console.error("Yapay zekadan gelen yanıt JSON formatında değil:", jsonError);
          codeDiv.innerText = `Yapay zekadan gelen yanıt işlenemedi. Yanıt:\n${generatedBlocklyCode}`;
        }


      } catch (error) {
        console.error('Yapay zeka çağrısında bir hata oluştu:', error);
        codeDiv.innerText = `Yapay zeka çağrısında bir hata oluştu: ${error.message}. Konsolu kontrol edin.`;
      }
    });
  }
});