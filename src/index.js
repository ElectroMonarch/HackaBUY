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


// runCode fonksiyonunu window objesine atayarak global erişim sağlandı
window.runCode = async () => {
  // Blockly'den temiz, sadece Python kodu olan bir metin al.
  const codeToRun = jsonGenerator.workspaceToCode(ws);
  
  // Çıktı div'ini al.
  const outputDiv = document.getElementById('output');
  if (!outputDiv) {
    console.error('Çıktı divi bulunamadı.');
    return;
  }
  
  // Bu, PyScript'e gönderilecek olan Python kodudur.
  const pythonCodeWithOutput = 
  `
  # Bu kod, PyScript çıktısını doğrudan HTML'deki div'e yazar.
  import sys
  from js import document

  class OutputCatcher:
    def __init__(self, element_id):
        self.output_element = document.getElementById(element_id)
        self.output_element.innerHTML = ''
    
    def write(self, s):
        # PyScript'teki Pyodide, çıktıyı buraya gönderir.
        self.output_element.innerHTML += s

  sys.stdout = OutputCatcher('output')

  ${codeToRun}
  `;

  // PyScript runtime kontrolü
  if (!window.pyscript || !window.pyscript.runtime) {
    console.error('PyScript runtime bulunamıyor.');
    outputDiv.innerHTML = '<span style="color: red;">Hata: PyScript ortamı başlatılamadı veya hazır değil.</span>';
    return;
  }

  // Önceki çıktıyı temizle
  outputDiv.innerHTML = '<div style="color: #6c757d; font-style: italic;">Kod çalıştırılıyor...</div>';

  try {
    // PyScript API'sini kullanarak kodu çalıştır.
    await window.pyscript.runtime.runPythonAsync(pythonCodeWithOutput);
  } catch (error) {
    console.error('Kod çalıştırma hatası:', error);
    outputDiv.innerHTML = `<span style="color: red;">Hata: ${error.toString()}</span>`;
  }
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
});