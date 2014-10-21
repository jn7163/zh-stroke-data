// Generated by LiveScript 1.3.0
(function(){
  var AABB, loaders, Stroke, ScanlineStroke, Empty, Comp, hintDataFromMOE, hintDataFromScanline, Hint, SpriteStroker, x$, ref$;
  AABB = zhStrokeData.AABB, loaders = zhStrokeData.loaders, Stroke = zhStrokeData.Stroke, ScanlineStroke = zhStrokeData.ScanlineStroke, Empty = zhStrokeData.Empty, Comp = zhStrokeData.Comp, hintDataFromMOE = zhStrokeData.hintDataFromMOE, hintDataFromScanline = zhStrokeData.hintDataFromScanline, Hint = zhStrokeData.Hint;
  SpriteStroker = (function(){
    SpriteStroker.displayName = 'SpriteStroker';
    var prototype = SpriteStroker.prototype, constructor = SpriteStroker;
    SpriteStroker.loaders = {
      xml: loaders.XML,
      json: loaders.JSON,
      bin: loaders.Binary,
      txt: loaders.Scanline
    };
    function SpriteStroker(str, options){
      var promises, res$, i$, ref$, len$, ch, this$ = this;
      this.play = bind$(this, 'play', prototype);
      options = $.extend({
        autoplay: false,
        width: 215,
        height: 215,
        loop: false,
        preload: 4,
        poster: '',
        url: './json/',
        dataType: 'json',
        speed: 5000,
        strokeDelay: 0.2,
        charDelay: 1,
        arrows: false,
        debug: false
      }, options);
      this.autoplay = options.autoplay;
      this.loop = options.loop;
      this.preload = options.preload;
      this.width = options.width;
      this.height = options.height;
      this.posters = options.posters;
      this.url = options.url;
      this.dataType = options.dataType;
      this.arrows = options.arrows;
      this.debug = options.debug;
      this.domElement = document.createElement('canvas');
      this.domElement.width = this.width;
      this.domElement.height = this.height;
      this.strokeGap = {
        speed: options.speed,
        delay: options.strokeDelay,
        objs: [],
        update: function(){
          var i$, ref$, len$, o;
          for (i$ = 0, len$ = (ref$ = this.objs).length; i$ < len$; ++i$) {
            o = ref$[i$];
            o.computeLength();
            o.parent.childrenChanged();
          }
        }
      };
      this.charGap = {
        speed: options.speed,
        delay: options.charDelay,
        objs: [],
        update: function(){
          var i$, ref$, len$, o;
          for (i$ = 0, len$ = (ref$ = this.objs).length; i$ < len$; ++i$) {
            o = ref$[i$];
            o.computeLength();
            o.parent.childrenChanged();
          }
        }
      };
      Object.defineProperty(this, 'speed', {
        set: function(it){
          var x$, y$;
          x$ = this.strokeGap;
          x$.speed = it;
          x$.update();
          y$ = this.charGap;
          y$.speed = it;
          y$.update();
          return this.strokeGap.speed;
        },
        get: function(){
          return this.strokeGap.speed;
        }
      });
      Object.defineProperty(this, 'strokeDelay', {
        set: function(it){
          var x$;
          x$ = this.strokeGap;
          x$.delay = it;
          x$.update();
          return this.strokeGap.delay;
        },
        get: function(){
          return this.strokeGap.delay;
        }
      });
      Object.defineProperty(this, 'charDelay', {
        set: function(it){
          var x$;
          x$ = this.charGap;
          x$.delay = it;
          x$.update();
          return this.charGap.delay;
        },
        get: function(){
          return this.charGap.delay;
        }
      });
      res$ = [];
      for (i$ = 0, len$ = (ref$ = str.sortSurrogates()).length; i$ < len$; ++i$) {
        ch = ref$[i$];
        res$.push(constructor.loaders[this.dataType](this.url + "" + ch.codePointAt().toString(16) + "." + this.dataType));
      }
      promises = res$;
      this.arrowList = [];
      Q.all(promises).then(function(it){
        var chars, arrowGroupGroup, i, charData, strokes, arrows, count, arrowSize, j, data, stroke, arrow, x$, gap, char, arrowGroup, y$, z$, step, lresult$, pairs, a, i$, len$, p, e, z1$, results$ = [];
        chars = [];
        arrowGroupGroup = [];
        for (i in it) {
          charData = it[i];
          strokes = [];
          arrows = [];
          count = charData.length / 2;
          arrowSize = (2150 - count * 40) / count;
          for (j in charData) {
            data = charData[j];
            if (this$.dataType === 'txt') {
              stroke = new ScanlineStroke(data);
              arrow = new Hint(hintDataFromScanline(data));
            } else {
              stroke = new Stroke(data);
              arrow = new Hint(hintDataFromMOE(data));
            }
            strokes.push(stroke);
            x$ = arrow;
            x$.x = stroke.x;
            x$.y = stroke.y;
            x$.text = +j + 1;
            x$.size = Math.min(arrow.size, arrowSize);
            x$.length = stroke.length;
            x$.step = 0;
            x$.computeOffset(0);
            arrows.push(arrow);
            this$.arrowList.push(arrow);
            if (+j === it.length - 1) {
              continue;
            }
            gap = new Empty(this$.strokeGap);
            this$.strokeGap.objs.push(gap);
            strokes.push(gap);
            gap = new Empty(this$.strokeGap);
            this$.strokeGap.objs.push(gap);
            arrows.push(gap);
          }
          char = new Comp(strokes);
          arrowGroup = new Comp(arrows);
          char.x = 2150 * +i;
          arrowGroup.x = char.x;
          chars.push(char);
          arrowGroupGroup.push(arrowGroup);
          if (+i === it.length - 1) {
            continue;
          }
          gap = new Empty(this$.charGap);
          this$.charGap.objs.push(gap);
          chars.push(gap);
          gap = new Empty(this$.charGap);
          this$.charGap.objs.push(gap);
          arrowGroupGroup.push(gap);
        }
        y$ = this$.sprite = new Comp(chars);
        y$.scaleX = this$.width / 2150;
        y$.scaleY = this$.height / 2150;
        z$ = this$.arrowSprite = new Comp(arrowGroupGroup);
        z$.scaleX = this$.width / 2150;
        z$.scaleY = this$.height / 2150;
        this$.domElement.width = this$.width * promises.length;
        /**/
        step = 0.05;
        do {
          lresult$ = [];
          pairs = zhStrokeData.AABB.hit((fn$.call(this$)));
          for (i$ = 0, len$ = pairs.length; i$ < len$; ++i$) {
            p = pairs[i$];
            e = p[0].entity.angle > p[1].entity.angle
              ? p[0].entity
              : p[1].entity;
            z1$ = e;
            z1$.step += step;
            z1$.computeOffset(e.step);
            lresult$.push(z1$);
          }
          results$.push(lresult$);
        } while (pairs.length !== 0);
        return results$;
        function fn$(){
          var i$, ref$, len$, x$, results$ = [];
          for (i$ = 0, len$ = (ref$ = this.arrowList).length; i$ < len$; ++i$) {
            a = ref$[i$];
            x$ = a.globalAABB();
            x$.entity = a;
            results$.push(x$);
          }
          return results$;
        }
      });
    }
    prototype.videoTracks = 1;
    prototype.autoplay = false;
    prototype.buffered = null;
    prototype.currentTime = 0;
    prototype.defaultPlaybackRate = 1.0;
    prototype.PlaybackRate = 1.0;
    prototype.duration = 0;
    prototype.ended = false;
    prototype.error = null;
    prototype.loop = false;
    prototype.paused = false;
    prototype.played = false;
    prototype.preload = 4;
    prototype.seekable = null;
    prototype.seeking = false;
    prototype.canPlayType = function(str){
      return 'probably' || 'maybe' || '';
    };
    prototype.fastSeek = function(time){
      this.currentTime = time;
    };
    prototype.load = function(){};
    prototype.pause = function(it){
      this.paused = !!it;
    };
    prototype.play = function(){
      var ctx, step, ref$;
      if (this.sprite) {
        this.domElement.width = this.domElement.width;
        ctx = this.domElement.getContext('2d');
        this.sprite.render(ctx, this.debug);
        if (this.arrows) {
          this.arrowSprite.render(ctx, this.debug);
        }
        step = this.speed * 1 / 60;
        this.sprite.time += step / this.sprite.length;
        if (this.arrows) {
          this.arrowSprite.time = this.sprite.time;
        }
        this.currentTime = this.sprite.time * this.sprite.length / this.speed;
      }
      if (!this.paused && ((ref$ = this.sprite) != null ? ref$.time : void 8) < 1) {
        requestAnimationFrame(this.play);
      }
    };
    prototype.width = 0;
    prototype.height = 0;
    prototype.videoWidth = 0;
    prototype.videoHeight = 0;
    prototype.poster = 0;
    return SpriteStroker;
  }());
  x$ = (ref$ = window.zhStrokeData) != null
    ? ref$
    : window.zhStrokeData = {};
  x$.SpriteStroker = SpriteStroker;
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
