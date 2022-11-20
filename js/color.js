const EL = (sel) => document.querySelector(sel);
const ctx = EL("#canvas").getContext("2d", { willReadFrequently: true });

const ctx_xyz = EL("#canvas_xyz").getContext("2d", { willReadFrequently: true });

var copy_context

const img = new Image();

function readImage() {
  if (!this.files || !this.files[0]) return;

  const FR = new FileReader();
  FR.addEventListener("load", (evt) => {
    img.addEventListener("load", () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.drawImage(img, 0, 0, 500, 500);

      ctx_xyz.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx_xyz.drawImage(img, 0, 0, 500, 500);

      var imageData = ctx_xyz.getImageData(0, 0, EL("#canvas_xyz").width, EL("#canvas_xyz").height)

      copy_context = imageData

      editPixels(imageData.data);

      drawEditedImage(imageData);

    });
    img.src = evt.target.result;
  });
  FR.readAsDataURL(this.files[0]);
}

function xyzToRgb(xyz) {

  let rgb = []

  rgb[0] = 3.2404542 * xyz[0] - 1.5371385 * xyz[1] - 0.4985314 * xyz[2];
  rgb[1] = -0.9692660 * xyz[0] + 1.8760108 * xyz[1] + 0.0415560 * xyz[2];
  rgb[2] = 0.0556434 * xyz[0] - 0.2040259 * xyz[1] + 1.0572252 * xyz[2];

  return rgb;
}

function rgbToXyz(rgb) {
  var xyz = []
  xyz[0] = rgb[0] * 0.4124 + rgb[1] * 0.3576 + rgb[2] * 0.1805;
  xyz[1] = rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  xyz[2] = rgb[0] * 0.0193 + rgb[1] * 0.1192 + rgb[2] * 0.9505;

  return xyz
}

const RGBToHSL = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s
    ? l === r
      ? (g - b) / s
      : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
    : 0;
  return [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ];
};

const HSLToRGB = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
};

// зміна яскравості для пурпурового
function changeLum() {

  let imageData = ctx.getImageData(0, 0, EL("#canvas").width, EL("#canvas").height)
  let imgData = imageData.data
  var luminanceBalance = document.getElementById("lum-range").value
  console.log(luminanceBalance)

  // ітерація по кожному пікселю
  for (var i = 0; i < imgData.length; i += 4) {

    //конвертування в перцептивну модель
    let res = RGBToHSL(imgData[i], imgData[i + 1], imgData[i + 2]);

    // аналіз значень кольору піксела і зміна його атрибуту яскравості
    if (res[0] >= 280 && res[0] <= 310) {
      if (luminanceBalance >= 50) {
        res[2] += res[2] * (luminanceBalance - 50) / 100
      } else {
        res[2] -= res[2] * (50 - luminanceBalance) / 100
      }
    }

    //конветування назад в rgb і відмальовка
    let new_rgb = HSLToRGB(res[0], res[1], res[2]);
    imgData[i] = new_rgb[0];
    imgData[i + 1] = new_rgb[1];
    imgData[i + 2] = new_rgb[2];
  }

  drawEditedImage(imageData)
}

function editPixels(imgData) {
  for (var i = 0; i < imgData.length; i += 4) {
    let rgbpx = []
    rgbpx[0] = imgData[i];
    rgbpx[1] = imgData[i + 1];
    rgbpx[2] = imgData[i + 2];

    let res = rgbToXyz(rgbpx);
    let res_rgb = xyzToRgb(res);

    imgData[i] = res_rgb[0];
    imgData[i + 1] = res_rgb[1];
    imgData[i + 2] = res_rgb[2];
  }
}

function drawEditedImage(newData) {
  var ctxEdited = EL("#canvas_xyz").getContext('2d');
  ctxEdited.putImageData(newData, 0, 0);
}

EL("#fileUpload").addEventListener("change", readImage);

function pixel(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  let h = ctx.canvas.height;
  let w = ctx.canvas.width

  let imageData = ctx.getImageData(0, 0, w, h);

  let imgd = imageData.data;

  let pos = 4 * w * Math.round(y) + 4 * Math.round(x);

  let arr_rgb = [imgd[pos], imgd[pos + 1], imgd[pos + 2]]

  let xyz_res = rgbToXyz(arr_rgb);

  console.log("x: " + x + " y: " + y)
  console.log(arr_rgb)

  let plt = document.getElementById("palette")
  let chex = rgbToHex(imgd[pos], imgd[pos + 1], imgd[pos + 2]);
  plt.style.backgroundColor = chex;

  const text_rgb = 'RGB(' + arr_rgb[0] + ', ' + arr_rgb[1] + ', ' + arr_rgb[2] + ')';
  const text_xyz = 'XYZ(' + xyz_res[0].toFixed(2) + ', ' + xyz_res[1].toFixed(2) + ', ' + xyz_res[2].toFixed(2) + ')';

  document.getElementById("rgb-s").innerHTML = text_rgb;
  document.getElementById("xyz-s").innerHTML = text_xyz;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

const canvas = document.getElementById('canvas')
canvas.addEventListener('click', function (e) {
  pixel(canvas, e)
})

const r1 = document.getElementById("lum-range");
r1.addEventListener("input", changeLum);
r1.addEventListener("change", changeLum);

function download() {
  var canvas = document.getElementById("canvas_xyz");
  var anchor = document.createElement("a");
  anchor.href = canvas.toDataURL("image/png");
  anchor.download = "IMAGE.PNG";
  anchor.click();
}
