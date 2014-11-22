// Generated by LiveScript 1.3.1
(function(){
  var React, AABB, ref$, svg, g, path, defs, clipPath, T, FT, S, FS, W;
  React = require('react');
  AABB = (function(){
    AABB.displayName = 'AABB';
    var axises, scan, prototype = AABB.prototype, constructor = AABB;
    axises = ['x', 'y'];
    scan = function(group, axis){
      var points, i$, len$, box, groups, g, d, p;
      switch (false) {
      case !!Array.isArray(group):
        throw new Error('first argument should be an array');
      case group[0].min[axis] !== undefined:
        throw new Error('axis not found');
      default:
        points = [];
        for (i$ = 0, len$ = group.length; i$ < len$; ++i$) {
          box = group[i$];
          if (!box.isEmpty()) {
            points.push({
              box: box,
              value: box.min[axis],
              depth: 1
            });
            points.push({
              value: box.max[axis],
              depth: -1
            });
          }
        }
        points.sort(function(a, b){
          switch (false) {
          case !(a.value < b.value):
            return -1;
          case a.value !== b.value:
            return 0;
          case !(a.value > b.value):
            return 1;
          }
        });
        groups = [];
        g = [];
        d = 0;
        for (i$ = 0, len$ = points.length; i$ < len$; ++i$) {
          p = points[i$];
          d += p.depth;
          if (d !== 0) {
            if (p.box) {
              g.push(p.box);
            }
          } else {
            groups.push(g);
            g = [];
          }
        }
        return groups;
      }
    };
    AABB.rdc = function(g, todo){
      var results, res$, i$, len$, axis, gs, next;
      todo == null && (todo = axises.slice());
      switch (false) {
      case !!Array.isArray(g):
        throw new Error('first argument should be an array');
      default:
        res$ = [];
        for (i$ = 0, len$ = todo.length; i$ < len$; ++i$) {
          axis = todo[i$];
          gs = scan(g, axis);
          if (gs.length > 1) {
            next = axises.slice();
            next.splice(next.indexOf(axis), 1);
            res$.push(Array.prototype.concat.apply([], (fn$.call(this))));
          } else {
            res$.push(gs);
          }
        }
        results = res$;
        return results.reduce(function(c, n){
          if (c.length > n.length) {
            return c;
          } else {
            return n;
          }
        });
      }
      function fn$(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = gs).length; i$ < len$; ++i$) {
          g = ref$[i$];
          results$.push(this.rdc(g, next));
        }
        return results$;
      }
    };
    AABB.collide = function(it){
      var result, i$, to$, i, j$, to1$, j;
      switch (false) {
      case !!Array.isArray(it):
        throw new Error('first argument should be an array');
      default:
        result = [];
        for (i$ = 0, to$ = it.length; i$ < to$; ++i$) {
          i = i$;
          for (j$ = i + 1, to1$ = it.length; j$ < to1$; ++j$) {
            j = j$;
            if (it[i].intersect(it[j])) {
              result.push([it[i], it[j]]);
            }
          }
        }
        return result;
      }
    };
    AABB.hit = function(it){
      var g;
      switch (false) {
      case !!Array.isArray(it):
        throw new Error('first argument should be an array');
      default:
        return Array.prototype.concat.apply([], (function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = this.rdc(it)).length; i$ < len$; ++i$) {
            g = ref$[i$];
            results$.push(this.collide(g));
          }
          return results$;
        }.call(this)));
      }
    };
    function AABB(min, max){
      this.min = min != null
        ? min
        : {
          x: Infinity,
          y: Infinity
        };
      this.max = max != null
        ? max
        : {
          x: -Infinity,
          y: -Infinity
        };
      if (isNaN(this.min.x)) {
        this.min.x = Infinity;
      }
      if (isNaN(this.min.y)) {
        this.min.y = Infinity;
      }
      if (isNaN(this.max.x)) {
        this.max.x = -Infinity;
      }
      if (isNaN(this.max.y)) {
        this.max.y = -Infinity;
      }
    }
    Object.defineProperty(prototype, 'width', {
      get: function(){
        return this.max.x - this.min.x;
      },
      configurable: true,
      enumerable: true
    });
    Object.defineProperty(prototype, 'height', {
      get: function(){
        return this.max.y - this.min.y;
      },
      configurable: true,
      enumerable: true
    });
    Object.defineProperty(prototype, 'size', {
      get: function(){
        return this.width * this.height;
      },
      configurable: true,
      enumerable: true
    });
    prototype.isEmpty = function(){
      return this.min.x >= this.max.x || this.min.y >= this.max.y;
    };
    prototype.clone = function(){
      return new AABB(this.min, this.max);
    };
    prototype.transform = function(m00, m01, m10, m11, m20, m21){
      var aabb;
      aabb = new AABB({
        x: m00 * this.min.x + m10 * this.min.y + m20,
        y: m01 * this.min.x + m11 * this.min.y + m21
      }, {
        x: m00 * this.max.x + m10 * this.max.y + m20,
        y: m01 * this.max.x + m11 * this.max.y + m21
      });
      return aabb;
    };
    prototype.addPoint = function(pt){
      if (pt.x < this.min.x) {
        this.min.x = pt.x;
      }
      if (pt.y < this.min.y) {
        this.min.y = pt.y;
      }
      if (pt.x > this.max.x) {
        this.max.x = pt.x;
      }
      if (pt.y > this.max.y) {
        this.max.y = pt.y;
      }
    };
    prototype.addBox = function(aabb){
      if (aabb.min.x < this.min.x) {
        this.min.x = aabb.min.x;
      }
      if (aabb.min.y < this.min.y) {
        this.min.y = aabb.min.y;
      }
      if (aabb.max.x > this.max.x) {
        this.max.x = aabb.max.x;
      }
      if (aabb.max.y > this.max.y) {
        this.max.y = aabb.max.y;
      }
    };
    prototype.containPoint = function(pt){
      var ref$;
      return (this.min.x < (ref$ = pt.x) && ref$ < this.max.x) && (this.min.y < (ref$ = pt.y) && ref$ < this.max.y);
    };
    prototype.intersect = function(it){
      return this.min.x <= it.max.x && this.max.x >= it.min.x && this.min.y <= it.max.y && this.max.y >= it.min.y;
    };
    prototype.render = function(ctx, color, width){
      var x$;
      color == null && (color = '#f90');
      width == null && (width = 10);
      if (this.isEmpty()) {
        return;
      }
      x$ = ctx;
      x$.strokeStyle = color;
      x$.lineWidth = width;
      x$.beginPath();
      x$.rect(this.min.x, this.min.y, this.width, this.height);
      x$.stroke();
    };
    return AABB;
  }());
  ref$ = React.DOM, svg = ref$.svg, g = ref$.g, path = ref$.path, defs = ref$.defs, clipPath = ref$.clipPath;
  T = React.createClass({
    getDefaultProps: function(){
      return {
        data: {
          bgn: {
            x: 0,
            y: 0,
            length: 0
          },
          end: {
            x: 0,
            y: 0
          }
        },
        x: 0,
        y: 0,
        progress: Infinity
      };
    },
    render: function(){
      var ref$, bgn, end, progress, ratio, dx, dy, track, valid;
      console.log('Track');
      ref$ = this.props.data, bgn = ref$.bgn, end = ref$.end;
      progress = this.props.progress;
      if (progress < 0) {
        progress = 0;
      }
      if (progress > bgn.length) {
        progress = bgn.length;
      }
      ratio = progress / bgn.length;
      dx = (end.x - bgn.x) * ratio;
      dy = (end.y - bgn.y) * ratio;
      track = "M" + bgn.x + " " + bgn.y + " L" + (bgn.x + dx) + " " + (bgn.y + dy);
      valid = !isNaN(ratio) && ratio !== Infinity;
      return g({
        x: this.props.x,
        y: this.props.y
      }, path({
        d: valid ? track : 'M0 0 L0 0',
        fill: 'transparent',
        stroke: '#000',
        strokeWidth: valid ? bgn.size || 250 : 0,
        strokeLinecap: 'round'
      }));
    }
  });
  FT = React.createFactory(T);
  S = React.createClass({
    getDefaultProps: function(){
      return {
        data: {
          outline: [],
          track: [],
          length: 0
        },
        x: 0,
        y: 0,
        progress: Infinity
      };
    },
    injectClipPath: function(){
      return this.refs.stroke.getDOMNode().setAttribute('clip-path', "url(#" + this.id + ")");
    },
    componentDidMount: function(){
      return this.injectClipPath.apply(this, arguments);
    },
    componentDidUpdate: function(){
      return this.injectClipPath.apply(this, arguments);
    },
    render: function(){
      var length, progress, outline, res$, i$, ref$, len$, cmd, track, i, bgn, end, comp;
      console.log('Stroke');
      length = this.props.data.length;
      progress = this.props.progress;
      if (progress < 0) {
        progress = 0;
      }
      if (progress > length) {
        progress = length;
      }
      res$ = [];
      for (i$ = 0, len$ = (ref$ = this.props.data.outline).length; i$ < len$; ++i$) {
        cmd = ref$[i$];
        switch (cmd.type) {
        case 'M':
          res$.push("M " + cmd.x + " " + cmd.y);
          break;
        case 'L':
          res$.push("L " + cmd.x + " " + cmd.y);
          break;
        case 'Q':
          res$.push("Q " + cmd.begin.x + " " + cmd.begin.y + ", " + cmd.end.x + " " + cmd.end.y);
          break;
        case 'C':
          res$.push("C " + cmd.begin.x + " " + cmd.begin.y + ", " + cmd.mid.x + " " + cmd.mid.y + ", " + cmd.end.x + " " + cmd.end.y);
        }
      }
      outline = res$;
      outline = outline.join(' ') + " Z";
      this.id = outline.replace(new RegExp(' ', 'g'), '%20');
      track = this.props.data.track;
      return g({
        ref: 'stroke',
        x: this.props.x,
        y: this.props.y
      }, defs({}, React.createElement('clipPath', {
        id: this.id
      }, path({
        d: outline,
        fill: '#F00'
      }))), (function(){
        var i$, to$, results$ = [];
        for (i$ = 0, to$ = track.length - 1; i$ < to$; ++i$) {
          i = i$;
          bgn = track[i];
          end = track[i + 1];
          comp = FT({
            key: i,
            data: {
              bgn: bgn,
              end: end
            },
            progress: progress
          });
          progress -= bgn.length;
          results$.push(comp);
        }
        return results$;
      }()));
    }
  });
  FS = React.createFactory(S);
  W = React.createClass({
    getDefaultProps: function(){
      return {
        data: {
          word: [],
          length: 0
        },
        x: 0,
        y: 0,
        width: 410,
        height: 410,
        progress: Infinity
      };
    },
    render: function(){
      var ref$, length, word, progress, i, stroke, comp;
      ref$ = this.props.data, length = ref$.length, word = ref$.word;
      progress = this.props.progress;
      if (progress < 0) {
        progress = 0;
      }
      if (progress > length) {
        progress = length;
      }
      return svg({
        width: this.props.width,
        height: this.props.height,
        viewBox: "0 0 2050 2050",
        version: 1.1,
        xmlns: '"http://www.w3.org/2000/svg'
      }, g({
        x: this.props.x,
        y: this.props.y
      }, (function(){
        var ref$, results$ = [];
        for (i in ref$ = word) {
          stroke = ref$[i];
          comp = FS({
            key: i,
            data: stroke,
            progress: progress
          });
          progress -= stroke.length;
          results$.push(comp);
        }
        return results$;
      }())));
    }
  });
  /**
  class Empty extends Comp
    (@data) -> super!
    computeLength: ->
      @length = @data.speed * @data.delay
    computeAABB: ->
      @aabb = new AABB
    render: ~>
  
  class Track extends Comp
    (@data, @options = {}) ->
      # TODO: should mv init value out here
      @options.trackWidth or= 150px
      @data.size or= @options.trackWidth
      super!
    computeLength: ->
      @length = Math.sqrt @data.vector.x * @data.vector.x + @data.vector.y * @data.vector.y
    computeAABB: ->
      @aabb = new AABB {
        x: @data.x
        y: @data.y
      },{
        x: @data.x + @data.vector.x
        y: @data.y + @data.vector.y
      }
    doRender: (ctx) !->
      ctx
        ..beginPath!
        ..strokeStyle = \#000
        ..fillStyle = \#000
        ..lineWidth = 4 * @data.size
        ..lineCap = \round
        ..moveTo @data.x, @data.y
        ..lineTo do
          @data.x + @data.vector.x * @time
          @data.y + @data.vector.y * @time
        ..stroke!
  
  class Stroke extends Comp
    (data) ->
      console.log data
      children = []
      for i from 1 til data.track.length
        prev = data.track[i-1]
        current = data.track[i]
        children.push new Track do
          x: prev.x
          y: prev.y
          vector:
            x: current.x - prev.x
            y: current.y - prev.y
          size: prev.size
      @outline = data.outline
      super children
    computeAABB: ->
      @aabb = new AABB
      for path in @outline
        if path.x isnt undefined
          @aabb.addPoint path
        if path.end isnt undefined
          @aabb.addPoint path.begin
          @aabb.addPoint path.end
        if path.mid isnt undefined
          @aabb.addPoint path.mid
      @aabb
    pathOutline: (ctx) !->
      for path in @outline
        switch path.type
          when \M
            ctx.moveTo path.x, path.y
          when \L
            ctx.lineTo path.x, path.y
          when \C
            ctx.bezierCurveTo do
              path.begin.x, path.begin.y,
              path.mid.x, path.mid.y,
              path.end.x, path.end.y
          when \Q
            ctx.quadraticCurveTo do
              path.begin.x, path.begin.y,
              path.end.x, path.end.y
    beforeRender: (ctx) !->
      super ctx
      ctx
        ..save!
        ..beginPath!
      @pathOutline ctx
      ctx.clip!
    afterRender: (ctx) !->
      ctx.restore!
      super ctx
  
  class ScanlineTrack extends Comp
    (@data) ->
      super!
      @scale-x = @scale-y = 2
      # FIXME: rethink the workflow in super
      @computeAABB!
      @length *= 2
    computeLength: ->
      @length = @data.lines.length
    computeAABB: ->
      direction = @data.direction
      @aabb = new AABB
      for { idx, start, end } in @data.lines
        if direction is 0 # vertical
          @aabb.addBox new AABB {
            x: start * @scale-x + @x
            y: idx   * @scale-y + @y
          }, {
            x: end       * @scale-x + @x
            y: (idx + 1) * @scale-y + @y
          }
        else if direction is 1 # horizontal
          @aabb.addBox new AABB {
            x: idx   * @scale-x + @x
            y: start * @scale-y + @y
          }, {
            x: (idx + 1) * @scale-x + @x
            y: end       * @scale-y + @y
          }
      @aabb
    doRender: (ctx) !->
      direction = @data.direction
      ctx
        ..beginPath!
        ..fillStyle = \#000
      for i from 0 til ~~(@data.lines.length * @time)
        { idx, start, end } = @data.lines[i]
        if direction is 0
          ctx.fillRect do
            start     * @scale-x + @x
            (idx - 1) * @scale-y + @y
            (end - start) * @scale-x
            @scale-y * 2
        else if direction is 1
          ctx.fillRect do
            (idx - 1) * @scale-x + @x
            start     * @scale-y + @y
            @scale-x * 2
            (end - start) * @scale-y
  
  class ScanlineStroke extends Comp
    (data) ->
      children = for track in data
        new ScanlineTrack track
      super children
  
  class Arrow extends Comp
    (@stroke, @index) ->
      max = stroke.children.reduce (c, n) ->
        if c.length > n.length then c else n
      @track0 = stroke.children.0
      var track
      for t in stroke.children
        if t.length > max.length / 2.5
          track = t
          break
      data = track.data
      @offset =
        x: 0
        y: 0
      @vector =
        x: data.vector.x / track.length
        y: data.vector.y / track.length
      @angle = Math.atan2(@vector.y, @vector.x)
      angle = if Math.PI/2 > @angle >= - Math.PI/2 then @angle - Math.PI/2 else @angle + Math.PI/2
      @up =
        x: Math.cos angle
        y: Math.sin angle
      @dir = 1
      @size = 160
      super!
      @computeOffset 0
      @x = stroke.x + @track0.data.x
      @y = stroke.y + @track0.data.y
    computeLength: ->
      @length = @stroke.length
    computeAABB: ->
      @aabb = new AABB
      @aabb.addPoint do
        x: @offset.x
        y: @offset.y
      @aabb.addPoint do
        x: @offset.x + @size * @vector.x
        y: @offset.y + @size * @vector.y
      @aabb.addPoint do
        x: @offset.x + @vector.x * @size * 0.5 + (if @dir >= 0 then 1 else -1) * @up.x * @size * 0.5
        y: @offset.y + @vector.y * @size * 0.5 + (if @dir >= 0 then 1 else -1) * @up.y * @size * 0.5
      @aabb
    ##
    # At first, move the arrow forward,         (0 <= it < 1)
    # if still collide, swap to the other side. (1 <= it)
    computeOffset: ->
      it = +it
      if it < 0
        it = 0
      else if it < 1
        @dir = 1
      else
        @dir = -~~(it - 1) - 1
      p = Math.abs it
      percent = p - ~~p
      @offset
        ..x = @dir * @track0.data.size * @up.x / 2 + percent * @size * @vector.x
        ..y = @dir * @track0.data.size * @up.y / 2 + percent * @size * @vector.y
      @computeAABB!
    #render: !-> super it, on
    drawArrow: (ctx, color = \#c00, width = 16, bold = no) !->
      ctx
        ..lineCap = \round
        ..strokeStyle = color
        ..lineWidth = width
        ..beginPath!
        ..moveTo @offset.x, @offset.y
        ..lineTo do
          @offset.x + @vector.x * @size * 0.66
          @offset.y + @vector.y * @size * 0.66
        ..stroke!
        ..fillStyle = color
        ..beginPath!
        ..moveTo do
          @offset.x + @vector.x * @size * 0.66
          @offset.y + @vector.y * @size * 0.66
        ..lineTo do
          @offset.x + @vector.x * @size
          @offset.y + @vector.y * @size
        ..lineTo do
          @offset.x + @vector.x * @size * 0.66 + (if @dir >= 0 then 1 else -1) * @up.x * @size * 0.25
          @offset.y + @vector.y * @size * 0.66 + (if @dir >= 0 then 1 else -1) * @up.y * @size * 0.25
        ..stroke!
        ..fill!
        ..font = "#{@size*2/3}px sans-serif" + if bold then ' bold' else ''
        ..textAlign = \center
        ..textBaseline = \middle
        ..fillText do
          @index
          @offset.x + @vector.x * @size * 0.33 + (if @dir >= 0 then 1 else -1) * @up.x * @size * 0.33
          @offset.y + @vector.y * @size * 0.33 + (if @dir >= 0 then 1 else -1) * @up.y * @size * 0.33
    doRender: (ctx) !->
      @drawArrow ctx, \#fff, 32, yes
      @drawArrow ctx
  
  hintDataFromMOE = (data) ->
    vectors = for i from 1 til data.track.length
      c = data.track[i-1]
      n = data.track[i]
      x = n.x - c.x
      y = n.y - c.y
      length = Math.sqrt x * x + y * y
      { x, y, length }
    max = vectors.reduce (c, n) -> if c.length > n.length then c else n
    var track
    for v in vectors
      if v.length > max.length / 2.5
        track = v
        break
    x: data.track.0.x
    y: data.track.0.y
    track: track
    guideline: vectors.0
  
  # TODO
  hintDataFromScanline = (data) ->
    x: 0
    y: 0
    track:
      x: 0
      y: 0
      length: 0
    guideline:
      x: 0
      y: 0
      length: 0
  
  half-pi = Math.PI/2
  class Hint extends Comp
    ({track}:data) ->
      @offset = x: 0, y: 0
      @text = ''
      @dir = 1
      @size = 160
      @computeVectors track
      super!
      # import x, y, track, guideline
      this <<< data
    computeVectors: (track) ->
      @front =
        x: track.x / track.length
        y: track.y / track.length
      rad = Math.atan2 @front.y, @front.x
      rad = if half-pi > rad >= -half-pi then rad - half-pi else rad + half-pi
      @up =
        x: Math.cos rad
        y: Math.sin rad
      { front: @front, up: @up }
    computeLength: ->
      @length = 0 # XXX
    computeAABB: ->
      @aabb = new AABB
      @aabb.addPoint do
        x: @offset.x
        y: @offset.y
      @aabb.addPoint do
        x: @offset.x + @size * @front.x
        y: @offset.y + @size * @front.y
      @aabb.addPoint do
        x: @offset.x + @front.x * @size * 0.5 + @up.x * @size * 0.5
        y: @offset.y + @front.y * @size * 0.5 + @up.y * @size * 0.5
      @aabb
    ##
    # At first, move the arrow forward,         (0 <= it < 1)
    # if still collide, swap to the other side. (1 <= it)
    computeOffset: ->
      it = +it
      if it < 0
        it = 0
      else if it < 1
        @dir = 1
      else
        @dir = -~~(it - 1) - 1
      p = Math.abs it
      percent = p - ~~p
      @offset
        ..x = @dir * @guideline.length * @up.x / 2 + percent * @size * @front.x
        ..y = @dir * @guideline.length * @up.y / 2 + percent * @size * @front.y
      @computeAABB!
    drawArrow: (ctx, color = \#c00, width = 16, bold = no) !->
      ctx
        ..lineCap = \round
        ..strokeStyle = color
        ..lineWidth = width
        ..beginPath!
        ..moveTo @offset.x, @offset.y
        ..lineTo do
          @offset.x + @front.x * @size * 0.66
          @offset.y + @front.y * @size * 0.66
        ..stroke!
        ..fillStyle = color
        ..beginPath!
        ..moveTo do
          @offset.x + @front.x * @size * 0.66
          @offset.y + @front.y * @size * 0.66
        ..lineTo do
          @offset.x + @front.x * @size
          @offset.y + @front.y * @size
        ..lineTo do
          @offset.x + @front.x * @size * 0.66 + (if @dir >= 0 then 1 else -1) * @up.x * @size * 0.25
          @offset.y + @front.y * @size * 0.66 + (if @dir >= 0 then 1 else -1) * @up.y * @size * 0.25
        ..stroke!
        ..fill!
        ..font = "#{@size*2/3}px sans-serif" + if bold then ' bold' else ''
        ..textAlign = \center
        ..textBaseline = \middle
        ..fillText do
          @text
          @offset.x + @front.x * @size * 0.33 + (if @dir >= 0 then 1 else -1) * @up.x * @size * 0.33
          @offset.y + @front.y * @size * 0.33 + (if @dir >= 0 then 1 else -1) * @up.y * @size * 0.33
    doRender: (ctx) !->
      @drawArrow ctx, \#fff, 32, yes
      @drawArrow ctx
  /**/
  import$((ref$ = window.zhStrokeData) != null
    ? ref$
    : window.zhStrokeData = {}, module.exports = {
    W: W,
    S: S,
    T: T
  });
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
