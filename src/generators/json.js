import * as Blockly from 'blockly';

export const jsonGenerator = new Blockly.Generator('JSON');

const Order = {
  ATOMIC: 0,
};

jsonGenerator.scrub_ = function (block, code, thisOnly) {
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  if (nextBlock && !thisOnly) {
    return code + '\n' + jsonGenerator.blockToCode(nextBlock);
  }
  return code;
};

jsonGenerator.forBlock['math_number'] = function (block) {
  const code = String(block.getFieldValue('NUM'));
  return [code, Order.ATOMIC];
};

jsonGenerator.forBlock['logic_boolean'] = function (block) {
  const code = block.getFieldValue('BOOL') == 'TRUE' ? 'true' : 'false';
  return [code, Order.ATOMIC];
};

jsonGenerator.forBlock['text_output'] = function (block, generator) {
  const text = String(block.getFieldValue('OUTPUT_TEXT'));
  const code = `print "${text}"`;
  return code;
};

jsonGenerator.forBlock['number_output'] = function (block, generator) {
  const value = generator.valueToCode(block, 'MEMBER_VALUE', Order.ATOMIC);
  const code = `print ${value}`;
  return code;
};

jsonGenerator.forBlock['for_loop'] = function (block, generator) {
  const count = generator.valueToCode(block, 'LOOP_ITERATION_COUNT', Order.ATOMIC);
  const statementMembers = generator.statementToCode(block, 'MEMBERS');
  const code = 'for i in range(' + count + '):\n' + statementMembers + '\n';
  return code;
};

jsonGenerator.forBlock['variable'] = function (block) {
  const code = String(block.getFieldValue('VAR_NAME'));
  return [code, Order.ATOMIC];
};

jsonGenerator.forBlock['arithmetic'] = function (block, generator) {
  const op = String(block.getFieldValue('DROPDOWN'));
  const n1 = generator.valueToCode(block, 'NUM1', Order.ATOMIC);
  const n2 = generator.valueToCode(block, 'NUM2', Order.ATOMIC);
  const code = "(" + n1 + " " + op + " " + n2 + ")";
  return [code, Order.ATOMIC];
};

jsonGenerator.forBlock['variable_set'] = function (block, generator) {
  const varName = block.getFieldValue('VAR_NAME');
  const value = generator.valueToCode(block, 'VALUE', Order.ATOMIC);
  const code = `${varName} = ${value}`;
  return code;
}

jsonGenerator.forBlock['if_block'] = function (block, generator) {
  const op = String(block.getFieldValue('DROPDOWN'));
  const n1 = generator.valueToCode(block, 'NUM1', Order.ATOMIC);
  const n2 = generator.valueToCode(block, 'NUM2', Order.ATOMIC);
  const line = `if ${n1} ${op} ${n2}`
  const statementMembers = generator.statementToCode(block, 'MEMBERS');
  const code = line + ':\n' + statementMembers + '\n';
  return code;
};

jsonGenerator.forBlock['if_else_block'] = function (block, generator) {
  const op = String(block.getFieldValue('DROPDOWN'));
  const n1 = generator.valueToCode(block, 'NUM1', Order.ATOMIC);
  const n2 = generator.valueToCode(block, 'NUM2', Order.ATOMIC);
  const line = `if ${n1} ${op} ${n2}`
  const statementMembers = generator.statementToCode(block, 'MEMBERS');
  const statementMembers2 = generator.statementToCode(block, 'MEMBERS2');
  const code = line + ':\n' + statementMembers + '\nelse\n' + statementMembers2;
  return code;
};

jsonGenerator.forBlock['while_block'] = function (block, generator) {
  const op = String(block.getFieldValue('DROPDOWN'));
  const n1 = generator.valueToCode(block, 'NUM1', Order.ATOMIC);
  const n2 = generator.valueToCode(block, 'NUM2', Order.ATOMIC);
  const line = `while ${n1} ${op} ${n2}`
  const statementMembers = generator.statementToCode(block, 'MEMBERS');
  const code = line + ':\n' + statementMembers + '\n';
  return code;
};


