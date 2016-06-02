var _ = require('lodash');
var toEstreeJSON = require('./toEstreeJSON');
var toEstreeObject = require('./toEstreeObject');
var toEstreeFnCtxCallback = require('./toEstreeFnCtxCallback');

var estCTXEventProp = function(prop){
  return {
    "type": "MemberExpression",
    "computed": false,
    "object": {
      "type": "MemberExpression",
      "computed": false,
      "object": {
        "type": "Identifier",
        "name": "ctx"
      },
      "property": {
        "type": "Identifier",
        "name": "event"
      }
    },
    "property": {
      "type": "Identifier",
      "name": prop
    }
  };
};

var estTriEq = function(left, right){
  return {
    "type": "BinaryExpression",
    "operator": "===",
    "left": left,
    "right": right
  };
};

var estString = function(str){
  return {
    "type": "Literal",
    "value": str,
    "raw": JSON.stringify(str)
  };
};

var estAnd = function(left, right){
  return {
    "type": "LogicalExpression",
    "operator": "&&",
    "left": left,
    "right": right
  };
};

var eventExprToEstree = function(expr){
  var fn_body = [];
  fn_body.push({
    'type': 'ExpressionStatement',
    'expression': {
      'type': 'CallExpression',
      'callee': {
        'type': 'Identifier',
        'name': 'callback'
      },
      'arguments': [
        {
          "type": "Identifier",
          "name": "undefined"
        },
        estAnd(
          estTriEq(estCTXEventProp('domain'), estString('echo')),
          estTriEq(estCTXEventProp('type'), estString('hello'))
        )
      ]
    }
  });
  return toEstreeFnCtxCallback(fn_body);
};

module.exports = function(ast){
  if(ast.type !== 'select_when'){
    throw new Error('Unexpected select type: ' + ast.type);
  }

  var exprs_array = [];
  //TODO recurse through the expressions
  ast = ast.event_expressions;

  if(ast.type !== 'event_expression'){
    throw new Error('Unexpected event expression type: ' + ast.type);
  }

  exprs_array.push({
    domain: ast.event_domain.src,
    type: ast.event_type.src
    //TODO regex, capture, read vars etc...
  });

  var graph = {};
  var eventexprs = {};
  var state_machine = {start: []};
  _.each(exprs_array, function(expr, i){
    var id = 'expr_' + i;
    _.set(graph, [expr.domain, expr.type, id], true);
    eventexprs[id] = eventExprToEstree(expr);

    state_machine.start.push([id, 'end']);
    state_machine.start.push([['not', id], 'start']);
  });

  return toEstreeObject({
    graph: toEstreeJSON(graph),
    eventexprs: toEstreeObject(eventexprs),
    state_machine: toEstreeJSON(state_machine)
  });
};
