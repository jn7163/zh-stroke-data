// Generated by LiveScript 1.2.0
(function(){
  var ref$;
  (ref$ = String.prototype).codePointAt == null && (ref$.codePointAt = function(pos){
    var str, code, next;
    pos == null && (pos = 0);
    str = String(this);
    code = str.charCodeAt(pos);
    if (0xD800 <= code && code <= 0xDBFF) {
      next = str.charCodeAt(pos + 1);
      if (0xDC00 <= next && next <= 0xDFFF) {
        return (code - 0xD800) * 0x400 + (next - 0xDC00) + 0x10000;
      }
    }
    return code;
  });
}).call(this);