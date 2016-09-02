module.exports = {
  "rid": "io.picolabs.module-used",
  "meta": { "use": undefined },
  "rules": {
    "say_hello": {
      "name": "say_hello",
      "select": {
        "graph": { "module_used": { "say_hello": { "expr_0": true } } },
        "eventexprs": {
          "expr_0": function (ctx) {
            var matches = [];
            ctx.scope.set("my_name", matches[0]);
            return true;
          }
        },
        "state_machine": {
          "start": [
            [
              "expr_0",
              "end"
            ],
            [
              [
                "not",
                "expr_0"
              ],
              "start"
            ]
          ]
        }
      },
      "action_block": {
        "actions": [{
            "action": function (ctx) {
              return {
                "type": "directive",
                "name": "say_hello",
                "options": { "something": ctx.scope.get("hello")(ctx, [ctx.scope.get("name")]) }
              };
            }
          }]
      }
    }
  }
};