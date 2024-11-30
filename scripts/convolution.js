const CNN_IMAGE_WIDTH = 24
const CNN_CONV = 5
const BG_COLOR = "#191919"
const imageUrl = "/assets/images/kitware-lowres.png";
const cnnImage = new Image();
const hiddenCanvas = document.createElement("canvas");

cnnFilter = [
    [-2, -1,  0,  1,  2],
    [-2, -1,  0,  1,  2],
    [-4, -2,  0,  2,  4],
    [-2, -1,  0,  1,  2],
    [-2, -1,  0,  1,  2],
];

cnnImage.onload = function() {
    const context = hiddenCanvas.getContext("2d")
    hiddenCanvas.width = cnnImage.width
    hiddenCanvas.height = cnnImage.height
    context.drawImage(cnnImage, 0, 0)
}
cnnImage.src = imageUrl

let filterTimeout = null

function getCnnImagePixel(x, y) {
    const context = hiddenCanvas.getContext("2d")
    if (!context) return [0, 0, 0]
    const pixelData = context.getImageData(x, y, 1, 1).data
    return [pixelData[0], pixelData[1], pixelData[2]]
}

function startFilter() {
    const filter = document.getElementById('filter')
    const canvas = document.getElementById('cnn-canvas')
    resetCanvas(canvas)
    moveFilter(filter, canvas, 0, 0)
}

function moveFilter(filter, canvas, x, y) {
    showCanvasPixel(canvas, x, y)

    filter.style.top = (y - 1) * 4.17 + '%'
    filter.style.left = (x - 1) * 4.17 + '%'

    const nextX = (x + 1) % (CNN_IMAGE_WIDTH - CNN_CONV + 1)
    const nextY = y + (nextX === 0)

    let speed = document.getElementById("cnn-speed")
    if (!speed) return
    speed = (100 - speed.value ** 2) * 10 + 20

    if (nextY < (CNN_IMAGE_WIDTH - CNN_CONV + 1))
        filterTimeout = setTimeout(() => { moveFilter(filter, canvas, nextX, nextY) }, speed)
}

function resetCanvas(canvas) {
    clearTimeout(filterTimeout)
    filterTimeout = null
    const width = canvas.width
    const height = canvas.height
    drawRect(canvas, 0, 0, width, height, BG_COLOR)
}

function computeConvolution(canvas, x, y, size) {
    let sum = 0

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const pixel = getCnnImagePixel(x + j, y + i)
            const c = cnnFilter[i][j]
            sum += (pixel[0] + pixel[1] + pixel[2]) * c
        }
    }

    const value = sum / 3
    return [value, value, value]
}

function drawRect(canvas, x, y, width, height, color) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height)
    ctx.closePath()
    ctx.closePath()
}

function showCanvasPixel(canvas, x, y) {
    let nPixelsLine = CNN_IMAGE_WIDTH - 2 * Math.floor(CNN_CONV / 2)
    let pixelWidth = canvas.width / nPixelsLine
    let pixelHeight = canvas.height / nPixelsLine
    let pixelColor = rgbToHex(...computeConvolution(canvas, x, y, 5))

    drawRect(canvas, x * pixelWidth, y * pixelHeight, pixelWidth, pixelHeight, pixelColor)
}