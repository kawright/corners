/* Copyright (C) 2025 - Kristoffer A. Wright - All Rights Reserved */

/* Corners - a classic zero-player game we've all played before */


import * as koko from "./koko.js";


/* ----- DOM ID CONSTANTS ----- */


const DOM_ID_CANVAS = "main-canvas";


/* ----- LAYOUT CONSTANTS ----- */


const LAYOUT_TILE_TO_SCREEN_RATIO = 12;


/* ----- TIME CONSTANTS ----- */


const FRAMES_PER_SECOND = 24;
const NORMALIZED_TILE_SPEED = 0.8;


/* ----- COLOR CONSTANTS ----- */


const COLOR_ARENA = "#c0c0c0";
const COLOR_BACKGROUND = "#808080";
const COLOR_TILE = "#008020";
const COLOR_MINOR_SCORE = "#e0e0e0";
const COLOR_MAJOR_SCORE = "#a0a0a0";


/* ----- FONTS ----- */

const FONT_MAIN = "Arial";


/* ----- LAYOUT STATE (WRITE-ONCE) ----- */


let layoutTileSize = 0;
let layoutScreenHeight = 0;
let layoutScreenWidth = 0;
let layoutTileSpeed = 0;


/* ----- GAME STATE ----- */

let stateTileX = 0;
let stateTileY = 0;
let stateVelocityX = 0;
let stateVelocityY = 0;
let stateMajorScore = 0;
let stateMinorScore = 0;


/* ----- MAIN AND GAME-LOOP FUNCTIONS ----- */

function nextFrame() {
    if (koko.getTouchX() != -1) {
        stateMajorScore = 0;
        stateMinorScore = 0;
        koko.setDrawColor(COLOR_ARENA);
        koko.clearScreen();
        stateTileX = koko.getTouchX();
        stateTileY = koko.getTouchY();
        if (koko.randomBoolean()) {
            stateVelocityX = layoutTileSpeed;
        } else {
            stateVelocityX = -1 * layoutTileSpeed;
        }
        if (koko.randomBoolean()) {
            stateVelocityY = layoutTileSpeed;
        } else {
            stateVelocityY = -1 * layoutTileSpeed;
        }
        setTimeout(nextFrame, koko.getTicksToNextFrame());
        return;
    }
    if (stateVelocityX == 0 && stateVelocityY == 0) {
        setTimeout(nextFrame, koko.getTicksToNextFrame());
        return;
    }
    stateTileX += (stateVelocityX / FRAMES_PER_SECOND);
    stateTileY += (stateVelocityY / FRAMES_PER_SECOND);
    let struckHorizontalWall = false;
    let struckVerticalWall = false;
    
    if (stateTileX < 0) {
        stateTileX = 0;
        stateVelocityX *= -1;
        struckVerticalWall = true;
        stateMinorScore++;
    }
    if (stateTileX > (layoutScreenWidth - layoutTileSize)) {
        stateTileX = layoutScreenWidth - layoutTileSize;
        stateVelocityX *= -1;
        struckVerticalWall = true;
        stateMinorScore++;
    }
    if (stateTileY < 0) {
        stateTileY = 0;
        stateVelocityY *= -1;
        struckHorizontalWall = true;
        stateMinorScore++;
    }
    if (stateTileY > (layoutScreenHeight - layoutTileSize)) {
        stateTileY = layoutScreenHeight - layoutTileSize;
        stateVelocityY *= -1;
        struckHorizontalWall = true;
        stateMinorScore++;
    }
    if (struckHorizontalWall && struckVerticalWall) {
        stateMajorScore++;
    }
    koko.setDrawColor(COLOR_ARENA);
    koko.clearScreen();

    const minorScoreString = stateMinorScore.toString(10);
    const majorScoreString = stateMajorScore.toString(10);
    koko.setDrawColor(COLOR_MAJOR_SCORE);
    koko.setDrawFont(FONT_MAIN, layoutTileSize * 2);
    koko.drawText((layoutScreenWidth / 2) - (layoutTileSize / 2), 
        (layoutScreenHeight / 2) - (koko.guessTextWidth(majorScoreString)), majorScoreString);
    
    koko.setDrawColor(COLOR_TILE);
    koko.drawRectangle(stateTileX, stateTileY, layoutTileSize, layoutTileSize);
    koko.setDrawColor(COLOR_MINOR_SCORE);
    const minorScoreFontSize = koko.fitTextToBox(layoutTileSize, layoutTileSize, FONT_MAIN, minorScoreString);
    koko.drawText(stateTileX + ((layoutTileSize - koko.guessTextWidth(minorScoreString)) / 2),
        stateTileY + (layoutTileSize - minorScoreFontSize) / 2, minorScoreString);
        
    setTimeout(nextFrame, koko.getTicksToNextFrame());
}


/**
 * Entry point. Called on window's "load" event.
 */
function main() {
    
    koko.initKoko(DOM_ID_CANVAS, FRAMES_PER_SECOND);
    
    layoutScreenHeight = koko.getScreenHeight();
    layoutScreenWidth = koko.getScreenWidth();

    if (layoutScreenHeight > layoutScreenWidth) {
        layoutTileSize = Math.floor(layoutScreenHeight / LAYOUT_TILE_TO_SCREEN_RATIO);
    } else {
        layoutTileSize = Math.floor(layoutScreenWidth / LAYOUT_TILE_TO_SCREEN_RATIO);
    }
    layoutTileSpeed = layoutTileSize * NORMALIZED_TILE_SPEED;

    koko.setBodyBackgroundColor(COLOR_BACKGROUND);
    koko.setDrawColor(COLOR_ARENA);
    koko.clearScreen();

    koko.setDrawFont(FONT_MAIN, layoutTileSize);
    koko.setDrawColor(COLOR_MAJOR_SCORE);
    koko.drawText((layoutScreenWidth / 2) - (koko.guessTextWidth("tap!") / 2), 
        (layoutScreenHeight / 2) - (layoutTileSize / 2), "tap!");
    nextFrame();
}


/* ----- DRIVER CODE ----- */


window.addEventListener("load", main);