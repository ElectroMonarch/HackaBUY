import * as Blockly from 'blockly';

export const pythonGenerator = new Blockly.Generator('JSON');

const Order = {
  ATOMIC: 0,
};

const variable_names_set = new Set([]);
let alphabet = "ijklmnopqrstuvwxyzabcdefgh";

pythonGenerator.scrub_ = function (block, code, thisOnly) {
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  if (nextBlock && !thisOnly) {
    return code + '\n' + pythonGenerator.blockToCode(nextBlock);
  }
  return code;
};

pythonGenerator.clear_names_set = function(){
  variable_names_set.clear();
}

pythonGenerator.forBlock['math_number'] = function (block) {
  const code = String(block.getFieldValue('NUM'));
  return [code, Order.ATOMIC];
};

pythonGenerator.forBlock['logic_boolean'] = function (block) {
  const code = block.getFieldValue('BOOL') == 'TRUE' ? 'true' : 'false';
  return [code, Order.ATOMIC];
};

pythonGenerator.forBlock['text_output'] = function (block, generator) {
  let text = String(block.getFieldValue('OUTPUT_TEXT'));
  // " ve ' kontrolü
  for (let c of ["\\","\"","\'"]){
    let newText = text.replaceAll(c, '\\' + c);
    text = newText;
  }
  const code = `print("${text}")`;
  return code;
};

pythonGenerator.forBlock['number_output'] = function (block, generator) {
  const value = generator.valueToCode(block, 'MEMBER_VALUE', Order.ATOMIC);
  const code = `print(${value})`;
  return code;
};


pythonGenerator.forBlock['for_loop'] = function (block, generator) {
  const count = generator.valueToCode(block, 'LOOP_ITERATION_COUNT', Order.ATOMIC);
  const statementMembers = generator.statementToCode(block, 'MEMBERS');

  //döngü değişkeni için kullanılmamış isim bulma
  let donguDegiskeni = 'i';
  for (let i = 0; ; i++){
    if (!variable_names_set.has(alphabet[i])){
      donguDegiskeni = alphabet[i];
      break;
    }
  }
  variable_names_set.add(donguDegiskeni);
  const code = 'for ' + donguDegiskeni + ' in range(' + count + '):\n' + statementMembers + '\n';
  return code;
};

pythonGenerator.forBlock['variable'] = function (block) {
  const code = String(block.getFieldValue('VAR_NAME'));
  variable_names_set.add(code);
  return [code, Order.ATOMIC];
};

pythonGenerator.forBlock['arithmetic'] = function (block, generator) {
  const op = String(block.getFieldValue('DROPDOWN'));
  const n1 = generator.valueToCode(block, 'NUM1', Order.ATOMIC);
  const n2 = generator.valueToCode(block, 'NUM2', Order.ATOMIC);
  const code = "(" + n1 + " " + op + " " + n2 + ")";
  return [code, Order.ATOMIC];
};

pythonGenerator.forBlock['variable_set'] = function (block, generator) {
  const varName = block.getFieldValue('VAR_NAME');
  const value = generator.valueToCode(block, 'VALUE', Order.ATOMIC);
  const code = `${varName} = ${value}`;
  variable_names_set.add(varName);
  return code;
}

pythonGenerator.forBlock['if_block'] = function (block, generator) {
  const op = String(block.getFieldValue('DROPDOWN'));
  const n1 = generator.valueToCode(block, 'NUM1', Order.ATOMIC);
  const n2 = generator.valueToCode(block, 'NUM2', Order.ATOMIC);
  const line = `if ${n1} ${op} ${n2}`
  const statementMembers = generator.statementToCode(block, 'MEMBERS');
  const code = line + ':\n' + statementMembers + '\n';
  return code;
};

pythonGenerator.forBlock['if_else_block'] = function (block, generator) {
  const op = String(block.getFieldValue('DROPDOWN'));
  const n1 = generator.valueToCode(block, 'NUM1', Order.ATOMIC);
  const n2 = generator.valueToCode(block, 'NUM2', Order.ATOMIC);
  const line = `if ${n1} ${op} ${n2}`
  const statementMembers = generator.statementToCode(block, 'MEMBERS');
  const statementMembers2 = generator.statementToCode(block, 'MEMBERS2');
  const code = line + ':\n' + statementMembers + '\nelse:\n' + statementMembers2;
  return code;
};

pythonGenerator.forBlock['while_block'] = function (block, generator) {
  const op = String(block.getFieldValue('DROPDOWN'));
  const n1 = generator.valueToCode(block, 'NUM1', Order.ATOMIC);
  const n2 = generator.valueToCode(block, 'NUM2', Order.ATOMIC);
  const line = `while ${n1} ${op} ${n2}`
  const statementMembers = generator.statementToCode(block, 'MEMBERS');
  const code = line + ':\n' + statementMembers;
  return code;
};

pythonGenerator.forBlock['break_block'] = function (block) {
  return "break";
};
