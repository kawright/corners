/* Copyright (C) 2025 - Kristoffer A. Wright - All Rights Reserved */

/**
 * koko - A small framework for creating simple mobile browser games.
 */


/* ----- CONSTANTS ----- */


const PADDING_SIZE = 32;


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
 * Initialize the `koko` framework. Requires an existing `canvas` element with a given id for `koko` to mount to.
 * @param {string} canvasId The id of the `canvas` element in which `koko` will be mounted.
 */
function initKoko(canvasId, frameRate) {
    if (typeof(window.innerWidth) != "number" || typeof(window.innerHeight) != "number") {
        throw "Could not fetch screen dimensions";
    }
    canvas = document.getElementById(canvasId);
    screenHeight = window.innerHeight - (PADDING_SIZE * 2);
    screenWidth = window.innerWidth - PADDING_SIZE;
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    context = canvas.getContext("2d");
    canvas.style.marginTop = `${PADDING_SIZE / 2}px`;
    canvas.addEventListener("touchstart", __onTouchStart);
    canvas.addEventListener("touchend", __onTouchEnd);    
    framesPerSecond = frameRate;
    ticksPerFrame = 1000 / framesPerSecond;
    lastTick = Date.now();
}


/* ----- SCREEN ATTRIBUTE GETTER FUNCTIONS ----- */


/**
 * Get the height of the screen.
 * @returns The height of the screen, in pixels.
 */
function getScreenHeight() {
    return screenHeight;
}


/**
 * Get the width of the screen.
 * @returns The width of the screen, in pixels.
 */
function getScreenWidth() {
    return screenWidth;
}


/* ----- LOW-LEVEL DRAW FUNCTIONS ----- */


/**
 * Set the draw color.
 * @param {string} color The color being assigned. Given as a hex string.
 */
function setDrawColor(color) {
    context.fillStyle = color;
}

function setDrawFont(fontFamily, size) {
    context.font = `bold ${size}px ${fontFamily}`;
    context.textBaseline = "top";
}

/**
 * Set the background color of the document's `body` element.
 * @param {string} color The color being assigned. Given as a hex string.
 */
function setBodyBackgroundColor(color) {
    document.body.style.backgroundColor = color;
}


/**
 * Draw a rectangle at a given position and with given size.
 * @param {number} topLeftX The x-cooridnate of the top-left corner of the rectangle.
 * @param {number} topLeftY The y-coordinate of the top-left corner of the rectangle.
 * @param {number} width The width of the rectangle
 * @param {number} height The height of the rectangle
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


function drawText(topLeftX, topLeftY, text) {
    context.fillText(text, topLeftX, topLeftY);
}

function guessTextWidth(text) {
    const textInfo = context.measureText(text);
    return textInfo.width;
}

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

// TODO Document koko.getTouchX
function getTouchX() {
    return touchX;
}


// TODO Document koko.getTouchY
function getTouchY() {
    return touchY;
}


/* ----- RANDOM FUNCTIONS ----- */

// TODO Document koko.randomBoolean
function randomBoolean() {
    const randomValue = Math.random();
    if (randomValue < 0.5) {
        return false;
    }
    return true;
}


/* ----- TIME FUNCTIONS ----- */

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