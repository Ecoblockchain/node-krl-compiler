var callStdLibFn = require("../utils/callStdLibFn");

module.exports = function(ast, comp, e){
    if(ast.callee.type === "MemberExpression"
            && ast.callee.method === "dot"
            && ast.callee.property.type === "Identifier"
            ){
        //operator syntax is just sugar for stdlib functions
        var operator = ast.callee.property;
        var args = comp(ast.args, {
            prepend_arg: comp(ast.callee.object),
        });
        return callStdLibFn(e, operator.value, args, operator.loc);
    }

    return e("ycall", comp(ast.callee), [
        e("id", "ctx"),
        comp(ast.args)
    ]);
};
