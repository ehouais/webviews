{
    var extend = function(obj, add) {
        if (add)
            for (var i in add)
                if (add.hasOwnProperty(i)) obj[i] = add[i];

        return obj;
    };
}

root        = l:("{" labels "}" "\n"?)? v:values u:("(" ulabel ")")?
                                            { return extend(extend({values: v}, l && {labels: l[1].labels, grouping: l[1].grouping}), u && {unit: u[1]}); }

labels      = left:stack "," right:labels   { return {labels: left.labels.concat(right.labels), grouping: [left.nb].concat(right.grouping)}; }
            / t:stack                       { return {labels: t.labels, grouping: [t.nb]}; }
stack       = left:slabel "+" right:stack   { return {labels: [left].concat(right.labels), nb: 1+right.nb}; }
            / l:slabel                      { return {labels: [l], nb: 1}; }

values      = left:value vsep right:values  { return [left].concat(right); }
            / v:value
vsep        = "|"
            / "\n"
value       = l:(vlabel ":")? ss:sums       { return extend({values: ss}, l && {label: l[0]}); }
sums        = left:sum "," right:sums       { return [left].concat(right); }
            / sum
sum         = left:float "+" right:sum      { return left+right; }
            / float

// Base types
float       = chars:[\.0-9]+                { return +chars.join(''); }
slabel      = chars:[^},+\n]+               { return chars.join(''); }
vlabel      = chars:[^:|\n]+                { return chars.join(''); }
ulabel      = chars:[^)\n]+                 { return chars.join(''); }
