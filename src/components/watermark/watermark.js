'use strict'

let watermark = {}

let setWatermark = (str) => {
  let id = '1.23452384164.123412415'

  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }

  let can = document.createElement('canvas')
  can.width = 400
  can.height = 200

  let cans = can.getContext('2d')
  cans.rotate(-20 * Math.PI / 180)
  cans.font = '15px Vedana'
  cans.fillStyle = 'rgba(170, 170, 170, 0.70)'
  cans.textAlign = 'left'
  cans.textBaseline = 'Middle'
  // cans.fillText(str, can.width / 3, can.height / 2)
  var chr = str.split("");
  var temp = "";
  var row = [];

  for (var a = 0; a < chr.length; a++) {
    if (cans.measureText(temp).width < 200) {;
    } else {
        row.push(temp);
        temp = "";
    }
    temp += chr[a];
}

row.push(temp);
for (var b = 0; b < row.length; b++) {
  cans.fillText(row[b], 100, 160 + (b + 1) * 20);
}


  let div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none'
  div.style.top = '0px'
  div.style.left = '0px'
  div.style.bottom = '0px'
  div.style.position = 'fixed'
  div.style.zIndex = '999'
//  div.style.width = document.documentElement.clientWidth - 100 + 'px'
//  div.style.height = document.documentElement.clientHeight - 100 + 'px'
  div.style.width = '100%';
  div.style.height = '100%';
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  document.body.appendChild(div)
  return id
}
// 该方法只允许调用一次
watermark.set = (str) => {
  let id = setWatermark(str)
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(str)
    }
  }, 500)
  window.onresize = () => {
    setWatermark(str)
  }
}

export default watermark
