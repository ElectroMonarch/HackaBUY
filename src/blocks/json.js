/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview All the custom JSON-related blocks defined in the custom
 * generator codelab.
 */

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
        [ "*", "*" ],
        [ "/", "/" ],
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
    type: 'object',
    message0: '{ %1 %2 }',
    args0: [
      {
        type: 'input_dummy',
      },
      {
        type: 'input_statement',
        name: 'MEMBERS',
      },
    ],
    output: null,
    colour: 230,
  },
  {
    type: 'member',
    message0: '%1 %2 %3',
    args0: [
      {
        type: 'field_input',
        name: 'MEMBER_NAME',
        text: '',
      },
      {
        type: 'field_label',
        name: 'COLON',
        text: 'ığüşçö',
      },
      {
        type: 'input_value',
        name: 'MEMBER_VALUE',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
  },
]);
