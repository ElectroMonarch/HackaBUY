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
});