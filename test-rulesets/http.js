module.exports = {
  "rid": "io.picolabs.http",
  "meta": {
    "shares": [
      "getResp",
      "getLastPostEvent"
    ]
  },
  "global": function* (ctx) {
    ctx.scope.set("getResp", ctx.KRLClosure(function* (ctx, getArg, hasArg) {
      return yield ctx.modules.get(ctx, "ent", "resp");
    }));
    ctx.scope.set("getLastPostEvent", ctx.KRLClosure(function* (ctx, getArg, hasArg) {
      return yield ctx.modules.get(ctx, "ent", "last_post_event");
    }));
    ctx.scope.set("fmtResp", ctx.KRLClosure(function* (ctx, getArg, hasArg) {
      ctx.scope.set("r", getArg("r", 0));
      return yield ctx.callKRLstdlib("delete", [
        yield ctx.callKRLstdlib("delete", [
          yield ctx.callKRLstdlib("delete", [
            yield ctx.callKRLstdlib("delete", [
              yield ctx.callKRLstdlib("set", [
                ctx.scope.get("r"),
                "content",
                yield ctx.callKRLstdlib("decode", [yield ctx.callKRLstdlib("get", [
                    ctx.scope.get("r"),
                    ["content"]
                  ])])
              ]),
              ["content_length"]
            ]),
            [
              "headers",
              "content-length"
            ]
          ]),
          [
            "headers",
            "date"
          ]
        ]),
        [
          "content",
          "headers",
          "content-length"
        ]
      ]);
    }));
    ctx.defaction(ctx, "doPost", function* (ctx, getArg, hasArg, processActionBlock) {
      ctx.scope.set("base_url", getArg("base_url", 0));
      ctx.scope.set("to", getArg("to", 1));
      ctx.scope.set("msg", getArg("msg", 2));
      yield processActionBlock(ctx, {
        "actions": [{
            "action": function* (ctx, runAction) {
              var returns = yield runAction(ctx, "http", "post", {
                "0": yield ctx.callKRLstdlib("+", [
                  ctx.scope.get("url"),
                  "/msg.json"
                ]),
                "from": {
                  "To": ctx.scope.get("to"),
                  "Msg": ctx.scope.get("msg")
                }
              });
            }
          }]
      });
      return [];
    });
  },
  "rules": {
    "http_get": {
      "name": "http_get",
      "select": {
        "graph": { "http_test": { "get": { "expr_0": true } } },
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
      "prelude": function* (ctx) {
        ctx.scope.set("url", yield (yield ctx.modules.get(ctx, "event", "attr"))(ctx, ["url"]));
      },
      "postlude": {
        "fired": function* (ctx) {
          ctx.scope.set("resp", yield (yield ctx.modules.get(ctx, "http", "get"))(ctx, {
            "0": ctx.scope.get("url"),
            "qs": { "foo": "bar" },
            "headers": { "baz": "quix" }
          }));
          yield ctx.modules.set(ctx, "ent", "resp", yield ctx.scope.get("fmtResp")(ctx, [ctx.scope.get("resp")]));
        },
        "notfired": undefined,
        "always": undefined
      }
    },
    "http_post": {
      "name": "http_post",
      "select": {
        "graph": { "http_test": { "post": { "expr_0": true } } },
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
      "prelude": function* (ctx) {
        ctx.scope.set("url", yield (yield ctx.modules.get(ctx, "event", "attr"))(ctx, ["url"]));
      },
      "action_block": {
        "actions": [{
            "action": function* (ctx, runAction) {
              var returns = yield runAction(ctx, "http", "post", {
                "0": ctx.scope.get("url"),
                "json": { "foo": "bar" }
              });
            }
          }]
      }
    },
    "http_post_action": {
      "name": "http_post_action",
      "select": {
        "graph": { "http_test": { "post_action": { "expr_0": true } } },
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
      "prelude": function* (ctx) {
        ctx.scope.set("url", yield (yield ctx.modules.get(ctx, "event", "attr"))(ctx, ["url"]));
      },
      "action_block": {
        "actions": [{
            "action": function* (ctx, runAction) {
              var returns = yield runAction(ctx, void 0, "doPost", [
                ctx.scope.get("url"),
                "bob",
                "foobar"
              ]);
            }
          }]
      }
    },
    "http_post_setting": {
      "name": "http_post_setting",
      "select": {
        "graph": { "http_test": { "post_setting": { "expr_0": true } } },
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
      "prelude": function* (ctx) {
        ctx.scope.set("url", yield (yield ctx.modules.get(ctx, "event", "attr"))(ctx, ["url"]));
      },
      "action_block": {
        "actions": [{
            "action": function* (ctx, runAction) {
              var returns = yield runAction(ctx, "http", "post", {
                "0": ctx.scope.get("url"),
                "qs": { "foo": "bar" },
                "form": { "baz": "qux" }
              });
              ctx.scope.set("resp", returns[0]);
            }
          }]
      },
      "postlude": {
        "fired": function* (ctx) {
          yield ctx.modules.set(ctx, "ent", "resp", yield ctx.scope.get("fmtResp")(ctx, [ctx.scope.get("resp")]));
        },
        "notfired": undefined,
        "always": undefined
      }
    },
    "http_autorase": {
      "name": "http_autorase",
      "select": {
        "graph": { "http_test": { "autoraise": { "expr_0": true } } },
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
      "prelude": function* (ctx) {
        ctx.scope.set("url", yield (yield ctx.modules.get(ctx, "event", "attr"))(ctx, ["url"]));
      },
      "action_block": {
        "actions": [{
            "action": function* (ctx, runAction) {
              var returns = yield runAction(ctx, "http", "post", {
                "0": ctx.scope.get("url"),
                "qs": { "foo": "bar" },
                "form": { "baz": "qux" },
                "autoraise": "foobar"
              });
            }
          }]
      }
    },
    "http_post_event_handler": {
      "name": "http_post_event_handler",
      "select": {
        "graph": { "http": { "post": { "expr_0": true } } },
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
      "prelude": function* (ctx) {
        ctx.scope.set("resp", yield ctx.scope.get("fmtResp")(ctx, [yield (yield ctx.modules.get(ctx, "event", "attrs"))(ctx, [])]));
      },
      "action_block": {
        "actions": [{
            "action": function* (ctx, runAction) {
              var returns = yield runAction(ctx, void 0, "send_directive", [
                "http_post_event_handler",
                { "attrs": ctx.scope.get("resp") }
              ]);
            }
          }]
      },
      "postlude": {
        "fired": function* (ctx) {
          yield ctx.modules.set(ctx, "ent", "last_post_event", ctx.scope.get("resp"));
        },
        "notfired": undefined,
        "always": undefined
      }
    }
  }
};