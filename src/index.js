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

// This function resets the code div and shows the
// generated code from the workspace.
const runCode = () => {
  const code = jsonGenerator.workspaceToCode(ws);
  codeDiv.innerText = code;
};

// Load the initial state from storage and run the code.
load(ws);
runCode();

// Every time the workspace changes state, save the changes to storage.
ws.addChangeListener((e) => {
  // UI events are things like scrolling, zooming, etc.
  // No need to save after one of these.
  if (e.isUiEvent) return;
  save(ws);
});

// Whenever the workspace changes meaningfully, run the code again.
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
  runCode();
});

document.addEventListener('DOMContentLoaded', () => {
  const downloadButton = document.getElementById('downloadDataButton');
  const fileInput = document.getElementById('fileInput');
  const fileContentDisplay = document.getElementById('fileContentDisplay');
  const clearButton = document.getElementById('clearButton');
  if (downloadButton) {
    downloadButton.addEventListener('click', () => {
        // 1. Veriyi Hazırlama (örnek olarak JSON)
        const userData = Blockly.serialization.workspaces.save(ws);

        // Veriyi JSON string'ine dönüştür
        const jsonString = JSON.stringify(userData); // null ve 2 ile daha okunabilir format

        // 2. Blob Oluşturma
        // 'application/json' MIME tipi ile bir Blob oluşturuyoruz
        const blob = new Blob([jsonString], { type: 'application/json' });

        // 3. URL Oluşturma
        const url = URL.createObjectURL(blob);

        // 4. İndirme Bağlantısı Oluşturma
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user_data.json'; // Kullanıcının indireceği dosyanın adı

        // 5. Programatik Tıklama ve Temizleme
        // Bağlantıyı doğrudan tıklayarak indirme işlemini başlat
        a.click();

        // Oluşturulan geçici URL'yi ve dolayısıyla Blob'u bellekten serbest bırak
        // Bu, kaynak sızıntılarını önlemek için önemlidir
        URL.revokeObjectURL(url);

        console.log('Veri indirme işlemi başlatıldı.');
    });
} 
  if (fileInput) {
    fileInput.addEventListener('change', (event) => {
      const selectedFile = event.target.files[0]; // Tek dosya seçimi için ilk dosyayı al

      if (selectedFile) {
          console.log('Seçilen Dosya Adı:', selectedFile.name);
          console.log('Seçilen Dosya Tipi:', selectedFile.type);
          console.log('Seçilen Dosya Boyutu:', selectedFile.size, 'bytes');

          const reader = new FileReader();

          reader.onload = (e) => {
              const fileContent = e.target.result;
              let displayContent = '';
              const jsonData = JSON.parse(fileContent);
              Blockly.Events.disable();
              Blockly.serialization.workspaces.load(jsonData, ws, false);
              Blockly.Events.enable();

          };

          reader.onerror = (error) => {
              console.error('Dosya okuma hatası:', error);
              fileContentDisplay.innerHTML = `<p style="color: red;">Dosya okunurken bir hata oluştu: ${error.message}</p>`;
          };

          // Dosya türüne göre uygun okuma metodunu kullan
          if (selectedFile.type.startsWith('text/') || selectedFile.type === 'application/json') {
              reader.readAsText(selectedFile);
          } else if (selectedFile.type.startsWith('image/')) {
              reader.readAsDataURL(selectedFile);
          } else {
              // Diğer ikili dosyalar için ArrayBuffer olarak oku
              reader.readAsArrayBuffer(selectedFile);
          }

      } else {
          fileContentDisplay.innerHTML = '<p>Henüz dosya seçilmedi.</p>';
      }
  });
  }
  /*

  if(clearButton){
    downloadButton.addEventListener('click', () => {
      Blockly.Events.disable();
      Blockly.serialization.workspaces.load(JSON.parse(""),ws,false);
      Blockly.Events.enable();
    });
  };

*/



});