let rects = [];

async function setup() {
  createCanvas(800, 800);
  background(0);
  colorMode(HSB);
  frameRate(60);

  let mainHue = random(0, 360);

  let xCount = 100;
  let yCount = 100;

  let rectWidth = width / xCount;
  let rectHeight = height / yCount;


  for (let x = 0; x < xCount; x++) {
    for (let y = 0; y < yCount; y++) {
      let xPos = rectWidth * (x + 0.5);
      let yPos = rectHeight * (y + 0.5);

      let drawLength = random(200, 400);
      let drawThickness = random(1, 2);

      let colorH_A = (mainHue + random(-30, 30)) % 360;
      let colorS_A = 0;
      let colorB_A = 100

      let colorH_B = (mainHue + random(-30, 30)) % 360;
      let colorS_B = 0;
      let colorB_B = 0

      let colorA = color(colorH_A, colorS_A, colorB_A, 0.01);
      let colorB = color(colorH_B, colorS_B, colorB_B, 0.1);

      drawFlow(xPos, yPos, drawLength, drawThickness * 0.9, colorA, colorB);
    }
    // await sleep(1);
  }
  //===============================================================================//

  //===============================================================================//

  let mountainCount = floor(random(8, 10));
  let mountainHeight = height / mountainCount / 2;
  for (let i = 0; i < mountainCount; i++) {
    let mountainStartY = height - 0.5 * i * mountainHeight - 50;
    let mountainHue = mainHue + random(-60, 60);
    if (mountainHue > 360)
      mountainHue -= 360;
    else if (mountainHue < 0)
      mountainHue += 360;
    for (let x = 0; x < width; x++) {

      let xt = x / width;

      let xPos = lerp(0, width, xt);
      let yNoise = noise(xPos * 0.9, mountainStartY * 0.9);
      let baseY = mountainStartY + lerp(0, 200, yNoise);
      let edgeSize = noise(xPos * 0.24, mountainStartY * 0.1) * 12;

      if (x % 1 == 0) {
        for (let y = 0; y < 500; y++) {
          let yt = y / 500;
          let drawChance = 1.0 - yt;

          let nowY = baseY + lerp(0, mountainHeight * 3, yt);

          let strokeHue = mountainHue + random(-10, 10);
          let strokeSat = 0
          let strokeBri = lerp(0, 80, yt);

          let size = noise(xPos * 0.24, nowY * 0.08) * 3;

          if (random() < drawChance) {
            noStroke();
            fill(strokeHue, strokeSat, strokeBri, 0.6);

            circle(xPos, nowY, size);
          }
        }
        // await sleep(1);
      }
    }
  }
  //===============================================================================//
  for(let i=0; i< 100; i++)
  {
    let t = i/100;

    let spawnAngle = lerp(0, 360, t);
    let startX = width/2 + sin(radians(spawnAngle)) * 200;
    let startY = height/2 + -cos(radians(spawnAngle)) * 200;

    let startAngle = lerp(-360, 360, t);

    rects[i] = new TrailObj(startX, startY, startAngle);
    rects[i].rectSizeMin = lerp(10, 60, t);
    rects[i].rectSizeMax = lerp(30, 120, t);
  }
}
function draw() {
  for(let i=0; i< 100; i++)
  {
    rects[i].process();
    rects[i].drawObj();
  }

}

function drawFlow(_x, _y, _length, _thickness, _colorA, _colorB, _rotAdd = 0, _rotRate = 1) {

  let drawCount = _length * 1;
  let drawStep = _length / drawCount;

  let xPos = _x;
  let yPos = _y;

  for (let i = 0; i < drawCount; i++) {
    let t = i / (drawCount - 1);

    let nowColor = lerpColor(_colorA, _colorB, t);


    push();
    translate(xPos, yPos);
    noStroke();
    fill(nowColor);
    circle(0, 0, _thickness);
    // rect(0,0,_thickness,_thickness);
    pop();

    let rotAngle = NYFlowAngle(xPos, yPos) * _rotRate + _rotAdd;

    xPos = xPos + sin(radians(rotAngle)) * drawStep;
    yPos = yPos - cos(radians(rotAngle)) * drawStep;

  }

}

function NYFlowAngle(_x, _y) {
  let noiseValue = noise(_x * 0.003, _y * 0.003);
  let rotAngle = lerp(0, 360, noiseValue);
  let rotStep = floor(rotAngle / 60);
  let stepAngle = rotStep * 200;

  return rotAngle;
}



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
class TrailObj {

  constructor(_startX, _startY, _startAngle) {
    this.xPos = _startX;
    this.yPos = _startY;

    this.rectSize = 30;
    this.rectSizeMin = random(10, 20);
    this.rectSizeMax = random(30, 100);

    this.dirDegree = _startAngle;
    this.moveSpeed = 6;

    this.rectHue = mainHue + random(-30, 30);
    this.rectSat = random(40, 80);
    this.rectBri = 100;
    this.rectBriMin = 40;
    this.rectBriMax = 100;

    if(random() < 0.12)
    {
      this.rectHue += 180;
      if(this.rectHue > 360)
        this.rectHue -= 360;
    }

    if(random() < 0.06)
    {
      this.rectSat = 0;
      this.rectBriMin = 60;
      this.rectBriMax = 100;
    }
    
  }

  process() {
    this.xPos = this.xPos + sin(radians(this.dirDegree)) * this.moveSpeed;
    this.yPos = this.yPos - cos(radians(this.dirDegree)) * this.moveSpeed;

    let noiseValue = noise(this.xPos * 0.01, this.yPos * 0.01);
    this.dirDegree += noiseValue * 4;

    // -1 ~ 1  to  0 ~ 1
    let sizeT = (sin(radians(this.dirDegree)) + 1) / 2;
    this.rectSize = lerp(this.rectSizeMin, this.rectSizeMax, sizeT);

    let briT = (sin(radians(this.dirDegree)) + 1) / 2;
    this.rectBri = lerp(this.rectBriMin, this.rectBriMax, briT);
  }

  drawObj () {
    push();
    translate(this.xPos, this.yPos);
    rotate(radians(this.dirDegree));
  
    fill(this.rectHue, this.rectSat, this.rectBri);
    rect(-0.5 * this.rectSize, -0.5 * this.rectSize, this.rectSize, this.rectSize);
    pop();
  }

}
