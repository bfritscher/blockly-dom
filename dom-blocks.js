Blockly.Blocks['create_element'] = {
  init: function() {
    this.setOutput(true, 'Element');
    this.appendDummyInput().appendField('a new')
      .appendField(new Blockly.FieldTextInput("p"), "TAG")
      .appendField('element');
  }
};

Blockly.JavaScript['create_element'] = function(block) {
  return [
    "document.createElement(" +
    Blockly.JavaScript.quote_(block.getFieldValue('TAG')) + ")",
    Blockly.JavaScript.ORDER_ATOMIC
  ];
};

Blockly.Blocks['query_selector'] = {
  SELECTORS: ['body'],
  init: function() {
    var selectors = this.SELECTORS.map(function(sel) {
      return [sel, sel];
    });

    this.setOutput(true, 'Element');
    this.appendDummyInput().appendField('the')
      .appendField(new Blockly.FieldDropdown(selectors), 'SELECTOR')
      .appendField('element');
  }
};

Blockly.JavaScript['query_selector'] = function(block) {
  return [
    "document.querySelector(" +
    Blockly.JavaScript.quote_(block.getFieldValue('SELECTOR')) + ")",
    Blockly.JavaScript.ORDER_ATOMIC
  ];
};

Blockly.Blocks['get_element_by_id'] = {
  init: function() {
    this.setOutput(true, 'Element');
    this.appendDummyInput().appendField('the element with id')
      .appendField(new Blockly.FieldTextInput('foo'), 'ID');
  }
};

Blockly.JavaScript['get_element_by_id'] = function(block) {
  return [
    "document.getElementById(" +
    Blockly.JavaScript.quote_(block.getFieldValue('ID')) + ")",
    Blockly.JavaScript.ORDER_ATOMIC
  ];
};

Blockly.Blocks['body_element'] = {
  init: function() {
    this.setOutput(true, 'Element');
    this.appendDummyInput().appendField('the <body> element');
  }
};

Blockly.JavaScript['body_element'] = function(block) {
  return [
    "document.body",
    Blockly.JavaScript.ORDER_ATOMIC
  ];
};

Blockly.Blocks['append_element'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this
      .appendValueInput('CHILD').setCheck(['Element', 'TextNode'])
      .appendField('append');
    this
      .appendValueInput('PARENT').setCheck('Element')
      .appendField('to');
  }
};

Blockly.JavaScript['append_element'] = function(block) {
  var parent = Blockly.JavaScript.valueToCode(
    block, 'PARENT',
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var child = Blockly.JavaScript.valueToCode(
    block, 'CHILD',
    Blockly.JavaScript.ORDER_ATOMIC
  );
  return parent + '.appendChild(' + child + ');\n';
};

Blockly.Blocks['set_css_colour'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this
      .appendDummyInput().appendField('set the')
      .appendField(new Blockly.FieldDropdown([
        ['background', 'backgroundColor'],
        ['color', 'color']
      ]), 'PROPERTY');
    this
      .appendValueInput('ELEMENT').setCheck('Element')
      .appendField('of');
    this
      .appendValueInput('COLOUR').setCheck('Colour')
      .appendField('to');
  }
};

Blockly.JavaScript['set_css_colour'] = function(block) {
  var element = Blockly.JavaScript.valueToCode(
    block, 'ELEMENT',
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var colour = Blockly.JavaScript.valueToCode(
    block, 'COLOUR',
    Blockly.JavaScript.ORDER_ATOMIC
  );
  return element + '.style.' + block.getFieldValue('PROPERTY') + ' = ' +
         colour + ';\n';
};

Blockly.Blocks['set_content'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this
      .appendDummyInput().appendField('set the')
      .appendField(new Blockly.FieldDropdown([
        ['text', 'textContent'],
        ['html', 'innerHTML']
      ]), 'TYPE');
    this
      .appendValueInput('ELEMENT').setCheck('Element')
      .appendField('of');
    this
      .appendValueInput('VALUE').setCheck('String')
      .appendField('to');
  }
};

Blockly.JavaScript['set_content'] = function(block) {
  var element = Blockly.JavaScript.valueToCode(
    block, 'ELEMENT',
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var value = Blockly.JavaScript.valueToCode(
    block, 'VALUE',
    Blockly.JavaScript.ORDER_ATOMIC
  );
  return element + '.' + block.getFieldValue('TYPE') + ' = ' +
         value + ';\n';
};

Blockly.Blocks['text_node'] = {
  init: function() {
    this.appendValueInput('TEXT').setCheck('String')
      .appendField('a new text node with');
    this.setOutput(true, 'TextNode');
  }
};

Blockly.JavaScript['text_node'] = function(block) {
  return [
    'document.createTextNode(' + Blockly.JavaScript.valueToCode(
      block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC
    ) + ')',
    Blockly.JavaScript.ORDER_ATOMIC
  ];
};

Blockly.Blocks['handle_event'] = {
  init: function() {
    this.appendValueInput("TARGET")
        .setCheck("Element")
        .appendField("when");
    this.appendStatementInput("STACK")
        .setCheck(null)
        .appendField(new Blockly.FieldDropdown([["is clicked","click"], ["is loaded","load"], ["has changed","change"], ["mouse enter","mouseenter"], ["mouse leave","mouseleave"], ["form is submitted","submit"]]), "TYPE");
    this.setColour(30);
  }
};

Blockly.JavaScript['handle_event'] = function(block) {
  var target = Blockly.JavaScript.valueToCode(
    block, 'TARGET',
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var branch = Blockly.JavaScript.statementToCode(block, 'STACK');
  if (Blockly.JavaScript.STATEMENT_PREFIX) {
    branch = Blockly.JavaScript.prefixLines(
        Blockly.JavaScript.STATEMENT_PREFIX.replace(/%1/g,
        '\'' + block.id + '\''), Blockly.JavaScript.INDENT) + branch;
  }
  if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
    branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }
  return [
    target + '.addEventListener("' + block.getFieldValue('TYPE') + '", function() {\n' +
    branch + '});\n'
  ];
};

Blockly.Blocks['handle_mouse_move'] = {
  init: function() {
    this.appendValueInput("TARGET")
        .setCheck("Element")
        .appendField("when mouse moved on");
    this.appendDummyInput()
        .appendField("with")
        .appendField(new Blockly.FieldVariable("x"), "x")
        .appendField(new Blockly.FieldVariable("y"), "y");
    this.appendStatementInput("STACK")
        .setCheck(null);
    this.setColour(30);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['handle_mouse_move'] = function(block) {
  var target = Blockly.JavaScript.valueToCode(
    block, 'TARGET',
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var variable_x = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('x'), Blockly.Variables.NAME_TYPE);
  var variable_y = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('y'), Blockly.Variables.NAME_TYPE);
  var branch = Blockly.JavaScript.statementToCode(block, 'STACK');
  if (Blockly.JavaScript.STATEMENT_PREFIX) {
    branch = Blockly.JavaScript.prefixLines(
        Blockly.JavaScript.STATEMENT_PREFIX.replace(/%1/g,
        '\'' + block.id + '\''), Blockly.JavaScript.INDENT) + branch;
  }
  if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
    branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }
  return [
    target + '.addEventListener("mousemove", function(e) {\n  ' +
    variable_x + ' = e.clientX;\n  ' +
    variable_y + ' = e.clientY;\n' +
    branch + '});\n'
  ];
};

Blockly.Blocks['handle_key_press'] = {
  init: function() {
    this.appendValueInput("TARGET")
        .setCheck("Element")
        .appendField("when key pressed on");
    this.appendDummyInput()
        .appendField("with")
        .appendField(new Blockly.FieldVariable("key"), "key");
    this.appendStatementInput("STACK")
        .setCheck(null);
    this.setColour(30);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['handle_key_press'] = function(block) {
  var target = Blockly.JavaScript.valueToCode(
    block, 'TARGET',
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var variable_key = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('key'), Blockly.Variables.NAME_TYPE);
  var branch = Blockly.JavaScript.statementToCode(block, 'STACK');
  if (Blockly.JavaScript.STATEMENT_PREFIX) {
    branch = Blockly.JavaScript.prefixLines(
        Blockly.JavaScript.STATEMENT_PREFIX.replace(/%1/g,
        '\'' + block.id + '\''), Blockly.JavaScript.INDENT) + branch;
  }
  if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
    branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }
  return [
    target + '.addEventListener("keypress", function(e) {\n  ' +
    variable_key + ' = e.key;\n' +
    branch + '});\n'
  ];
};

Blockly.Blocks['input_value'] = {
  init: function() {
    this.setOutput(true, 'String');
    this.appendValueInput('ELEMENT').setCheck('Element')
      .appendField('the input value of');
  }
};

Blockly.JavaScript['input_value'] = function(block) {
  return [
    Blockly.JavaScript.valueToCode(
      block, 'ELEMENT', Blockly.JavaScript.ORDER_ATOMIC
    ) + '.value',
    Blockly.JavaScript.ORDER_ATOMIC
  ];
};

Blockly.Blocks['wait'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("wait")
        .appendField(new Blockly.FieldNumber(1, 0, 5), "TIME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("wait");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['wait'] = function(block) {
  var wait = Blockly.JavaScript.provideFunction_(
    'wait',
    [ 'function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(time) {',
      '  return new Promise(resolve => setTimeout(resolve, time));',
      '}']);
  var number_time = block.getFieldValue('TIME');
  return 'await wait(' + number_time * 1000 + ');\n';
};
