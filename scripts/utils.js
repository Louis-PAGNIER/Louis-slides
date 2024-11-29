function rgbToHex(red, green, blue) {
    const rgb = (red << 16) | (green << 8) | (blue << 0)
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
}