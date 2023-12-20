var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var dragging = false;
var pos = { x: 0, y: 0 };

canvas.addEventListener('mousedown', engage);
canvas.addEventListener('mousedown', setPosition);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', disengage);

canvas.addEventListener('touchstart', engage);
canvas.addEventListener('touchmove', setPosition);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', disengage);

function isTouchDevice() {
    return (
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0)
    );
}

function engage() {
    dragging = true;
};

function disengage() {
    dragging = false;
};
function setPosition(e) {

    if (isTouchDevice()) {
        var touch = e.touches[0];
        pos.x = touch.clientX - ctx.canvas.offsetLeft;
        pos.y = touch.clientY - ctx.canvas.offsetTop;
    } else {

        pos.x = e.clientX - ctx.canvas.offsetLeft;
        pos.y = e.clientY - ctx.canvas.offsetTop;
    }
}

function draw(e) {

    e.preventDefault();
    e.stopPropagation();

    if (dragging) {

        ctx.beginPath();

        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'white';

        ctx.moveTo(pos.x, pos.y);
        setPosition(e);
        ctx.lineTo(pos.x, pos.y);

        ctx.stroke();
    }
}
function erase() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

async function loadModel() {    
    model = await tf.loadLayersModel('https://raw.githubusercontent.com/Tatiana-Polonskaya/web-image-analysis/main/mnst.json');
    
    model.predict(tf.zeros([1, 28, 28,1]))
    
    return model
}

function getData() {
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

async function predictModel() {

    imageData = getData();
    
    image = tf.browser.fromPixels(imageData)

    image = tf.image.resizeBilinear(image, [28, 28]).sum(2).expandDims(0).expandDims(-1)    
    y = model.predict(image);

    document.getElementById('result').innerHTML = y.argMax(1).dataSync();
}

var model = loadModel()
