/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview The full custom JSON generator built during the custom
 * generator codelab.
 */

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

jsonGenerator.forBlock['logic_null'] = function (block) {
  return ['null', Order.ATOMIC];
};

jsonGenerator.forBlock['text'] = function (block) {
  const textValue = block.getFieldValue('TEXT');
  const code = `"${textValue}"`;
  return [code, Order.ATOMIC];
};

jsonGenerator.forBlock['math_number'] = function (block) {
  const code = String(block.getFieldValue('NUM'));
  return [code, Order.ATOMIC];
};

jsonGenerator.forBlock['logic_boolean'] = function (block) {
  const code = block.getFieldValue('BOOL') == 'TRUE' ? 'true' : 'false';
  return [code, Order.ATOMIC];
};

jsonGenerator.forBlock['member'] = function (block, generator) {
  const name = block.getFieldValue('MEMBER_NAME');
  const value = generator.valueToCode(block, 'MEMBER_VALUE', Order.ATOMIC);
  const code = `"${name}" zort : ${value}`;
  return code;
};

jsonGenerator.forBlock['lists_create_with'] = function (block, generator) {
  const values = [];
  for (let i = 0; i < block.itemCount_; i++) {
    const valueCode = generator.valueToCode(block, 'ADD' + i, Order.ATOMIC);
    if (valueCode) {
      values.push(valueCode);
    }
  }
  const valueString = values.join(',\n');
  const indentedValueString = generator.prefixLines(
    valueString,
    generator.INDENT,
  );
  const codeString = '[\n' + indentedValueString + '\n]';
  return [codeString, Order.ATOMIC];
};

jsonGenerator.forBlock['object'] = function (block, generator) {
  const statementMembers = generator.statementToCode(block, 'MEMBERS');
  const code = '{\n' + statementMembers + '\n}';
  return [code, Order.ATOMIC];
};

jsonGenerator.forBlock['text_output'] = function (block, generator) {
  const text = String(block.getFieldValue('OUTPUT_TEXT'));
  const code = `print ${text}`;
  return code;
};

jsonGenerator.forBlock['number_output'] = function (block, generator) {
  const value = generator.valueToCode(block, 'MEMBER_VALUE', Order.ATOMIC);
  const code = `print number ${value}`;
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
  const code = n1 + " " + op + " " + n2;
  return [code, Order.ATOMIC];
};

jsonGenerator.forBlock['variable_set'] = function (block, generator) {
  const varName = block.getFieldValue('VAR_NAME');
  const value = generator.valueToCode(block, 'VALUE', Order.ATOMIC);
  const code = `${varName} = ${value}`;
  return code;
}

jsonGenerator.forBlock['arithmetic_comparison'] = function (block, generator) {
  const op = String(block.getFieldValue('DROPDOWN'));
  const n1 = generator.valueToCode(block, 'NUM1', Order.ATOMIC);
  const n2 = generator.valueToCode(block, 'NUM2', Order.ATOMIC);
  const code = n1 + " " + op + " " + n2;
  return [code, Order.ATOMIC];
};

jsonGenerator.forBlock['if_else'] = function (block, generator) {
  const condition = generator.valueToCode(block, 'CONDITION', Order.ATOMIC);
  const ifBranch = generator.statementToCode(block, 'IF_BRANCH');
  const elseBranch = generator.statementToCode(block, 'ELSE_BRANCH');
  
  let code = `if ${condition}:\n${ifBranch}`;
  if (elseBranch) {
    code += `else:\n${elseBranch}`;
  }
  return code;
}

