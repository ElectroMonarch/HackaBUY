export const toolbox = {
  kind: 'categoryToolbox',
  contents: [{
      kind: 'category',
      name: 'Yazdır',
      categorystyle: "text_category",
      contents: [
      {
        kind: 'block',
        type: 'number_output',
      },
      {
        kind: 'block',
        type: 'text_output',
      },
    ],
  },
  {
    kind: 'category',
    name: 'Sayılar',
    categorystyle: "math_category",
    contents: [
      {
        kind: 'block',
        type: 'math_number',
      },
      {
        kind: 'block',
        type: 'arithmetic'
      },
    ]},
  {
    kind: 'category',
    name: 'Değişkenler',
    categorystyle: "variable_category",
    contents: [{
        kind: 'block',
        type: 'variable',
      },
      {
        kind: 'block',
        type: 'variable_set',
      },
    ]},
  {
    kind: 'category',
    name: 'Karar Yapıları',
    categorystyle: "colour_category",
    contents: [
      {
        kind: 'block', 
        type: 'if_block',
      },
      {
        kind: 'block', 
        type: 'if_else_block',
      },
    ]},
  {
    kind: 'category',
    name: 'Döngüler',
    categorystyle: "procedure_category",
    contents: [
      {
        kind: 'block',
        type: 'for_loop',
      },
      {
        kind: 'block', 
        type: 'while_block',
      },
      {
        kind: 'block', 
        type: 'break_block',
      },
    ]},
  ],
};
