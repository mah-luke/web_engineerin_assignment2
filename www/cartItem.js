import * as MetApi from './met-api-wrapper.js';
import * as ArtworkCache from './artwork-cache.js';

export class CartItem {
    constructor(artwork, printSize, frameStyle, frameWidth, matColor, matWidth) {
        
        this.artwork = artwork;
        this.printSize = printSize;
        this.frameStyle = frameStyle;
        this.frameWidth = frameWidth;
        this.matColor = matColor;
        this.matWidth = matWidth;
    }
}