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

        try {
            // Daha kısıtlayıcı bir istem oluşturma
            const fullPrompt = `
                Aşağıdaki kullanıcı isteğini, Blockly bloklarını temsil eden bir JSON nesnesine dönüştür.
    Çıktı sadece ve sadece JSON nesnesi olmalıdır. Başka hiçbir metin, açıklama veya ek bilgi içermemelidir.
    JSON nesnesi, Blockly'nin serileştirme formatına uygun olmalıdır.
                Aşağıdaki kullanıcı isteğini, Blockly bloklarını temsil eden bir JSON nesnesine dönüştür.
    Çıktı sadece ve sadece JSON nesnesi olmalıdır. Başka hiçbir metin, açıklama veya ek bilgi içermemelidir.
    JSON nesnesi, Blockly'nin serileştirme formatına uygun olmalıdır.
                Kullanıcının isteği: ${promptText}
                Bu isteği temsil eden Blockly bloklarını JSON formatında oluştur ve çıktıyı sadece JSON olarak ver.
                    Bu isteği temsil eden Blockly bloklarını JSON formatında oluştur. Senden sadece JSON formatında bir yanıt bekliyorum.
                Verceğin yanıtı başka şekilde açıklama yapmadan, sadece JSON formatında ver. Yanıtı bir Markdown kod bloğu içine almayın.
    Yanıt sadece JSON nesnesi olmalı, ek açıklama veya metin içermemeli.
    aşşağıda kullanabileceğin bloklar var bunlar dışında blok kullanma:
          ${JSON.stringify(toolbox, null, 2)};
    {
  "blocks": {
    "languageVersion": 0,
    "blocks": [
      {
        "type": "text_output",
        "id": "V3U)ClSqv0u)k06Zar!K",
        "x": 198,
        "y": 43,
        "fields": {
          "OUTPUT_TEXT": "hello"
        },
        "next": {
          "block": {
            "type": "number_output",
            "id": "#t$hK]?i+[7#zxbA%OdE",
            "inputs": {
              "MEMBER_VALUE": {
                "block": {
                  "type": "arithmetic",
                  "id": "k;9*Iz-GJa/(u]H#]/Fl",
                  "fields": {
                    "DROPDOWN": "+"
                  },
                  "inputs": {
                    "NUM1": {
                      "block": {
                        "type": "math_number",
                        "id": "pEtFdJjEdfT9!|?46$.z",
                        "fields": {
                          "NUM": 3
                        }
                      }
                    },
                    "NUM2": {
                      "block": {
                        "type": "math_number",
                        "id": "3KmmOXNW*d9:.m1:y]BM",
                        "fields": {
                          "NUM": 3
                        }
                      }
                    }
                  }
                }
              }
            },
            "next": {
              "block": {
                "type": "variable_set",
                "id": "c!:^:s?j:kqtg@{S6}n=",
                "fields": {
                  "VAR_NAME": "değişken_ismi"
                },
                "inputs": {
                  "VALUE": {
                    "block": {
                      "type": "variable",
                      "id": "-/UqK{u=:]~8X+(0:gPr",
                      "fields": {
                        "VAR_NAME": "yeeey"
                      }
                    }
                  }
                },
                "next": {
                  "block": {
                    "type": "if_else_block",
                    "id": "M6-MO)to!cFR:r3wOJHK",
                    "fields": {
                      "DROPDOWN": "=="
                    },
                    "inputs": {
                      "NUM1": {
                        "block": {
                          "type": "variable",
                          "id": "imOvoV[*L#Y#Q3uDr-o",
                          "fields": {
                            "VAR_NAME": ""
                          }
                        }
                      },
                      "MEMBERS": {
                        "block": {
                          "type": "while_block",
                          "id": "|I$JV1BQ#f7C@gd!rp}l",
                          "fields": {
                            "DROPDOWN": "=="
                          },
                          "inputs": {
                            "NUM1": {
                              "block": {
                                "type": "variable",
                                "id": "~}GATxT6LX*7PF87~Ck2",
                                "fields": {
                                  "VAR_NAME": "x"
                                }
                              }
                            },
                            "NUM2": {
                              "block": {
                                "type": "math_number",
                                "id": "3o#|:]uh}{Jz)/S-V+@w",
                                "fields": {
                                  "NUM": 6
                                }
                              }
                            },
                            "MEMBERS": {
                              "block": {
                                "type": "for_loop",
                                "id": "5+f+Qo3Rr+~FGk?=wPZ?",
                                "inputs": {
                                  "LOOP_ITERATION_COUNT": {
                                    "block": {
                                      "type": "math_number",
                                      "id": "9kjr#mov:dOvwaiFDC@z",
                                      "fields": {
                                        "NUM": 3
                                      }
                                    }
                                  },
                                  "MEMBERS": {
                                    "block": {
                                      "type": "variable_set",
                                      "id": "P-}ImSa+L(Q}U)(7O8WL",
                                      "fields": {
                                        "VAR_NAME": "değişken_ismi"
                                      },
                                      "inputs": {
                                        "VALUE": {
                                          "block": {
                                            "type": "arithmetic",
                                            "id": "{Z4tOwUEeyzl2L(Wkjgz",
                                            "fields": {
                                              "DROPDOWN": "+"
                                            },
                                            "inputs": {
                                              "NUM1": {
                                                "block": {
                                                  "type": "variable",
                                                  "id": "o4nRR1F5LLaD(i+3-:k_",
                                                  "fields": {
                                                    "VAR_NAME": "x"
                                                  }
                                                }
                                              },
                                              "NUM2": {
                                                "block": {
                                                  "type": "math_number",
                                                  "id": "(kGKTzPq@*4[ke@V5:_y",
                                                  "fields": {
                                                    "NUM": 1
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      },
                      "MEMBERS2": {
                        "block": {
                          "type": "if_block",
                          "id": "vgZ[9.d!Lad(C0)LC}Pu",
                          "fields": {
                            "DROPDOWN": "=="
                          },
                          "inputs": {
                            "NUM1": {
                              "block": {
                                "type": "variable",
                                "id": "1vqZUU4VLUmCs4~c_3iq",
                                "fields": {
                                  "VAR_NAME": "x"
                                }
                              }
                            },
                            "NUM2": {
                              "block": {
                                "type": "math_number",
                                "id": "Nw{.{[WLkW=IK;R$@kv",
                                "fields": {
                                  "NUM": 9
                                }
                              }
                            },
                            "MEMBERS": {
                              "block": {
                                "type": "text_output",
                                "id": "3+37hrvrpUF+OvSBuR%",
                                "fields": {
                                  "OUTPUT_TEXT": "x = 9"
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    ]
  }
}
 `;

            const response = await fetch('http://localhost:5942/ask-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: fullPrompt }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            const data = await response.json();
            let generatedBlocklyCode = data.blocklyCode; // let ile değiştirdik

            // Yanıtı temizleme işlemi
            // Markdown kod bloğu işaretlerini (```json veya ```) kaldırıyoruz
            const jsonStart = generatedBlocklyCode.indexOf('{');
            const jsonEnd = generatedBlocklyCode.lastIndexOf('}');
            
            if (jsonStart !== -1 && jsonEnd !== -1) {
                generatedBlocklyCode = generatedBlocklyCode.substring(jsonStart, jsonEnd + 1);
            }

            try {
                const blocklyData = JSON.parse(generatedBlocklyCode);
                Blockly.Events.disable();
                Blockly.serialization.workspaces.load(blocklyData, ws, false);
                Blockly.Events.enable();
                updateCodeDisplay();
                codeDiv.innerText = "Yapay zeka kodunuzu bloklara dönüştürdü! Blokları oynatın ve kodu inceleyin!";
            } catch (jsonError) {
                console.error("Yapay zekadan gelen yanıt JSON formatında değil:", jsonError);
                //codeDiv.innerText = `Yapay zekadan gelen yanıt işlenemedi. Yanıt:\n${generatedBlocklyCode}`;
            }

        } catch (error) {
            console.error('Yapay zeka çağrısında bir hata oluştu:', error);
            codeDiv.innerText = `Yapay zeka çağrısında bir hata oluştu: ${error.message}. Konsolu kontrol edin.`;
        }
    });
}
});