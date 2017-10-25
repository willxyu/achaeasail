
/* 
  requires topojson
 */

asm = typeof asm !== 'undefined' ? asm : {}

asm.hover = asm.hover || false

asm.copy = function(obj) { var c; if (null == obj || 'object' != typeof obj) return obj; if (obj instanceof Date) { c = new Date(); c.setTime(obj.getTime()); return c }; if (obj instanceof Array) { c = []; for (var i=0;i<obj.length;i++) { c[i] = asm.copy(obj[i]) }; return c }; if (obj instanceof Object) { c = {}; for (var attr in obj) { if (obj.hasOwnProperty(attr)) { c[attr] = asm.copy(obj[attr]) } }; return c }; throw new Error('Unable to copy obj! Type not supported.'); }

asm.draw = function(context, transform, data) {
  var path = d3.geoPath().context(context)
  var r    = transform
  data.transform.scale = [ opt_unitWidth * r.k, opt_unitHeight * r.k ]
  data.transform.translate = r.apply([0,0])
  asm.grid(context, r)
  asm.drawtype( context, path, data, 'reefs', 'rgba( 100, 130, 180, 0.55)' )
  asm.drawtype( context, path, data, 'marsh', 'rgba(  55, 140, 135, 0.88)' )
  asm.drawtype( context, path, data, 'grass', 'rgba(  65, 150,  65, 0.85)' )
  asm.drawtype( context, path, data, 'mount', 'rgba( 100,  70,  35, 0.85)', true )
  asm.drawtype( context, path, data, 'swamp', 'rgba(  10,  60,  30, 0.85)', true )
  asm.drawtype( context, path, data, 'lowmt', 'rgba( 130, 100,  70, 0.65)' )
  asm.drawtype( context, path, data, 'nnnbb', 'rgba(  85,  55,   1, 0.65)', true )
  asm.drawtype( context, path, data, 'nnnbr', 'rgba( 165, 135, 100, 0.75)' )
  asm.drawtype( context, path, data, '___br', 'rgba( 200, 180, 145, 0.65)' )
  asm.drawtype( context, path, data, '...wt', 'rgba( 200, 200, 215, 0.65)' )
  asm.drawtype( context, path, data, 'hshbl', 'rgba( 165, 185, 215, 0.35)', true )
  asm.drawtype( context, path, data, 'WWbwn', 'rgba( 200,  75,  85, 0.55)', true )
  asm.drawtype( context, path, data, 'YYred', 'rgba( 215,  25,   5, 0.35)', true )
  asm.drawtype( context, path, data, '__blk', 'rgba(  15,  15,  15, 0.75)', true )

  asm.drawpoint(context, r, [   0,   0]) 
  asm.drawpoint(context, r, [ -25, -61]) 
  asm.drawpoint(context, r, [ 173, -14]) 
  asm.drawpoint(context, r, [ 282, -38]) 
  asm.drawpoint(context, r, [ 364,-139])
  asm.drawpoint(context, r, [ 366,-180])
  asm.drawpoint(context, r, [ 376,-234])
  asm.drawpoint(context, r, [ 435, -59])
  asm.drawpoint(context, r, [ 344,-356])
  asm.drawpoint(context, r, [ 215,-579])
  asm.drawpoint(context, r, [ 299,-645])
  asm.drawpoint(context, r, [ -98,-412])
  asm.drawpoint(context, r, [  46,-486])
  asm.drawpoint(context, r, [  69,-430])
  asm.drawpoint(context, r, [  32,-338])
  asm.drawpoint(context, r, [-123,-288])
  asm.drawpoint(context, r, [ -15,-204])
  asm.drawpoint(context, r, [  53, -84])
}

asm.drawpoint = function(context, transform, coordinates) {
  var c = context
  var p = coordinates
  var r = transform
  var radius = opt_hoverRadius
  
  p[0] *= opt_unitWidth
  p[1] *= opt_unitHeight
  p = r.apply(p)
  c.closePath()
  c.beginPath()
  c.moveTo( p[0], p[1])
  c.arc( p[0], p[1], radius, 0, 2 * Math.PI )
  c.fillStyle = 'rgba( 190, 100,  55, 1)'
  c.fill()
  c.closePath()
}

asm.drawtype = function(context,path,data,objt,fill,noborder) {
  var fill = fill || 'rgba(155,155,155,0.75)'
  var c = context
  c.closePath()
  c.beginPath()
  var f = topojson.feature( data, data.objects[objt] ).features
  for (var i=0; i < f.length; i++) { path( f[i].geometry ) }

  if (noborder) {
   c.lineWidth = 0
  } else { 
   c.lineWidth = 2
   c.stroke()
  }
  c.fillStyle = fill
  c.fill()
  c.closePath()
}

asm.mouseCartesian = function(transform,event,canvasdimension) {
  var r = transform
  var e = event
  var f = canvasdimension
  var w = opt_unitWidth
  var h = opt_unitHeight
  
  var x = (e.clientX - f.left - r.x) / (w * r.k)
  var y = (e.clientY - f.top  - r.y) / (h * r.k)
  y = y * -1
  return [x,y]
}

asm.mousehover = function(transform,event,canvasdimension) {
 $('#tooltip').remove()
 var uh = opt_unitHeight
 var uw = opt_unitWidth
 var rd = opt_hoverRadius
 var r  = transform
 var e  = event
 var f  = canvasdimension
 var points = [
  { coordinates: [   0,  0], id: 'Shala-Khulia', },
  { coordinates: [ -25, 61], id: 'Polyargos', },
  { coordinates: [ 173, 14], id: 'Sea Lion Cove', },
  { coordinates: [ 282, 38], id: 'New Hope', },
  { coordinates: [ 364,139], id: 'Shastaan', },
  { coordinates: [ 366,180], id: 'Eastern Shore', },
  { coordinates: [ 376,234], id: 'Targossas', },
  { coordinates: [ 435, 59], id: 'Zanzibaar', },
  { coordinates: [ 344,356], id: "Tasur'ke", },
  { coordinates: [ 215,579], id: 'Tenwat', },
  { coordinates: [ 299,645], id: 'Valho', },
  { coordinates: [ -98,412], id: 'Rheodad', },
  { coordinates: [  46,486], id: 'Phereklos', },
  { coordinates: [ -15,204], id: 'Thraasi', },
  { coordinates: [  53, 84], id: 'Aalen', },
 ]
 var tc = copy(asm.data.tradeColours)
 
 var b = false
 for (var i=0;i<points.length;i++) {
  var t = asm.copy(points[i].coordinates)
  t[0] *= uw
  t[1] *= uh
  t[1] *= -1     // flip y-axis
  t = r.apply(t)
  t[0] += f.left
  t[1] += f.top
  var hover = asm.testhover(e,t,rd)  // !important
  
  // This is predominantly UI stuff
  if (hover) { 
    // log('Hovering over '+points[i].coordinates[0]+', '+points[i].coordinates[1])
    asm.hover = true
    var d =''
    d += '<div id="tooltip" style="position:absolute; left: '+(e.clientX + 20)+'px;'
    d += 'top: '+(e.clientY + 20)+'px; ">'
    d += points[i].id
    // trade data
     
     if (asm.data.poi[points[i].id]) {
      var tx = asm.data.poi[points[i].id]
      tx = tx.trades || {}
      // log(tx)
      for (var k in tx) {
       var txk = tx[k]
       for (var j=0;j<txk.length;j++) {
        var qo = txk[j].lose
        var o  = txk[j].cost
        var co = tc[o] || 'rgba(202,202,202,1)'
        var ci = tc[k] || 'rgba(190,190,190,1)'
        var qi = txk[j].receive
        d += '<div class="trade" style="white-space:pre-wrap;">  '
        d += '<span style="color:rgba(255,255,255,1);">'+qo+' </span>' // 3
        d += '<span style="color:'+co+';">'+o+' </span>'
        d += 'for '
        d += '<span style="color:rgba(255,255,255,1);">'+qi+' </span>' // 2
        d += '<span style="color:'+ci+';">'+k+'</span>'
        // 3 glass for 2 incense
       }
      }
     }
    
    d += '</div>'
    $('body').append(d)
    $('canvas').css('cursor','pointer')
    
    b = true
    break }
 }
 if (!b) { 
    asm.hover = false
    $('canvas').css('cursor','default') }
 
}

asm.testhover = function(event,scaled,radius) {
 var e  = event
   var mx = e.clientX
   var my = e.clientY
 var t  = scaled
 var rd = radius
 
 var upperX = t[0] + rd
 var lowerX = t[0] - rd
 var upperY = t[1] + rd
 var lowerY = t[1] - rd
 // log('The range is ('+lowerX+' - '+lowerY+', '+lowerY+' - '+upperY+')')
 
 if (mx <= upperX && mx >= lowerX && my <= upperY && my >= lowerY) { return true }
 return false
}

asm.grid = function(context,zoom) {
  var c  = context
  var r  = zoom
  var n  = opt_gridnum || 445
  var uh = opt_unitHeight || 7
  var uw = opt_unitWidth  || 4

  c.beginPath()
  var fr = 1
  switch (true) {
    case (r.k < 0.05): fr = 100; break;
    case (r.k < 0.15): fr =  50; break;
    case (r.k < 0.35): fr =  20; break;
    case (r.k < 0.80): fr =  10; break;
    case (r.k < 2.00): fr =   5; break;
    default: fr = 1; break; }

  var belowMe = Math.floor(uh / 2)
  for (var DTU=0; DTU>-n; DTU -= (uh * fr)) {
    var j = DTU + belowMe
    var a = r.apply([ -n, j])
    var b = r.apply([  n, j])
    c.moveTo( a[0], a[1] )
    c.lineTo( b[0], b[1] ) }
  for (var UTD=0; UTD<n; UTD += (uh * fr)) {
    var j = UTD + belowMe
    var a = r.apply([ -n, j])
    var b = r.apply([  n, j])
    c.moveTo( a[0], a[1] )
    c.lineTo( b[0], b[1] ) }
  var leftOfMe = Math.floor(uw / 2)
  for (var LTR=0; LTR<n; LTR += (uw * fr)) {
    var j = LTR - leftOfMe
    var a = r.apply([ j, -n])
    var b = r.apply([ j,  n])
    c.moveTo( a[0], a[1] )
    c.lineTo( b[0], b[1] ) }
  for (var RTL=0; RTL>-n; RTL -= (uw * fr)) {
    var j = RTL - leftOfMe
    var a = r.apply([ j, -n])
    var b = r.apply([ j,  n])
    c.moveTo( a[0], a[1] )
    c.lineTo( b[0], b[1] ) }
  c.lineWidth = 1;
  c.strokeStyle='rgba(155,155,155,0.85)';
  c.strokeStyle='rgba( 15, 35, 75,0.45)';
  c.stroke();
}

