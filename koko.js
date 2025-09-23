/* Copyright (C) 2025 - Kristoffer A. Wright - All Rights Reserved */

/**
 * koko - A small game-engine for creating simple mobile browser games.
 */


/* ----- VERSION NUMBER ----- */


/**
 * The current version number of `koko`.
 */
const VERSION_NUMBER = "1.0";


/* ----- PRIVATE CONSTANTS ----- */


const __PADDING_SIZE = 32;


/* ----- PRIVATE VARIABLES ----- */


let canvas = null;
let context = null;
let screenWidth = 0;
let screenHeight = 0;
let touchX = -1;
let touchY = -1;
let framesPerSecond = 0;
let ticksPerFrame = 0;
let lastTick = 0;


function __onTouchStart(event) {
    event.preventDefault();
    const touch = event.changedTouches[0];
    touchX = touch.pageX;
    touchY = touch.pageY;
}


function __onTouchEnd(event) {
    touchX = -1;
    touchY = -1;
}



/* ----- INITIALIZATION FUNCTIONS ----- */


/**
 * Initialize the `koko` game engine.
 */
function initKoko(canvasId, frameRate) {
    if (typeof(window.innerWidth) != "number" || typeof(window.innerHeight) != "number") {
        throw "Could not fetch screen dimensions";
    }
    canvas = document.getElementById(canvasId);
    screenHeight = window.innerHeight - (__PADDING_SIZE * 2);
    screenWidth = window.innerWidth - __PADDING_SIZE;
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    context = canvas.getContext("2d");
    canvas.style.marginTop = `${__PADDING_SIZE / 2}px`;
    canvas.addEventListener("touchstart", __onTouchStart);
    canvas.addEventListener("touchend", __onTouchEnd);    
    framesPerSecond = frameRate;
    ticksPerFrame = 1000 / framesPerSecond;
    lastTick = Date.now();
}


/* ----- SCREEN ATTRIBUTE GETTER FUNCTIONS ----- */


/**
 * Get the height of the drawable screen, in pixels.
 */
function getScreenHeight() {
    return screenHeight;
}


/**
 * Get the width of the drawable screen, in pixels.
 */
function getScreenWidth() {
    return screenWidth;
}


/* ----- LOW-LEVEL DRAW FUNCTIONS ----- */


/**
 * Set the color that will be used for all basic drawing operations.
 */
function setDrawColor(color) {
    context.fillStyle = color;
}


/**
 * Set the font that will be used for text drawing operations.
 */
function setDrawFont(fontFamily, size) {
    context.font = `bold ${size}px ${fontFamily}`;
    context.textBaseline = "top";
}


/**
 * Set the background color of the document's `body` element. `color` should be given as a hex-string.
 */
function setBodyBackgroundColor(color) {
    document.body.style.backgroundColor = color;
}


/**
 * Draw a rectangle at a given position and with given size.
 */
function drawRectangle(topLeftX, topLeftY, width, height) {
    context.fillRect(topLeftX, topLeftY, width, height);
}


/**
 * Clear the screen. Sets the screen color to the current draw color.
 */
function clearScreen() {
    drawRectangle(0, 0, screenWidth, screenHeight);
}


/**
 * Draw a line of text at a given position.
 */
function drawText(topLeftX, topLeftY, text) {
    context.fillText(text, topLeftX, topLeftY);
}


/**
 * Get the width of the rectangle surrounding a given line of text if the text were to be drawn to the screen. Does
 * not actually draw the text to the screen.
 */
function guessTextWidth(text) {
    const textInfo = context.measureText(text);
    return textInfo.width;
}


/**
 * Finds the largest font size that can be used to draw a given line of text inside a rectangular region. Sets the
 * current draw font to the calculated font.
 */
function fitTextToBox(width, height, fontFamily, text) {
    let fontSize = height;
    setDrawFont(fontFamily, fontSize);
    while (guessTextWidth(text) > width) {
        fontSize--;
        setDrawFont(fontFamily, fontSize);
    }
    return fontSize;
}

/* ----- INPUT FUNCTIONS ----- */


/**
 * Get the immediate x-position of a single touch screen input. If multiple simultaneous touches are present, only
 * the first input is returned. If no input is currently registered, returns `-1`.
 */
function getTouchX() {
    return touchX;
}


/**
 * Get the immediate y-position of a single touch screen input. If multiple simultaneous touched are present, only
 * the first input is returned. If no input is currently registered, returns `-1`.
 */
function getTouchY() {
    return touchY;
}


/* ----- RANDOM FUNCTIONS ----- */


/**
 * Get a random `boolean` value.
 */
function randomBoolean() {
    const randomValue = Math.random();
    if (randomValue < 0.5) {
        return false;
    }
    return true;
}


/* ----- TIME FUNCTIONS ----- */


/**
 * Get the number of millisecond ticks left until the next frame swap time.
 */
function getTicksToNextFrame() {
    let nextFrameTick;
    let currentTick = Date.now();
    for (
            nextFrameTick = lastTick + ticksPerFrame;
            nextFrameTick < currentTick;
            nextFrameTick += ticksPerFrame) {
        currentTick = Date.now();
    }
    lastTick = currentTick;
    return nextFrameTick - currentTick;
}


export {
    VERSION_NUMBER,
    initKoko,
    getScreenHeight,
    getScreenWidth,
    setBodyBackgroundColor,
    setDrawColor,
    setDrawFont,
    drawRectangle,
    clearScreen,
    drawText,
    guessTextWidth,
    fitTextToBox,
    getTouchX,
    getTouchY,
    randomBoolean,
    getTicksToNextFrame
};