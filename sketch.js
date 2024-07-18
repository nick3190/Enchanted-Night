let layerCount = 10;
let layers = [];
let moonLayers = [];
let moonCount = 80;
let skyLayer;
let skyCountX = 50;
let skyCountY = 50;
let treeLayer;
let personLayer;
let eyeLayer;

let mainSat;
let mainHue;

async function setup() {
  createCanvas(800, 800);
  background(0);
  colorMode(HSB);
  frameRate(10);
  
  let choseNum = random(0,1);
  console.log(choseNum);
  if (choseNum < 0.8 && choseNum > 0.4 ){
    mainSat = 100;
    mainHue = 0;
  }
  else if(choseNum < 0.4 && choseNum > 0.2) {
    mainSat = 100;
    mainHue = 120;
  }
  else if(choseNum < 0.20 && choseNum > 0) {
    mainSat = 100;
    mainHue = 270;
  }
  else{
    mainSat = 0;
  }

  let moonXPos;
  let treeXPos;
  if (random(0, 1) < 0.5) {
    moonXPos = random(200, 300);
    treeXPos = random(650, 750);
  }
  else {
    moonXPos = random(500, 600);
    treeXPos = random(150,200);
  }


  //===============================================================================//
  let rectWidth = width / skyCountX;
  let rectHeight = height / skyCountY;

  skyLayer = createGraphics(width, height);
  skyLayer.colorMode(HSB);
  for (let x = 0; x < skyCountX; x++) {
    for (let y = 0; y < skyCountY; y++) {
      let xPos = rectWidth * (x + 0.5);
      let yPos = rectHeight * (y + 0.5);

      let drawLength = random(200, 400);
      let drawThickness = random(1, 2);

      let colorH_A = mainHue;
      let colorS_A = mainSat;
      let colorB_A = 100;

      let colorH_B = mainHue;
      let colorS_B = 0;
      let colorB_B = 0;

      let colorA = color(colorH_A, colorS_A, colorB_A, 0.01);
      let colorB = color(colorH_B, colorS_B, colorB_B, 0.1);

      drawFlow(xPos, yPos, drawLength, drawThickness * 0.9, colorA, colorB);
    }
  }
  //===============================================================================//

  let moonyPos = 200;
  let moonInnerSize = random(50,100);

  for (let i = 0; i < moonCount; i++) {
    let t = i / moonCount;
  
    let moonOuterSize = lerp(moonInnerSize, moonInnerSize * 3, t)
    let color_Moon = color(mainHue,lerp(0,mainSat,t), 100, lerp(0.1, 0, t))
    moonLayers[i] = createGraphics(width, height);
    moonLayers[i].colorMode(HSB);
    moonLayers[i].noStroke();
    moonLayers[i].fill(color_Moon);

    moonLayers[i].circle(moonXPos, moonyPos, moonOuterSize);
  }

  //===============================================================================//

  for (let i = 0; i < layerCount; i++) {
    layers[i] = createGraphics(width * 2, height);
    layers[i].colorMode(HSB);

    let grassHeight = height - i * 100;
    let grassStartY = height - i * 50;

    for (let x = 0; x < width; x++) {
      let xt = x / width * 4;
      let grassXPos = lerp(0, width / 2, xt);
      let grassYNoise = noise(grassXPos * 0.9, grassHeight * 0.9);
      let grassBaseY = grassStartY + lerp(0, 200, grassYNoise);

      if (x % 1 == 0) {
        for (let y = 0; y < grassHeight; y++) {
          let yt = y / grassHeight;
          let drawChance = 1.0 - yt;

          let grassNowY = grassBaseY + lerp(0, grassHeight * 3, yt);

          let strokeHue = mainHue;
          let strokeSat = mainSat;
          let strokeBri = lerp(80, -100, yt);

          let grassSize = noise(grassXPos * 0.1, grassNowY * 0.9) * lerp(1,20,yt);

          if (random() < drawChance) {

            layers[i].noStroke();
            layers[i].fill(strokeHue, strokeSat, strokeBri, 1);

            layers[i].circle(grassXPos, grassNowY, grassSize);
          }
        }
      }

    }
  }
  //===============================================================================//
  treeLayer = createGraphics(width, height);

  let treeCountX = 2;
  let sizeCount = 0;
  for (let x = 0; x < treeCountX; x++) {
      let treeLength;
      let treeThickness;
      let startAngle = 0;
      let treeYPos;
      if (sizeCount % 2 == 0){
        treeLength = random(600, 700);
        treeThickness = random(80, 100)
        treeYPos = 700;
      }
      else{
        treeLength = random(500, 600);
        treeThickness = random(30,50);
        treeXPos = -treeXPos + 800;
        treeYPos = 700;
      }
      sizeCount += 1;
      treeYPos += noise(treeXPos * 0.004, treeYPos * 0.004) * 30;
      drawTree(treeXPos, treeYPos, treeLength, treeThickness, startAngle);
  }
  //===============================================================================//
  personLayer = createGraphics(width,height);
  let headCount = 30;
  let bodyCount = 50;
  let eyeCount = 20;

  let headXPos = width / 2;
  let headYPos = 450;
  let headInnerSize = 50;

  let bodyXPos = headXPos;
  let bodyYPos = 500;
  let bodyInnerSize = 120;



  personLayer.rectMode(CENTER);

  for(let i = 0 ; i < headCount; i++){
    let t = i / headCount;
    headYPos += noise(headXPos * 0.9);
    let color_Person = color(mainHue,lerp(mainSat,0,t), 0, lerp(0.1, 0, t))
    let headSize = lerp(headInnerSize, headInnerSize * 2, t);
    personLayer.noStroke();
    personLayer.fill(color_Person);
    
    personLayer.ellipse(headXPos, headYPos,headSize, headSize * 1.4)
  }
  for(let i = 0 ; i < bodyCount; i++){
    let t = i / bodyCount;
    bodyYPos += noise(bodyXPos * 0.9) + 5;
    let color_Person = color(mainHue,0, 0, lerp(0.1, 0, t))
    let bodySize = lerp(bodyInnerSize, bodyInnerSize * 2, t);
    personLayer.noStroke();
    personLayer.fill(color_Person);
    
    personLayer.ellipse(bodyXPos, bodyYPos,bodySize, bodySize * 0.6)
  }


  //===============================================================================//
  eyeLayer = createGraphics(width,height);

  let eyeLeftXPos = headXPos + 12;
  let eyeRightXPos = headXPos - 12;
  let eyeYPos = 450;
  let eyeInnerSize = 3;

  for(let i = 0 ; i < eyeCount; i++){
    let t = i / eyeCount;
    let color_Eye = color(mainHue,lerp(mainSat - 30,0,t), 100, lerp(0.1, 0, t))
    let eyeSize = lerp(eyeInnerSize, eyeInnerSize * 3, t);
    eyeLayer.noStroke();
    eyeLayer.fill(color_Eye);
    
    eyeLayer.circle(eyeLeftXPos, eyeYPos,eyeSize)
  }
  for(let i = 0 ; i < eyeCount; i++){
    let t = i / eyeCount;
    let color_Eye = color(mainHue,lerp(mainSat - 30,0,t), 100, lerp(0.1, 0, t))
    let eyeSize = lerp(eyeInnerSize, eyeInnerSize * 3, t);
    eyeLayer.noStroke();
    eyeLayer.fill(color_Eye);
    
    eyeLayer.circle(eyeRightXPos, eyeYPos,eyeSize)
  }
  //===============================================================================//
}
function draw() {
  background(0, 0, 5, 0.1);
  image(skyLayer, 0,0);

  for (let i = 0; i < moonCount; i++) {
    image(moonLayers[i], 0, 0);
  }
  image(treeLayer, 0, 0);

  image(personLayer,0,0);

  if (mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0) {

    let offsetEyeX = random(-2,2);
    let offsetEyeY = random(-2,2);
    image(eyeLayer,offsetEyeX,offsetEyeY);

    let offsetTreeX = random(-5,5);
    let offsetTreeY = random(-5,5);
    image(treeLayer, offsetTreeX, offsetTreeY);

    for (let i = 0; i < layerCount; i++) {
      let mouseT = i / layerCount;
      let offsetX = -0.75 * width + random(30,50) * mouseT * noise(mouseX * 0.01);
      let offsetY = random(30,50) * mouseT * noise(mouseY * 0.01);
      image(layers[i], offsetX, offsetY);
    }

  }
  else {
    for (let i = 0; i < layerCount; i++) {
      image(layers[i], 0, 0);
    }
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


    skyLayer.push();
    skyLayer.translate(xPos, yPos);
    skyLayer.noStroke();
    skyLayer.fill(nowColor);
    skyLayer.circle(0, 0, _thickness);
    // rect(0,0,_thickness,_thickness);
    skyLayer.pop();

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

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

function drawTree(_x, _y, _length, _thickness, _drawAngle, _depth = 0, _colorA, _colorB) {
  let rectSize = _thickness;
  let rectCount = _length * 0.5;

  let xPos = _x;
  let yPos = _y;

  let nowDegree = _drawAngle;

  let splitPos = random(0.06, 0.16);
  let canSplit = true;

  if (random() < 0.9)
    canSplit = true;
  else
    canSplit = false;

  if (_depth < 4)
    canSplit = true;

  if (_depth >= 5)
    canSplit = false;

  if (_length < 120)
    canSplit = false;


  for (let i = 0; i < rectCount; i++) {
    let t = i / rectCount;
    let curveT = easeOutCubic(t);
    rectSize = lerp(_thickness, 1, curveT);

    xPos = xPos + sin(radians(nowDegree)) * rectSize * 0.08;
    yPos = yPos - cos(radians(nowDegree)) * rectSize * 0.08;

    let colorH_A = mainHue;
    let colorS_A = mainSat;
    let colorB_A = lerp(0, 0, curveT);

    let colorH_B = mainHue;
    let colorS_B = mainSat;
    let colorB_B = lerp(5, 10, curveT);

    let color_A = color(colorH_A, colorS_A, colorB_A);
    let color_B = color(colorH_B, colorS_B, colorB_B);

    let nowColor = lerpColor(color_A, color_B, curveT)

    treeLayer.push();
    treeLayer.translate(xPos, yPos);
    treeLayer.rotate(radians(nowDegree));

    treeLayer.fill(nowColor)
    treeLayer.noStroke();
    treeLayer.circle(-0.5 * rectSize, -0.5 * rectSize, rectSize);
    treeLayer.pop();

    if (canSplit && t > splitPos) {
      let lengthA = (1 - t) * _length * random(1.2, 2.2);
      let lengthB = (1 - t) * _length * random(0.8, 1.4);
      let thicknessA = rectSize;
      let thicknessB = rectSize;
      let angleA = nowDegree - random(20, 30);
      let angleB = nowDegree + random(20, 30);
      treeLayer.fill(nowColor)
      treeLayer.noStroke();
      drawTree(xPos, yPos, lengthA, thicknessA, angleA, _depth + 1);
      drawTree(xPos, yPos, lengthB, thicknessB, angleB, _depth + 1);

      break;
    }
    nowDegree += noise(xPos * 0.7, yPos * 0.7) * 0.14;
  }
}



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


