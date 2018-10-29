Blockly.Msg["DOM_HUE"] = "30";

Blockly.Blocks['create_element'] = {
  init: function() {
    this.setOutput(true, 'Element');
    this.appendDummyInput().appendField('a new')
      .appendField(new Blockly.FieldTextInput('p'), 'TAG')
      .appendField('element');
    this.setColour(Blockly.Msg['DOM_HUE']);
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
    this.setColour(Blockly.Msg['DOM_HUE']);
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
    this.setColour(Blockly.Msg['DOM_HUE']);
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
    this.setColour(Blockly.Msg['DOM_HUE']);
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
      .appendField('append element');
    this
      .appendValueInput('PARENT').setCheck('Element')
      .appendField('to element');
    this.setColour(Blockly.Msg['DOM_HUE']);
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

Blockly.Blocks['remove_child_element'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this
      .appendValueInput('CHILD').setCheck(['Element', 'TextNode'])
      .appendField('remove element');
    this
      .appendValueInput('PARENT').setCheck('Element')
      .appendField('from element');
    this.setColour(Blockly.Msg['DOM_HUE']);
  }
};

Blockly.JavaScript['remove_child_element'] = function(block) {
  var parent = Blockly.JavaScript.valueToCode(
    block, 'PARENT',
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var child = Blockly.JavaScript.valueToCode(
    block, 'CHILD',
    Blockly.JavaScript.ORDER_ATOMIC
  );
  return parent + '.removeChild(' + child + ');\n';
};

Blockly.Blocks['remove_element'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this
    .appendValueInput('ELEMENT').setCheck(['Element', 'TextNode'])
    .appendField('remove element');
    this.setColour(Blockly.Msg['DOM_HUE']);
  }
};

Blockly.JavaScript['remove_element'] = function(block) {
  var parent = Blockly.JavaScript.valueToCode(
    block, 'ELEMENT',
    Blockly.JavaScript.ORDER_ATOMIC
  );
  return parent + '.remove();\n';
};

Blockly.Blocks['set_css_colour'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this
      .appendValueInput('ELEMENT').setCheck('Element')
      .appendField('set the')
      .appendField(new Blockly.FieldDropdown([
        ['background', 'backgroundColor'],
        ['color', 'color']
      ]), 'PROPERTY')
      .appendField('of element');
    this
      .appendValueInput('COLOUR').setCheck('Colour')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField('to');
    this.setColour(Blockly.Msg['DOM_HUE']);
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
      .appendValueInput('ELEMENT').setCheck('Element')
      .appendField('set the')
      .appendField(new Blockly.FieldDropdown([
        ['text', 'textContent'],
        ['html', 'innerHTML']
      ]), 'TYPE')
      .appendField('of element');
    this
      .appendValueInput('VALUE').setCheck('String')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField('to');
    this.setColour(Blockly.Msg['DOM_HUE']);
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
    this.setColour(Blockly.Msg['DOM_HUE']);
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
        .appendField("when element");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["is clicked","click"], ["is loaded","load"], ["has changed","change"], ["is focused", "focus"], ["is blured", "blur"], ["mouse enter","mouseenter"], ["mouse leave","mouseleave"], ["form is submitted","submit"]]), "TYPE");
    this.appendStatementInput("STACK")
        .setCheck(null)
        .appendField('do');
    this.setColour(Blockly.Msg['DOM_HUE']);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
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
  return target + '.addEventListener("' + block.getFieldValue('TYPE') + '", function() {\n' +
    branch + '});\n';
};

Blockly.Blocks['handle_mouse_move'] = {
  init: function() {
    this.appendValueInput("TARGET")
        .setCheck("Element")
        .appendField("when mouse moved on element");
    this.appendDummyInput()
        .appendField("with")
        .appendField(new Blockly.FieldVariable("x"), "x")
        .appendField(new Blockly.FieldVariable("y"), "y");
    this.appendStatementInput("STACK")
        .setCheck(null)
        .appendField('do');
    this.setColour(Blockly.Msg['DOM_HUE']);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
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
  return target + '.addEventListener("mousemove", function(e) {\n  ' +
    variable_x + ' = e.clientX;\n  ' +
    variable_y + ' = e.clientY;\n' +
    branch + '});\n';
};

Blockly.Blocks['handle_key_press'] = {
  init: function() {
    this.appendValueInput("TARGET")
        .setCheck("Element")
        .appendField("when key pressed on element");
    this.appendDummyInput()
        .appendField("with")
        .appendField(new Blockly.FieldVariable("key"), "key");
    this.appendStatementInput("STACK")
        .setCheck(null)
        .appendField('do');
    this.setColour(Blockly.Msg['DOM_HUE']);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
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
  return target + '.addEventListener("keypress", function(e) {\n  ' +
    variable_key + ' = e.key;\n' +
    branch + '});\n';
};

Blockly.Blocks['input_value'] = {
  init: function() {
    this.setOutput(true, 'String');
    this.appendValueInput('ELEMENT').setCheck('Element')
      .appendField('the input value of element');
    this.setColour(Blockly.Msg['DOM_HUE']);
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

Blockly.Blocks['console_log'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck(null)
        .appendField("console output");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(Blockly.Msg['DOM_HUE']);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['console_log'] = function(block) {
  return 'console.log(' + Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC) + ');\n';
};

Blockly.Blocks['set_html_attribute'] = {
  init: function() {
    this.appendValueInput("ELEMENT")
        .setCheck("Element")
        .appendField("set attribute")
        .appendField(new Blockly.FieldTextInput(""), "NAME")
        .appendField("of element");
    this.appendValueInput("VALUE")
        .setCheck("String")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("to");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(Blockly.Msg['DOM_HUE']);
  }
};

Blockly.JavaScript['set_html_attribute'] = function(block) {
  var element = Blockly.JavaScript.valueToCode(
    block, 'ELEMENT',
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var value = Blockly.JavaScript.valueToCode(
    block, 'VALUE',
    Blockly.JavaScript.ORDER_ATOMIC
  );
  return element + '.setAttribute("' + block.getFieldValue('NAME') + '", ' +
         value + ');\n';
};

Blockly.Blocks['get_html_attribute'] = {
  init: function() {
    this.appendValueInput("ELEMENT")
        .setCheck("Element")
        .appendField("get attribute")
        .appendField(new Blockly.FieldTextInput(""), "NAME")
        .appendField("of element");
    this.setOutput(true, null);
    this.setColour(Blockly.Msg['DOM_HUE']);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['get_html_attribute'] = function(block) {
  var element = Blockly.JavaScript.valueToCode(block, 'ELEMENT', Blockly.JavaScript.ORDER_ATOMIC);
  var code = element + '.getAttribute("' + block.getFieldValue('NAME') + '")';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['dom_queryselector'] = {
  init: function() {
    this.appendValueInput("ELEMENT")
        .setCheck("Element")
        .appendField("get")
        .appendField(new Blockly.FieldDropdown([["list","querySelectorAll"], ["first element","querySelector"]]), "TYPE")
        .appendField("from")
        .appendField(new Blockly.FieldTextInput("CSS selector"), "CSS")
        .appendField("starting on");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(Blockly.Msg['DOM_HUE']);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['dom_queryselector'] = function(block) {
  var type = block.getFieldValue('TYPE');
  var css = block.getFieldValue('CSS');
  var element = Blockly.JavaScript.valueToCode(block, 'ELEMENT', Blockly.JavaScript.ORDER_ATOMIC);
  var code = element + '.' + type + "('" + css + "')";
  if (type === "querySelectorAll") {
    code = `[...${code}]`;
  }
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['dom_toggle_class'] = {
  init: function() {
    this.appendValueInput("CLASS")
        .setCheck(null)
        .appendField("toggle class");
    this.appendValueInput("ELEMENT")
        .setCheck("Element")
        .appendField("on element");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(Blockly.Msg['DOM_HUE']);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['dom_toggle_class'] = function(block) {
  var value_class = Blockly.JavaScript.valueToCode(block, 'CLASS', Blockly.JavaScript.ORDER_ATOMIC);
  var element = Blockly.JavaScript.valueToCode(block, 'ELEMENT', Blockly.JavaScript.ORDER_ATOMIC);
  var code = element + '.classList.toggle(' + value_class + ');\n';
  return code;
};

Blockly.Blocks['get_json'] = {
  init: function() {
    this.appendValueInput('URL')
        .setCheck("String")
        .appendField('get JSON from');
    this.appendDummyInput()
        .appendField('into')
        .appendField(new Blockly.FieldVariable('json'), 'JSON');
    this.appendStatementInput('CALLBACK')
        .setCheck(null)
        .appendField('do');
    this.setPreviousStatement(true, null);
    this.setColour(Blockly.Msg['DOM_HUE']);
 this.setTooltip('');
 this.setHelpUrl('');
  }
};

Blockly.JavaScript['get_json'] = function(block) {
  var url = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ATOMIC);
  var json = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('JSON'), Blockly.Variables.NAME_TYPE);
  var callback = Blockly.JavaScript.statementToCode(block, 'CALLBACK');
  var code = 'fetch(' + url + ')\n.then(res => res.json())\n.then((' + json + ') => {\n' + callback + '});\n';
  return code;
};


Blockly.Msg["DICTS_HUE"] = "250";
Blockly.Msg["DICTS_CREATE_WITH_HELPURL"] = "";
Blockly.Msg["DICTS_CREATE_EMPTY_TITLE"] = "create empty dictionnary";
Blockly.Msg["DICTS_CREATE_WITH_CONTAINER_TITLE_ADD"] = "dictionnary";
Blockly.Msg["DICTS_CREATE_WITH_CONTAINER_TOOLTIP"] = "Add, remove, or reorder sections to reconfigure this dictionnary block.";
Blockly.Msg["DICTS_CREATE_WITH_INPUT_WITH"] = "create dictionnary with";
Blockly.Msg["DICTS_CREATE_WITH_ITEM_TOOLTIP"] = "Add a key/value to the dictionnary.";
Blockly.Msg["DICTS_CREATE_WITH_ITEM_TITLE"] = "key: value";
Blockly.Msg["DICTS_CREATE_WITH_TOOLTIP"] = "Create a dictionnary with any number of key/values.";

Blockly.Blocks['dicts_create_with'] = {
  /**
   * Block for creating a list with any number of elements of any type.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg['DICTS_CREATE_WITH_HELPURL']);
    this.setColour(Blockly.Msg['DICTS_HUE']);
    this.itemCount_ = 3;
    this.updateShape_();
    this.setOutput(true);
    this.setMutator(new Blockly.Mutator(['dicts_create_with_item']));
    this.setTooltip(Blockly.Msg['DICTS_CREATE_WITH_TOOLTIP']);
  },
  /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('dicts_create_with_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = workspace.newBlock('dicts_create_with_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    var connections = [];
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
    // Disconnect any children that don't belong.
    for (var i = 0; i < this.itemCount_; i++) {
      var connection = this.getInput('ADD' + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function() {
    if (this.itemCount_ && this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
      this.appendDummyInput('EMPTY')
          .appendField(Blockly.Msg['DICTS_CREATE_EMPTY_TITLE']);
    }
    if (this.itemCount_ && !this.getInput('WITH')) {
      this.appendDummyInput('WITH').appendField(Blockly.Msg['DICTS_CREATE_WITH_INPUT_WITH']);
    }
    if (this.itemCount_ === 0 && this.getInput('WITH')) {
      this.removeInput('WITH');
    }
    // Add new inputs.
    for (var i = 0; i < this.itemCount_; i++) {
      if (!this.getInput('ADD' + i)) {
        this.appendValueInput('ADD' + i)
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(new Blockly.FieldTextInput('key' + i), 'KEY' + i)
        .appendField(':');
      }
    }
    // Remove deleted inputs.
    while (this.getInput('ADD' + i)) {
      this.removeInput('ADD' + i);
      i++;
    }
  }
};

Blockly.Blocks['dicts_create_with_container'] = {
  /**
   * Mutator block for list container.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Msg['DICTS_HUE']);
    this.appendDummyInput()
        .appendField(Blockly.Msg['DICTS_CREATE_WITH_CONTAINER_TITLE_ADD']);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.Msg['DICTS_CREATE_WITH_CONTAINER_TOOLTIP']);
    this.contextMenu = false;
  }
};

Blockly.Blocks['dicts_create_with_item'] = {
  /**
   * Mutator block for adding items.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Msg['DICTS_HUE']);
    this.appendDummyInput()
        .appendField(Blockly.Msg['DICTS_CREATE_WITH_ITEM_TITLE']);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg['DICTS_CREATE_WITH_ITEM_TOOLTIP']);
    this.contextMenu = false;
  }
};

Blockly.JavaScript['dicts_create_with'] = function(block) {
  // Create a list with any number of elements of any type.
  var elements = new Array(block.itemCount_);
  for (var i = 0; i < block.itemCount_; i++) {
    elements[i] =  "'" + block.getFieldValue('KEY' + i) + "':" + Blockly.JavaScript.valueToCode(block, 'ADD' + i,
        Blockly.JavaScript.ORDER_COMMA) || 'null';
  }
  var code = '{' + elements.join(', ') + '}';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Blocks['dicts_set_item'] = {
  init: function() {
    this.setInputsInline(true);
    this.appendValueInput("DICT")
        .setCheck(null)
        .appendField("on dictionnary");
    this.appendValueInput("KEY")
        .setCheck(null)
        .appendField("set key");
    this.appendValueInput("VALUE")
        .setCheck(null)
        .appendField("as");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(Blockly.Msg['DICTS_HUE']);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['dicts_set_item'] = function(block) {
  var value_key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ATOMIC);
  var value_dict = Blockly.JavaScript.valueToCode(block, 'DICT', Blockly.JavaScript.ORDER_ATOMIC);
  var value_value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
  var code = value_dict + '[' + value_key + '] = ' + value_value + ';\n';
  return code;
};

Blockly.Blocks['dicts_get_item'] = {
  init: function() {
    this.appendValueInput("KEY")
        .setCheck(null)
        .appendField("get");
    this.appendValueInput("DICT")
        .setCheck(null)
        .appendField("from dictionnary");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(Blockly.Msg['DICTS_HUE']);
  this.setTooltip("");
  this.setHelpUrl("");
  }
};

Blockly.JavaScript['dicts_get_item'] = function(block) {
  var key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ATOMIC);
  var dict = Blockly.JavaScript.valueToCode(block, 'DICT', Blockly.JavaScript.ORDER_ATOMIC);
  var code = dict + '[' + key + ']';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Blocks['dicts_controls_foreach'] = {
  init: function() {
    this.appendValueInput("DICT")
        .setCheck(null)
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("for each")
        .appendField(new Blockly.FieldVariable("key"), "KEY")
        .appendField(":")
        .appendField(new Blockly.FieldVariable("value"), "VALUE")
        .appendField("in dictionnary");
    this.appendStatementInput("STACK")
        .setCheck(null)
        .appendField("do");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(Blockly.Msg['LOOPS_HUE']);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['dicts_controls_foreach'] = function(block) {
  var variable_key = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('KEY'), Blockly.Variables.NAME_TYPE);
  var variable_value = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VALUE'), Blockly.Variables.NAME_TYPE);
  var value_dict = Blockly.JavaScript.valueToCode(block, 'DICT', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_stack = Blockly.JavaScript.statementToCode(block, 'STACK');
  var code = 'for (' + variable_key + ' in ' + value_dict + ') {\n' +
  '  var ' + variable_value + ' = ' + value_dict + '['+ variable_key +'];\n' + statements_stack + '}\n';
  return code;
};

Blockly.Blocks['dicts_has_key'] = {
  init: function() {
    this.appendValueInput("DICT")
        .setCheck(null);
    this.appendValueInput("KEY")
        .setCheck("String")
        .appendField("has key");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(Blockly.Msg['DICTS_HUE']);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['dicts_has_key'] = function(block) {
  var dict = Blockly.JavaScript.valueToCode(block, 'DICT', Blockly.JavaScript.ORDER_ATOMIC);
  var key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ATOMIC);
  var code = dict + '.hasOwnProperty(' + key + ')';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Blocks['dicts_to_list'] = {
  init: function() {
    this.appendValueInput("DICT")
        .setCheck(null)
        .appendField("make list of ")
        .appendField(new Blockly.FieldDropdown([["keys","keys"], ["values","values"]]), "TYPE")
        .appendField("from");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(Blockly.Msg['DICTS_HUE']);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['dicts_to_list'] = function(block) {
  var type = block.getFieldValue('TYPE');
  var dict = Blockly.JavaScript.valueToCode(block, 'DICT', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'Object.' + type + '(' + dict + ')';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Blocks['math_to_number'] = {
  init: function() {
    this.appendValueInput("VALUE")
        .setCheck(null)
        .appendField("Number from");
    this.setOutput(true, null);
    this.setColour(Blockly.Msg['MATH_HUE']);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['math_to_number'] = function(block) {
  var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'Number(' + value + ')';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
