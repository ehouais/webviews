parser = (function() {
  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.majda.cz/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function SyntaxError(message, expected, found, offset, line, column) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.offset   = offset;
    this.line     = line;
    this.column   = column;

    this.name     = "SyntaxError";
  }

  peg$subclass(SyntaxError, Error);

  function parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},

        peg$FAILED = {},

        peg$startRuleIndices = { root: 0 },
        peg$startRuleIndex   = 0,

        peg$consts = [
          peg$FAILED,
          function(t, l) { return {root: t, links: l}; },
          null,
          function(n, s) { return s ? extend(s, {subnodes: [n].concat(s.subnodes)}) : n; },
          function(o, t) { return extend(o, {subnodes: o.type == t.type && o.iso == t.iso ? t.subnodes : [t]}); },
          function(s, iso) { return {type: s, 'iso': !!iso}; },
          "|",
          { type: "literal", value: "|", description: "\"|\"" },
          function() { return 'hsplit'; },
          "-",
          { type: "literal", value: "-", description: "\"-\"" },
          function() { return 'vsplit'; },
          function(i, n) { return extend(n, {id: i || '#'+index++}); },
          ":",
          { type: "literal", value: ":", description: "\":\"" },
          function(i) { return i; },
          [],
          /^[A-Z]/,
          { type: "class", value: "[A-Z]", description: "[A-Z]" },
          function(chars) { return chars.join(''); },
          "(",
          { type: "literal", value: "(", description: "\"(\"" },
          ")",
          { type: "literal", value: ")", description: "\")\"" },
          function(t) { return t; },
          function(n) { return extend(n, {type: 'shape'}); },
          function(n) { return extend(n, {type: 'text'}); },
          "[",
          { type: "literal", value: "[", description: "\"[\"" },
          "]",
          { type: "literal", value: "]", description: "\"]\"" },
          function(t) { return {shape: 'rect', subnode: t}; },
          "{",
          { type: "literal", value: "{", description: "\"{\"" },
          "}",
          { type: "literal", value: "}", description: "\"}\"" },
          function(t) { return {shape: 'rrect', subnode: t}; },
          "\"",
          { type: "literal", value: "\"", description: "\"\\\"\"" },
          /^[A-Z a-z_.\-|,*[\]{}()]/,
          { type: "class", value: "[A-Z a-z_.\\-|,*[\\]{}()]", description: "[A-Z a-z_.\\-|,*[\\]{}()]" },
          function(chars) { return {text: chars.join('')}; },
          /^[A-Z a-z_.]/,
          { type: "class", value: "[A-Z a-z_.]", description: "[A-Z a-z_.]" },
          ",",
          { type: "literal", value: ",", description: "\",\"" },
          function(l) { return l.map(function(lk) { return lk[1]; }); },
          function(f, l, t) { return extend(l, {from: f, to: t}); },
          function(s, m) { return extend(s, {marker: m || 'none'}); },
          function(s, c) { return c ? extend(s, {text: c[0]}) : s; },
          /^[\-.]/,
          { type: "class", value: "[\\-.]", description: "[\\-.]" },
          function(s) { return {stroke: s == '.' ? 'dashed' : 'plain'}; },
          /^[A-Za-z ]/,
          { type: "class", value: "[A-Za-z ]", description: "[A-Za-z ]" },
          /^[>]/,
          { type: "class", value: "[>]", description: "[>]" },
          function(m) { return 'arrow'; }
        ],

        peg$bytecode = [
          peg$decode("!7!+3$7.+)%4\"6!\"\"! %$\"#  \"#  "),
          peg$decode("!7%+9$7\"*# \" \"+)%4\"6#\"\"! %$\"#  \"#  "),
          peg$decode("!7#+3$7!+)%4\"6$\"\"! %$\"#  \"#  "),
          peg$decode("!7$+9$7$*# \" \"+)%4\"6%\"\"! %$\"#  \"#  "),
          peg$decode("!.&\"\"2&3'+& 4!6(! %*4 \"!.)\"\"2)3*+& 4!6+! %"),
          peg$decode("!7&*# \" \"+3$7(+)%4\"6,\"\"! %$\"#  \"#  "),
          peg$decode("!7'+8$.-\"\"2-3.+(%4\"6/\"!!%$\"#  \"#  "),
          peg$decode("! 001\"\"1!32+,$,)&01\"\"1!32\"\"\"  +' 4!63!! %"),
          peg$decode("!.4\"\"2435+B$7!+8%.6\"\"2637+(%4#68#!!%$##  $\"#  \"#  *A \"!7)+' 4!69!! %*/ \"!7*+' 4!6:!! %"),
          peg$decode("!.;\"\"2;3<+B$7!+8%.=\"\"2=3>+(%4#6?#!!%$##  $\"#  \"#  *S \"!.@\"\"2@3A+B$7!+8%.B\"\"2B3C+(%4#6D#!!%$##  $\"#  \"#  "),
          peg$decode("7+*# \"7-"),
          peg$decode("!.E\"\"2E3F+B$7,+8%.E\"\"2E3F+(%4#68#!!%$##  $\"#  \"#  "),
          peg$decode("! 00G\"\"1!3H+,$,)&0G\"\"1!3H\"\"\"  +' 4!6I!! %"),
          peg$decode("! 00J\"\"1!3K,)&0J\"\"1!3K\"+' 4!6I!! %"),
          peg$decode("! 0!.L\"\"2L3M+-$7/+#%'\"%$\"#  \"#  ,>&!.L\"\"2L3M+-$7/+#%'\"%$\"#  \"#  \"+' 4!6N!! %"),
          peg$decode("!7'+>$70+4%7'+*%4#6O##\"! %$##  $\"#  \"#  "),
          peg$decode("!71+9$74*# \" \"+)%4\"6P\"\"! %$\"#  \"#  "),
          peg$decode("!72+N$!73+-$72+#%'\"%$\"#  \"#  *# \" \"+)%4\"6Q\"\"! %$\"#  \"#  "),
          peg$decode("!0R\"\"1!3S+' 4!6T!! %"),
          peg$decode("! 00U\"\"1!3V+,$,)&0U\"\"1!3V\"\"\"  +' 4!63!! %"),
          peg$decode("!0W\"\"1!3X+' 4!6Y!! %")
        ],

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleIndices)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleIndex = peg$startRuleIndices[options.startRule];
    }

    function text() {
      return input.substring(peg$reportedPos, peg$currPos);
    }

    function offset() {
      return peg$reportedPos;
    }

    function line() {
      return peg$computePosDetails(peg$reportedPos).line;
    }

    function column() {
      return peg$computePosDetails(peg$reportedPos).column;
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        peg$reportedPos
      );
    }

    function error(message) {
      throw peg$buildException(message, null, peg$reportedPos);
    }

    function peg$computePosDetails(pos) {
      function advance(details, startPos, endPos) {
        var p, ch;

        for (p = startPos; p < endPos; p++) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }
        }
      }

      if (peg$cachedPos !== pos) {
        if (peg$cachedPos > pos) {
          peg$cachedPos = 0;
          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
        }
        advance(peg$cachedPosDetails, peg$cachedPos, pos);
        peg$cachedPos = pos;
      }

      return peg$cachedPosDetails;
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, pos) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      var posDetails = peg$computePosDetails(pos),
          found      = pos < input.length ? input.charAt(pos) : null;

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        pos,
        posDetails.line,
        posDetails.column
      );
    }

    function peg$decode(s) {
      var bc = new Array(s.length), i;

      for (i = 0; i < s.length; i++) {
        bc[i] = s.charCodeAt(i) - 32;
      }

      return bc;
    }

    function peg$parseRule(index) {
      var bc    = peg$bytecode[index],
          ip    = 0,
          ips   = [],
          end   = bc.length,
          ends  = [],
          stack = [],
          params, i;

      function protect(object) {
        return Object.prototype.toString.apply(object) === "[object Array]" ? [] : object;
      }

      while (true) {
        while (ip < end) {
          switch (bc[ip]) {
            case 0:
              stack.push(protect(peg$consts[bc[ip + 1]]));
              ip += 2;
              break;

            case 1:
              stack.push(peg$currPos);
              ip++;
              break;

            case 2:
              stack.pop();
              ip++;
              break;

            case 3:
              peg$currPos = stack.pop();
              ip++;
              break;

            case 4:
              stack.length -= bc[ip + 1];
              ip += 2;
              break;

            case 5:
              stack.splice(-2, 1);
              ip++;
              break;

            case 6:
              stack[stack.length - 2].push(stack.pop());
              ip++;
              break;

            case 7:
              stack.push(stack.splice(stack.length - bc[ip + 1], bc[ip + 1]));
              ip += 2;
              break;

            case 8:
              stack.pop();
              stack.push(input.substring(stack[stack.length - 1], peg$currPos));
              ip++;
              break;

            case 9:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (stack[stack.length - 1]) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              } else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 10:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (stack[stack.length - 1] === peg$FAILED) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              } else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 11:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (stack[stack.length - 1] !== peg$FAILED) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              } else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 12:
              if (stack[stack.length - 1] !== peg$FAILED) {
                ends.push(end);
                ips.push(ip);

                end = ip + 2 + bc[ip + 1];
                ip += 2;
              } else {
                ip += 2 + bc[ip + 1];
              }

              break;

            case 13:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (input.length > peg$currPos) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              } else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 14:
              ends.push(end);
              ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

              if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length) === peg$consts[bc[ip + 1]]) {
                end = ip + 4 + bc[ip + 2];
                ip += 4;
              } else {
                end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                ip += 4 + bc[ip + 2];
              }

              break;

            case 15:
              ends.push(end);
              ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

              if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length).toLowerCase() === peg$consts[bc[ip + 1]]) {
                end = ip + 4 + bc[ip + 2];
                ip += 4;
              } else {
                end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                ip += 4 + bc[ip + 2];
              }

              break;

            case 16:
              ends.push(end);
              ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

              if (peg$consts[bc[ip + 1]].test(input.charAt(peg$currPos))) {
                end = ip + 4 + bc[ip + 2];
                ip += 4;
              } else {
                end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                ip += 4 + bc[ip + 2];
              }

              break;

            case 17:
              stack.push(input.substr(peg$currPos, bc[ip + 1]));
              peg$currPos += bc[ip + 1];
              ip += 2;
              break;

            case 18:
              stack.push(peg$consts[bc[ip + 1]]);
              peg$currPos += peg$consts[bc[ip + 1]].length;
              ip += 2;
              break;

            case 19:
              stack.push(peg$FAILED);
              if (peg$silentFails === 0) {
                peg$fail(peg$consts[bc[ip + 1]]);
              }
              ip += 2;
              break;

            case 20:
              peg$reportedPos = stack[stack.length - 1 - bc[ip + 1]];
              ip += 2;
              break;

            case 21:
              peg$reportedPos = peg$currPos;
              ip++;
              break;

            case 22:
              params = bc.slice(ip + 4, ip + 4 + bc[ip + 3]);
              for (i = 0; i < bc[ip + 3]; i++) {
                params[i] = stack[stack.length - 1 - params[i]];
              }

              stack.splice(
                stack.length - bc[ip + 2],
                bc[ip + 2],
                peg$consts[bc[ip + 1]].apply(null, params)
              );

              ip += 4 + bc[ip + 3];
              break;

            case 23:
              stack.push(peg$parseRule(bc[ip + 1]));
              ip += 2;
              break;

            case 24:
              peg$silentFails++;
              ip++;
              break;

            case 25:
              peg$silentFails--;
              ip++;
              break;

            default:
              throw new Error("Invalid opcode: " + bc[ip] + ".");
          }
        }

        if (ends.length > 0) {
          end = ends.pop();
          ip = ips.pop();
        } else {
          break;
        }
      }

      return stack[0];
    }


        var extend = function(obj, add) {
           for (var i in add) {
              if (add.hasOwnProperty(i)) {
                 obj[i] = add[i];
              }
           }
           return obj;
        };
        var index = 1;


    peg$result = peg$parseRule(peg$startRuleIndex);

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
    }
  }

  return {
    SyntaxError: SyntaxError,
    parse:       parse
  };
})();