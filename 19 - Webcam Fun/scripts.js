const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      console.log(localMediaStream);
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch((err) => {
      console.error(`OH!!!!FUCK!!!`, err);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  // 第一次使用 rAF 開啟更新畫面的循環
  return window.requestAnimationFrame((timestamp) => {
    // 將 `<video>` 當下的畫面印到 <canvas> 內
    updateVideo(timestamp, width, height);
  });

  // 原本教程使用的 setInterval 方法
  // return setInterval(() => {
  //   ctx.drawImage(video, 0, 0, width, height);
  //   let pixels = ctx.getImageData(0, 0, width, height);
  //   //redEffect(pixels);
  //   //rgbSplit(pixels);
  //   ctx.globalAlpha = 0.2;
  //   ctx.putImageData(pixels, 0, 0);
  // }, 16);
}

// 轉印畫面的函式
function updateVideo(timestamp, width, height) {
  // 將 video 當下的畫面依照複製像素的方式複製到 canvas 上
  ctx.drawImage(video, 0, 0, width, height);
  let pixels = ctx.getImageData(0, 0, width, height);

  rgbSplit(pixels);
  ctx.globalAlpha = 0.2;

  ctx.putImageData(pixels, 0, 0);
  // 呼叫下一個更新畫面的循環
  window.requestAnimationFrame((timestamp) => {
    updateVideo(timestamp, width, height);
  });
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  const data = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "jason");
  link.innerHTML = `<img src="${data}" alt="handsome man"/>`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] = pixels.data[i + 0] + 100;
    pixels.data[i] = pixels.data[i + 1] - 50;
    pixels.data[i] = pixels.data[i + 2] * 0.5;
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

getVideo();

video.addEventListener("canplay", paintToCanvas);
