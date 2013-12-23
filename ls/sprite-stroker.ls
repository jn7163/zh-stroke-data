class SpriteStroker
  @loaders =
    xml : zh-stroke-data.loaders.XML
    json: zh-stroke-data.loaders.JSON
    bin : zh-stroke-data.loaders.Binary
  (str, options) ->
    options = $.extend do
      ###
      # mimic <video>
      ###
      autoplay: off
      #controls: off
      width: 215
      height: 215
      loop: off
      #muted: yes
      preload: 4chars
      poster: ''
      url: './json/'
      dataType: \json
      ###
      # others
      ###
      speed: 1000px_per_sec #px in original resolution
      stroke-delay: 0.2s
      char-delay: 1s
      options
    @autoplay    = options.autoplay
    @loop        = options.loop
    @preload     = options.preload
    @width       = options.width
    @height      = options.height
    @posters     = options.posters
    @url         = options.url
    @dataType    = options.dataType
    @dom-element = document.createElement \canvas
    @dom-element.width  = @width
    @dom-element.height = @height

    @stroke-gap =
      speed: options.speed
      delay: options.strokeDelay
      objs: []
      update: !->
        for o in @objs
          o.computeLength!
          #bad
          o.parent.childrenChanged!
    @char-gap =
      speed: options.speed
      delay: options.charDelay
      objs: []
      update: !->
        for o in @objs
          o.computeLength!
          o.parent.childrenChanged!
    Object.defineProperty do
      this
      \speed
        set: ->
          @stroke-gap
            ..speed = it
            ..update!
          @char-gap
            ..speed = it
            ..update!
          @stroke-gap.speed
        get: -> @stroke-gap.speed
    Object.defineProperty do
      this
      \strokeDelay
        set: ->
          @stroke-gap
            ..delay = it
            ..update!
          @stroke-gap.delay
        get: -> @stroke-gap.delay
    Object.defineProperty do
      this
      \charDelay
        set: ->
          @char-gap
            ..delay = it
            ..update!
          @char-gap.delay
        get: -> @char-gap.delay

    promises = for ch in str.sortSurrogates!
      @@loaders[@dataType] "#{@url}#{ch.codePointAt!toString 16}.#{@dataType}"
    Q.all(promises).then ~>
      chars = []
      for i, char-data of it
        strokes = []
        for j, data of char-data
          strokes.push new zh-stroke-data.Stroke data
          continue if +j is it.length - 1
          gap = new zh-stroke-data.Empty @stroke-gap
          @stroke-gap.objs.push gap
          strokes.push gap
        char = new zh-stroke-data.Comp strokes
        # should be char width
        char.x = @width * +i
        chars.push char
        continue if +i is it.length - 1
        gap = new zh-stroke-data.Empty @char-gap
        @char-gap.objs.push gap
        chars.push gap
      (@sprite = new zh-stroke-data.Comp chars)
        ..scale-x = @width  / 2150
        ..scale-y = @height / 2150
      @dom-element.width  = @width * chars.length
  ###
  # mimic MediaElement
  ###
  #audioTracks        : 0
  videoTracks        : 1
  #textTracks         : 0
  autoplay           : off
  buffered           : null # read only TimeRanges
  #controller         : null # MediaController
  #controls           : options.controls
  #crossOrigin       : ''
  #src                : options.src
  #currentSrc         : src # read only
  currentTime        : 0sec
  #defaultMuted       : @options.muted
  #muted              : @defaultMuted
  defaultPlaybackRate: 1.0
  PlaybackRate       : 1.0
  duration           : 0    # rea:qd only
  ended              : no   # read only
  error              : null # read only MediaError
  #initialTime        : 0    # read only
  loop               : off
  #mediaGroup         : ''
  #networkState      : 0
  paused             : no   # read only
  played             : no   # read only TimeRanges
  preload            : 4
  #readyState        : 0
  seekable           : null # read only TimeRanges
  seeking            : no   # read only
  #volume             : 0
  canPlayType        : (str) -> 'probably' or 'maybe' or ''
  fastSeek           : (time) !-> @currentTime = time
  load               : !->
  pause              : !-> @paused = !!it
  play               : !~>
    if @sprite
      @sprite.render @dom-element
      step = @speed * 1 / 60
      @sprite.time += step / @sprite.length
      @currentTime = @sprite.time * @sprite.length / @speed
    # should get interval from Date
    requestAnimationFrame @play if not @paused
  ###
  # mimic VideoElement
  ###
  width              : 0
  height             : 0
  videoWidth         : 0    # read only
  videoHeight        : 0    # read only
  poster             : 0

(window.zh-stroke-data ?= {})
  ..SpriteStroker = SpriteStroker