/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';
import {blocks} from './blocks/json.js';
import {jsonGenerator} from './generators/json.js';
import {save, load} from './serialization.js';
import {toolbox} from './toolbox.js';
import './index.css';

// Register the blocks with Blockly
Blockly.common.defineBlocks(blocks);

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById('generatedCode').firstChild;
const blocklyDiv = document.getElementById('blocklyDiv');
const ws = Blockly.inject(blocklyDiv, {toolbox});

// Bu fonksiyon, Blockly'den kodu oluşturur ve HTML'e yazar
const updateCodeDisplay = () => {
  const code = jsonGenerator.workspaceToCode(ws);
  codeDiv.innerText = code;
};

// Bu fonksiyon, Blockly'den kodu alır ve PyScript'in çalıştırabileceği bir HTML öğesine yerleştirir.
const runCode = () => {
    const codeToRun = jsonGenerator.workspaceToCode(ws);
    
    const pyScriptTag = document.querySelector('py-script');
    
    // Çıktı alanını temizle
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = 'Uygulama mesajları veya çıktıları burada görünecek.';
    
    // PyScript'e kodu ve çıktının yazılacağı yeri söyle
    // print fonksiyonunu override ederek çıktıyı HTML'e yazmasını sağla
    pyScriptTag.innerHTML = `
        from js import document
        from pyodide.ffi import to_js

        def custom_print(*args, sep=' ', end='\\n', file=None):
            output_el = document.getElementById('output')
            output_el.innerHTML += sep.join(str(x) for x in args) + end
            output_el.scrollTop = output_el.scrollHeight

        __builtins__.print = custom_print

        ${codeToRun}
    `;

    // PyScript'i yeniden başlatarak yeni kodu çalıştır
    const newPyScriptTag = document.createElement('py-script');
    newPyScriptTag.innerHTML = pyScriptTag.innerHTML;
    pyScriptTag.parentNode.replaceChild(newPyScriptTag, pyScriptTag);
};


// Load the initial state from storage and update the code display.
load(ws);
updateCodeDisplay();

// Every time the workspace changes state, save the changes to storage.
ws.addChangeListener((e) => {
  // UI events are things like scrolling, zooming, etc.
  // No need to save after one of these.
  if (e.isUiEvent) return;
  save(ws);
});

// Whenever the workspace changes meaningfully, update the code display.
ws.addChangeListener((e) => {
  // Don't run the code when the workspace finishes loading; we're
  // already running it once when the application starts.
  // Don't run the code during drags; we might have invalid state.
  if (
    e.isUiEvent ||
    e.type == Blockly.Events.FINISHED_LOADING ||
    ws.isDragging()
  ) {
    return;
  }
  updateCodeDisplay();
});

document.addEventListener('DOMContentLoaded', () => {
  const downloadButton = document.getElementById('downloadDataButton');
  const fileInput = document.getElementById('fileInput');
  const fileStatus = document.getElementById('fileStatus');
  const clearButton = document.getElementById('clearButton');

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
            // Dosya yükleme başarılıysa durumu güncelle
            fileStatus.textContent = `Dosya yüklendi: ${selectedFile.name}`;
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
  }

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      Blockly.serialization.workspaces.load({}, ws, false);
      updateCodeDisplay();
    }); 
  }
  
  if (runButton) {
    runButton.addEventListener('click', runCode);
  }

});