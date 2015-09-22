{
    var extend = function(obj, add) {
       for (var i in add) {
          if (add.hasOwnProperty(i) && add[i] !== null) {
             obj[i] = add[i];
          }
       }
       return obj;
    };
}

root            = global:global_interval? tls:timelines     { return extend({timelines: tls}, {viewbox: global}); }
timelines       = t:timeline ts:("|" timeline)*             { return [t].concat(ts.map(function(t) { return t[1]; })); }

global_interval = "<" interval:interval ">"                 { return interval; }

interval        = start:datetime "-" end:datetime           { return {start: start, end: end}; }
datetime        = date:date time:(" " time)?                { return Date.parse(date+(time ? 'T'+time[1] : '')); }

date            = dm:((day "/")? month "/")? year:year      { return year+'-'+(dm[1] || '01')+'-'+(dm[0][0] || '01'); }
day             = day:([0-3]? digit)                        { return day[0]+day[1]; }
month           = month:([0-1]? digit)                      { return month[0]+month[1]; }
year            = "'" + year:(digit digit)                  { return +year.join('')+2000; }
                / sign:"-"? digits:digit+                   { return (sign ? -1 : 1)*digits.join(''); }

time            = hours (":" minutes)?
hours           = hours:([0-2] digit)                       { return hours[0]+hours[1]; }
minutes         = minutes:([0-5] digit)                     { return minutes[0]+minutes[1]; }

timeline        = label:label? events:event+                { return extend({events: events}, {label: label}); }
event           = "[" interval:interval "]" "+" v:value     { return extend(interval, {value: v}); }
                / "[" interval:interval "]" label:label?    { return extend(interval, {label: label}); }
                / "[" dt:datetime "]" label:label?          { return extend({datetime: dt}, {label: label}); }

label           = chars:char+                               { return chars.join('').replace(new RegExp('_', 'g'), ' '); }
value           = digits:digit+                             { return +digits.join(''); }
char            = [A-Za-z_0-9.'_ ()]
digit           = [0-9]
