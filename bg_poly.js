let circSize = 500;
let off_original = 0.325
let voxel_size = 2;
let scaling = 1
let field = []

let loop_length = 100;
let toff = 2 / loop_length;

let circle = false;

let noise;
let canvas;
let seed = Date.now()

let debug = false;

let savedFrameCount = 1;

let realTime = true

let drawThresholdBegin = 0.615;
let drawNum = 16;
let drawThresholdIncrease = 0.0625;

let tsl = false;

let frames = []
let trim = 100;

let jura;
function preload() {
    jura = loadFont('jura.ttf');
}


let graphics;

function setup() {
    textFont(jura)

    canvas = createCanvas(window.innerWidth, window.innerHeight);
    graphics = createGraphics(window.innerWidth, window.innerHeight);
    noise = new openSimplexNoise(seed);

    for (let x = 0; x < width / voxel_size; x++) {
        field[x] = []
        for (let y = 0; y < height / voxel_size; y++) {
            field[x][y] = 0;
        }
    }

    background(0)
    frameRate(10);

    graphics.textFont(jura)
    //frameRate(1)
}

let poly;
let temp_image;
function* draw_async() {
    while (true) {
        let r = (savedFrameCount % 300 <= 75 && savedFrameCount % 600 >= 000 ? savedFrameCount % 75 : 0) + (savedFrameCount % 300 <= 150 && savedFrameCount % 300 >= 75 ? 75 - savedFrameCount % 75 : 0)
        let g = (savedFrameCount % 300 <= 150 && savedFrameCount % 600 >= 75 ? savedFrameCount % 75 : 0) + (savedFrameCount % 300 <= 225 && savedFrameCount % 300 >= 150 ? 75 - savedFrameCount % 75 : 0)
        let b = (savedFrameCount % 300 <= 225 && savedFrameCount % 600 >= 150 ? savedFrameCount % 75 : 0) + (savedFrameCount % 300 <= 300 && savedFrameCount % 300 >= 225 ? 75 - savedFrameCount % 75 : 0)

        let timeX = sin((savedFrameCount / loop_length) * TWO_PI);
        let timeY = cos((savedFrameCount / loop_length) * TWO_PI);

        r *= noise.noise2D(timeX * toff, timeY * toff)
        g *= noise.noise3D(timeX * toff, timeY * toff, r * 0.025)
        b *= noise.noise3D(timeX * toff, timeY * toff, g * 0.025)

        let off = off_original * (noise.noise2D(timeX * (toff / 5), timeY * (toff / 5), 16384 + savedFrameCount * off_original) / 2 + 0.5)


        strokeWeight(1)
        textSize(100);
        text("Generating map...", window.innerWidth / 2 - 500, window.innerHeight / 2);


        let darkness, centerOffsetX, centerOffsetY, val;

        for (let x = 0; x < width / voxel_size; x++) {
            for (let y = 0; y < height / voxel_size; y++) {
                darkness = 1//; - dist(x, y, (width / voxel_size) / 2, (height / voxel_size) / 2) / ((height * 2 / voxel_size) / 2)
                centerOffsetX = (off * width / voxel_size) / 2;
                centerOffsetY = (off * height / voxel_size) / 2;
                val = noise.noise4D(x * off - centerOffsetX, y * off - centerOffsetY, timeX * toff, timeY * toff) * darkness
                field[x][y] = val;
            }
            if (x % 100 == 0 && realTime) {
                yield 1;

                textSize(100);
                strokeWeight(1)
                text("Generating map...", window.innerWidth / 2 - 500, window.innerHeight / 2);
            }
        }

        graphics.background(0);

        //console.log("Start frame")
        for (let t = drawThresholdBegin; t < 1; t += drawThresholdIncrease) {
            if (tsl)
                tessellation = 0.5;

            poly = squares(field, t, voxel_size);
            for (let i = 0; i < poly.triangles.length; i += 3) {
                //darkness = (2 - dist(poly.coords[poly.triangles[i]].x, poly.coords[poly.triangles[i]].y, (width * 1 / 8) / 2, (height) / 2) / ((width * 1) / 2)) + 1 / 3
                //stroke((255 * (t * 2) + r) * darkness, ((192 * (t * 2)) + g) * darkness, ((127 * (t * 2)) + b) * darkness);

                let darkness = (t - drawThresholdBegin) / (1 - drawThresholdBegin) * 2 + 0.1;//(1 - dist(poly.coords[poly.triangles[i]].x, poly.coords[poly.triangles[i]].y, (width) / 2, (height) / 2) / (width / 2))// + 1 / 3
                graphics.stroke((255 * (t * 2) + r) * darkness, ((192 * (t * 2)) + g) * darkness, ((127 * (t * 2)) + b) * darkness, t * 255);
                //strokeWeight(darkness * 5);

                /*
                vertex((poly.coords[poly.triangles[i]].x - width / 2) * 1 + width / 2, (poly.coords[poly.triangles[i]].y - height / 2) * 1 + height / 2);
                vertex((poly.coords[poly.triangles[i + 1]].x - width / 2) * 1 + width / 2, (poly.coords[poly.triangles[i + 1]].y - height / 2) * 1 + height / 2);
                vertex((poly.coords[poly.triangles[i + 2]].x - width / 2) * 1 + width / 2, (poly.coords[poly.triangles[i + 2]].y - height / 2) * 1 + height / 2);*/

                graphics.line((poly.coords[poly.triangles[i]].x - width / 2) * 1 + width / 2, (poly.coords[poly.triangles[i]].y - height / 2) * 1 + height / 2, (poly.coords[poly.triangles[i + 1]].x - width / 2) * 1 + width / 2, (poly.coords[poly.triangles[i + 1]].y - height / 2) * 1 + height / 2)
                graphics.line((poly.coords[poly.triangles[i + 1]].x - width / 2) * 1 + width / 2, (poly.coords[poly.triangles[i + 1]].y - height / 2) * 1 + height / 2, (poly.coords[poly.triangles[i + 2]].x - width / 2) * 1 + width / 2, (poly.coords[poly.triangles[i + 2]].y - height / 2) * 1 + height / 2)
                graphics.line((poly.coords[poly.triangles[i + 2]].x - width / 2) * 1 + width / 2, (poly.coords[poly.triangles[i + 2]].y - height / 2) * 1 + height / 2, (poly.coords[poly.triangles[i]].x - width / 2) * 1 + width / 2, (poly.coords[poly.triangles[i]].y - height / 2) * 1 + height / 2)
                if (i % 500 == 0 && realTime)
                    yield 1;

            }
            if (realTime)
                yield 1;
            
        }
        //console.log("Finished frame")
        graphics.copy(trim, trim, window.innerWidth - 2 * trim, window.innerHeight - 2 * trim, 0, 0, window.innerWidth, window.innerHeight);

        graphics.textSize(50)
        graphics.strokeWeight(1)
        graphics.fill(255)
        graphics.text("feoranis", 25, 55);



        frames.push(graphics.get())
        savedFrameCount++;

        //noLoop();
        yield 1;
    }
}

let drawer = draw_async();

let displayedImageCount = 0;
function draw() {

    //console.log(frameCount)

    if (savedFrameCount <= loop_length) {
        background(0);
        image(graphics, 0, 0);
        drawer.next(),
        textSize(60)
        stroke(255);
        fill(255)
        text("Rendering " + savedFrameCount + "/" + loop_length + ", " + frameCount, 0, 60)

        let eta = floor((loop_length / savedFrameCount) * millis() / 1000);

        text("Total estimated: " + eta + "s, remaining: " + floor(eta - millis() / 1000) + "s", 0, 120);
    }
    else {
        image(frames[displayedImageCount++], 0, 0);
        if (displayedImageCount >= frames.length)
            displayedImageCount = 0;
    }
    //drawer = new draw_async();

    /*

    if (debug) {
        strokeWeight(1)
        fill(255)
        textSize(30)
        text("POLY_BG FRAME: " + savedFrameCount % loop_length + " FPS: " + floor(frameRate() * 100) / 100 + " LOOPLENGTH: " + loop_length + " SEED: " + seed, 50, height - 100)
        text("GRIDSIZE: " + voxel_size + " OFF: " + off_original + " TOFF: " + toff + " COLORFX: " + "TRUE" + " OFFZM: " + floor(off * 1000) / 1000 + " ETA: " + (loop_length - savedFrameCount % loop_length) / frameRate(), 50, height - 50)
    } */
    //saveCanvas("frame", "png");
}