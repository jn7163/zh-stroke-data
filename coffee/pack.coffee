fs = require "fs"

push = Array.prototype.push

scale_factor = 2060.0 / 256

scale = (num) ->
  throw "coordinate out of range: #{num}" if num >= 2060
  return ~~((num + scale_factor/2) / scale_factor)

hexFromNumber = (num) ->
  ret = num.toString(16)
  if ret.length < 2 then "0" + ret else ret

process.argv.forEach (packed, index) ->
  return if index is 0 or index is 1
  offsets = []
  results = []
  for i in [0..255]
    strokes = undefined
    path = "./json/#{packed}#{hexFromNumber(i)}.json"
    offsets[i] = 0
    results[i] = []
    if fs.existsSync path
      strokes = require path
      strokes.forEach (stroke) ->
        throw "outline length out of range: #{stroke.outline.length}" if stroke.outline.length >= 256
        types = []
        xs = []
        ys = []
        results[i].push stroke.outline.length
        stroke.outline.forEach (cmd) ->
          types.push cmd.type.charCodeAt(0)
          switch cmd.type
            when "M"
              xs.push cmd.x
              ys.push cmd.y
            when "L"
              xs.push cmd.x
              ys.push cmd.y
            when "Q"
              xs.push cmd.begin.x
              ys.push cmd.begin.y
              xs.push cmd.end.x
              ys.push cmd.end.y
            when "C"
              xs.push cmd.begin.x
              xs.push cmd.begin.x
              ys.push cmd.mid.y
              ys.push cmd.mid.y
              xs.push cmd.end.x
              ys.push cmd.end.y
            else
              throw "unknow path type: #{cmd.type}"
        xs = xs.map scale
        ys = ys.map scale
        push.apply results[i], types
        push.apply results[i], xs
        push.apply results[i], ys
        throw "track length out of range: #{stroke.track.length}" if stroke.outline.length >= 256
        with_size = []
        xs = []
        ys = []
        ss = []
        results[i].push stroke.track.length
        stroke.track.forEach (node, index) ->
          xs.push node.x
          ys.push node.y
          if node.size isnt undefined
            with_size.push index
            ss.push node.size
        xs = xs.map scale
        ys = ys.map scale
        ss = ss.map scale
        results[i].push with_size.length
        push.apply results[i], with_size
        push.apply results[i], xs
        push.apply results[i], ys
        push.apply results[i], ss
        # save size of each word
        offsets[i] = results[i].length
  prev = 256 * 4
  for i of offsets
    if offsets[i] isnt 0
      offset = offsets[i]
      offsets[i] = prev
      prev += offset
  offsetsBuffer = new Buffer 256 * 4
  offsets.forEach (offset, i) ->
    offsetsBuffer.writeUInt32LE offset, i * 4
  process.stdout.write offsetsBuffer
  results.forEach (result) ->
    buffer = new Buffer result
    throw "buffer is not a pure uint8 buffer" if buffer.length isnt result.length
    process.stdout.write new Buffer result