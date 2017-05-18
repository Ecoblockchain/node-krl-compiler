module.exports = {
  "rid": "io.picolabs.defaction",
  "meta": {
    "shares": [
      "getSettingVal",
      "add"
    ]
  },
  "global": function* (ctx) {
    ctx.defaction(ctx, "foo", function* (ctx, getArg) {
      ctx.scope.set("a", getArg("a", 0));
      ctx.scope.set("b", 2);
      return {
        "actions": [{
            "action": function* (ctx) {
              return {
                "type": "directive",
                "name": "foo",
                "options": {
                  "a": ctx.scope.get("a"),
                  "b": yield ctx.callKRLstdlib("+", ctx.scope.get("b"), 3)
                }
              };
            }
          }]
      };
    });
    ctx.defaction(ctx, "bar", function* (ctx, getArg) {
      ctx.scope.set("one", getArg("one", 0));
      ctx.scope.set("two", getArg("two", 1));
      ctx.scope.set("three", getArg("three", 2));
      return {
        "actions": [{
            "action": function* (ctx) {
              return {
                "type": "directive",
                "name": "bar",
                "options": {
                  "a": ctx.scope.get("one"),
                  "b": ctx.scope.get("two"),
                  "c": ctx.scope.get("three")
                }
              };
            }
          }]
      };
    });
    ctx.scope.set("getSettingVal", ctx.KRLClosure(function* (ctx, getArg) {
      return yield ctx.modules.get(ctx, "ent", "setting_val");
    }));
    ctx.defaction(ctx, "chooser", function* (ctx, getArg) {
      ctx.scope.set("val", getArg("val", 0));
      return {
        "block_type": "choose",
        "condition": function* (ctx) {
          return ctx.scope.get("val");
        },
        "actions": [
          {
            "label": "asdf",
            "action": function* (ctx, runAction) {
              return yield runAction(ctx, "foo", [ctx.scope.get("val")]);
            }
          },
          {
            "label": "fdsa",
            "action": function* (ctx, runAction) {
              return yield runAction(ctx, "bar", [
                ctx.scope.get("val"),
                "ok",
                "done"
              ]);
            }
          }
        ]
      };
    });
    ctx.defaction(ctx, "ifAnotB", function* (ctx, getArg) {
      ctx.scope.set("a", getArg("a", 0));
      ctx.scope.set("b", getArg("b", 1));
      return {
        "condition": function* (ctx) {
          return ctx.scope.get("a") && !ctx.scope.get("b");
        },
        "actions": [
          {
            "action": function* (ctx) {
              return {
                "type": "directive",
                "name": "yes a",
                "options": {}
              };
            }
          },
          {
            "action": function* (ctx) {
              return {
                "type": "directive",
                "name": "not b",
                "options": {}
              };
            }
          }
        ]
      };
    });
    ctx.scope.set("add", ctx.KRLClosure(function* (ctx, getArg) {
      ctx.scope.set("a", getArg("a", 0));
      ctx.scope.set("b", getArg("b", 1));
      return {
        "type": "directive",
        "name": "add",
        "options": { "resp": yield ctx.callKRLstdlib("+", ctx.scope.get("a"), ctx.scope.get("b")) }
      };
    }));
  },
  "rules": {
    "foo": {
      "name": "foo",
      "select": {
        "graph": { "defa": { "foo": { "expr_0": true } } },
        "eventexprs": {
          "expr_0": function* (ctx, aggregateEvent) {
            return true;
          }
        },
        "state_machine": {
          "start": [[
              "expr_0",
              "end"
            ]]
        }
      },
      "action_block": {
        "actions": [{
            "action": function* (ctx, runAction) {
              return yield runAction(ctx, "foo", ["bar"]);
            }
          }]
      }
    },
    "bar": {
      "name": "bar",
      "select": {
        "graph": { "defa": { "bar": { "expr_0": true } } },
        "eventexprs": {
          "expr_0": function* (ctx, aggregateEvent) {
            return true;
          }
        },
        "state_machine": {
          "start": [[
              "expr_0",
              "end"
            ]]
        }
      },
      "action_block": {
        "actions": [{
            "action": function* (ctx, runAction) {
              return yield runAction(ctx, "bar", {
                "0": "baz",
                "two": "qux",
                "three": "quux"
              });
            }
          }]
      }
    },
    "bar_setting": {
      "name": "bar_setting",
      "select": {
        "graph": { "defa": { "bar_setting": { "expr_0": true } } },
        "eventexprs": {
          "expr_0": function* (ctx, aggregateEvent) {
            return true;
          }
        },
        "state_machine": {
          "start": [[
              "expr_0",
              "end"
            ]]
        }
      },
      "action_block": {
        "actions": [{
            "action": function* (ctx, runAction) {
              return ctx.scope.set("val", yield runAction(ctx, "bar", {
                "0": "baz",
                "two": "qux",
                "three": "quux"
              }));
            }
          }]
      },
      "postlude": {
        "fired": function* (ctx) {
          yield ctx.modules.set(ctx, "ent", "setting_val", ctx.scope.get("val"));
        },
        "notfired": undefined,
        "always": undefined
      }
    },
    "chooser": {
      "name": "chooser",
      "select": {
        "graph": { "defa": { "chooser": { "expr_0": true } } },
        "eventexprs": {
          "expr_0": function* (ctx, aggregateEvent) {
            return true;
          }
        },
        "state_machine": {
          "start": [[
              "expr_0",
              "end"
            ]]
        }
      },
      "action_block": {
        "actions": [{
            "action": function* (ctx, runAction) {
              return yield runAction(ctx, "chooser", [yield (yield ctx.modules.get(ctx, "event", "attr"))(ctx, ["val"])]);
            }
          }]
      }
    },
    "ifAnotB": {
      "name": "ifAnotB",
      "select": {
        "graph": { "defa": { "ifAnotB": { "expr_0": true } } },
        "eventexprs": {
          "expr_0": function* (ctx, aggregateEvent) {
            return true;
          }
        },
        "state_machine": {
          "start": [[
              "expr_0",
              "end"
            ]]
        }
      },
      "action_block": {
        "actions": [{
            "action": function* (ctx, runAction) {
              return yield runAction(ctx, "ifAnotB", [
                yield ctx.callKRLstdlib("==", yield (yield ctx.modules.get(ctx, "event", "attr"))(ctx, ["a"]), "true"),
                yield ctx.callKRLstdlib("==", yield (yield ctx.modules.get(ctx, "event", "attr"))(ctx, ["b"]), "true")
              ]);
            }
          }]
      }
    },
    "add": {
      "name": "add",
      "select": {
        "graph": { "defa": { "add": { "expr_0": true } } },
        "eventexprs": {
          "expr_0": function* (ctx, aggregateEvent) {
            return true;
          }
        },
        "state_machine": {
          "start": [[
              "expr_0",
              "end"
            ]]
        }
      },
      "action_block": {
        "actions": [{
            "action": function* (ctx, runAction) {
              return yield runAction(ctx, "add", [
                1,
                2
              ]);
            }
          }]
      }
    }
  }
};