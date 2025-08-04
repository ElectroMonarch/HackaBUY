import * as Blockly from 'blockly';

export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  {
    type: 'number_output',
    message0: '%1 %2',
    args0: [
      {
        type: 'field_label',
        name: 'NUMBER_OUTPUT_LABEL',
        text: 'Sayıyı yazdır:',
      },
      {
        type: 'input_value',
        name: 'MEMBER_VALUE',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 180,
  },
  {
    type: 'text_output',
    message0: '%1 %2',
    args0: [
      {
        type: 'field_label',
        name: 'TEXT_OUTPUT_LABEL',
        text: 'Yazı yazdır:',
      },
      {
        type: 'field_input',
        name: 'OUTPUT_TEXT',
        text: '',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 180,
  },
  {
    type: 'for_loop',
    message0: 'Tekrarla: %1 %2 %3',
    args0: [
      {
        type: 'input_value',
        name: 'LOOP_ITERATION_COUNT',
      },
      {
        type: 'input_dummy',
      },
      {
        type: 'input_statement',
        name: 'MEMBERS',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
  },
  {
    type: 'variable_set',
    message0: '%1 değişkeninin değerini %2 olarak ayarla',
    args0: [
      {
        type: 'field_input',
        name: 'VAR_NAME',
        text: 'değişken_ismi',
      },
      {
        type: 'input_value',
        name: 'VALUE',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 0,
  },
  {
    type: 'math_number',
    message0: '%1',
    args0: [
      {
        type: 'field_number',
        name: 'NUM',
        value: 0,
      },
    ],
    output: null,
    colour: 230,
  },
  {
    type: 'variable',
    message0: '%1',
    args0: [
      {
        type: 'field_input',
        name: 'VAR_NAME',
      },
    ],
    output: null,
    colour: 0,
  },
  {
    type: 'arithmetic',
    message0: '%1 %2 %3 %4',
    args0: [
      {
        type: 'input_value',
        name: 'NUM1',
      },
      {
        type: 'field_dropdown',
        name: 'DROPDOWN',
        options: [
        [ "+", "+" ],
        [ "-", "-" ],
        [ "x", "*" ],
        [ "/", "/" ],
        [ "%", "%" ],
        ]
      },
      {
        type: 'input_value',
        name: 'NUM2',
      },
      {
        type: 'input_dummy',
      },
    ],
    output: null,
    colour: 0,
  },
  {
    type: 'if_block',
    message0: 'Eğer %1 %2 %3 ise %4 %5',
    args0: [
      {
        type: 'input_value',
        name: 'NUM1',
      },
      {
        type: 'field_dropdown',
        name: 'DROPDOWN',
        options: [
        [ "==", "==" ],
        [ ">=", ">=" ],
        [ "<=", "<=" ],
        [ ">", ">" ],
        [ "<", "<" ],
        ],
      },
      {
        type: 'input_value',
        name: 'NUM2',
      },
      {
        type: 'input_dummy',
      },
      {
        type: 'input_statement',
        name: 'MEMBERS',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
  },
  {
    type: 'if_else_block',
    message0: 'Eğer %1 %2 %3 ise %4 %5 değilse %6 %7',
    args0: [
      {
        type: 'input_value',
        name: 'NUM1',
      },
      {
        type: 'field_dropdown',
        name: 'DROPDOWN',
        options: [
        [ "==", "==" ],
        [ ">=", ">=" ],
        [ "<=", "<=" ],
        [ ">", ">" ],
        [ "<", "<" ],
        ],
      },
      {
        type: 'input_value',
        name: 'NUM2',
      },
      {
        type: 'input_dummy',
      },
      {
        type: 'input_statement',
        name: 'MEMBERS',
      },
      {
        type: 'input_dummy',
      },
      {
        type: 'input_statement',
        name: 'MEMBERS2',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
  },
  {
    type: 'while_block',
    message0: '%1 %2 %3 olduğu sürece tekrarla %4 %5',
    args0: [
      {
        type: 'input_value',
        name: 'NUM1',
      },
      {
        type: 'field_dropdown',
        name: 'DROPDOWN',
        options: [
        [ "==", "==" ],
        [ ">=", ">=" ],
        [ "<=", "<=" ],
        [ ">", ">" ],
        [ "<", "<" ],
        ],
      },
      {
        type: 'input_value',
        name: 'NUM2',
      },
      {
        type: 'input_dummy',
      },
      {
        type: 'input_statement',
        name: 'MEMBERS',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
  },
  {
    type: 'break_block',
    message0: '%1',
    args0: [
      {
        type: 'field_label',
        name: 'TEXT_OUTPUT_LABEL',
        text: 'Döngüyü sonlandır',
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 180,
  },
  
]);
