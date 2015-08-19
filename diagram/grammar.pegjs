{
    var extend = function(obj, add) {
       for (var i in add) {
          if (add.hasOwnProperty(i)) {
             obj[i] = add[i];
          }
       }
       return obj;
    };
    var index = 1;
}

root           = t:tree l:links                 { return {root: t, links: l}; }

tree           = n:single_node s:split_right?   { return s ? extend(s, {subnodes: [n].concat(s.subnodes)}) : n; }
split_right    = o:split_op t:tree              { return extend(o, {subnodes: o.type == t.type && o.iso == t.iso && t.id == o.id && t.spacing == o.spacing? t.subnodes : [t]}); }

split_op       = s:"|"+                         { return {type: 'hsplit', 'spacing': s.length}; }
               / s:"-"+                         { return {type: 'vsplit', 'spacing': s.length}; }

single_node    = i:node_decl? n:mono_node       { return i ? extend(n, i) : n; }
node_decl      = l:"@"? i:node_id ":"           { return {id: i, clickable: !!l}; }
node_id        = chars:[A-Za-z]+                { return chars.join(''); }

mono_node      = "{" t:tree "}"                 { return t; }
               / n:shape_node                   { return extend(n, {type: 'shape'}); }
               / n:text_node                    { return extend(n, {type: 'text'}); }

shape_node     = "[(" t:tree ")]"               { return {shape: 'rrect', subnode: t}; }
               / "[" t:tree "]"                 { return {shape: 'rect', subnode: t}; }
               / "(" t:tree ")"                 { return {shape: 'circle', subnode: t}; }

text_node      = quoted_text
               / text
quoted_text    = "\"" t:extended_text "\""      { return t; }
extended_text  = chars:[A-Z a-z0-9_.\-:|,*[\]{}()]+ { return {text: chars.join('')}; }
text           = chars:[A-Z a-z0-9_.]*          { return {text: chars.join('')}; }

links          = l:("," link)*                  { return l.map(function(lk) { return lk[1]; }); }
link           = f:node_id l:link_type t:node_id  { return extend(l, {from: f, to: t}); }
link_type      = s:link_line m:link_marker?     { return extend(s, {marker: m || 'none'}); }
link_line      = s:link_stroke c:(link_text link_stroke)? { return c ? extend(s, {text: c[0]}) : s; }
link_stroke    = s:[\-\.]                       { return {stroke: s == '.' ? 'dashed' : 'plain'}; }
link_text      = chars:[A-Za-z ]+               { return chars.join(''); }
link_marker    = m:[>]                          { return 'arrow'; }
