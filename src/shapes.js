export default class Shapes 
{
    constructor(noteWidth, noteHeight) 
    {
        this.noteWidth = noteWidth;
        this.noteHeight = noteHeight;
        this.box = {

            width: {
                quarter: Math.floor(this.noteWidth / 4),
                half: Math.floor(this.noteWidth / 2),
                third: Math.floor(this.noteWidth / 3),
                twoThirds: Math.floor(this.noteWidth / 3) *  2
            },

            height: {
                quarter: Math.floor(this.noteWidth / 4),
                half: Math.floor(this.noteWidth / 2),
                third: Math.floor(this.noteWidth / 3),
                twoThirds: Math.floor(this.noteWidth / 3) *  2
            }
        }
    }


    getShapePath(shape, neckPos) {

        if(shape== 'dot')
            return this.getCirclePath(neckPos);

        if(shape == 'square')
            return this.getSquarePath(neckPos);

        if(shape == 'triangle')
            return this.getTrianglePath(neckPos);
        
        if(shape == 'cross')
            return this.getCrossPath(neckPos);

        return '';
    }

    getCirclePath(neckPos) {

        const ratio = 0.5;
        const midX = this.noteWidth / 2;
        const midY = this.noteHeight / 2;
        const startX = midX + (neckPos.string-1) * this.noteWidth;
        const startY =  midY + (neckPos.fret) * this.noteHeight;
        const radius = ((this.noteWidth * ratio)/ 2) ;

        return this.circlePath(startX, startY, radius);
    }

    getSquarePath(neckPos) {
        
        const ratio = 0.7;
        const shapeWidth = this.noteWidth * ratio;
        const shapeHeight = this.noteHeight * ratio;
        const startX = (this.noteWidth - shapeWidth) /2 + (neckPos.string-1) * this.noteWidth;
        const startY =  (this.noteHeight - shapeHeight) /2 + ((neckPos.fret) * this.noteHeight);
    
        var p =  `M${startX},${startY} 
                 ${startX + shapeWidth },${startY} 
                 ${startX + shapeWidth },${startY + shapeHeight} 
                 ${startX},${startY + shapeHeight} z`;

        return p;
    }

    getCrossPath(neckPos) {

        const ratio = 0.7;
        const shapeWidth = this.noteWidth * ratio;
        const shapeHeight = this.noteHeight * ratio;
        const startX = (this.noteWidth - shapeWidth) /2 + (neckPos.string-1) * this.noteWidth;
        const startY =  (this.noteHeight - shapeHeight) /2 + ((neckPos.fret) * this.noteHeight);
        // const twoThirds = this.box.width.twoThirds+2;
        // const startX = this.box.width.quarter + (neckPos.string-1) * this.noteWidth -3;
        // const startY = (this.noteHeight/2) + ((neckPos.fret) * this.noteHeight) - this.box.width.third-1

        var p =  `M${startX},${startY} 
                    ${startX + shapeWidth},${startY + shapeHeight} 
                  M${startX + shapeWidth},${startY} 
                    ${startX},${startY + shapeHeight} z`;

        return p;
    }

    getTrianglePath(neckPos) {
        
        const ratio = 0.8;
        const shapeWidth = this.noteWidth * ratio;
        const shapeHeight = this.noteHeight * 0.8;
        const midX = this.noteWidth / 2;
        const startX = midX + (neckPos.string-1) * this.noteWidth;
        const startY =  (this.noteHeight - shapeHeight) /2 + ((neckPos.fret) * this.noteHeight);
        
        return `M ${startX},${startY} 
                ${startX + shapeWidth / 2},${startY + shapeHeight } 
                ${startX - shapeWidth/2},${startY + shapeHeight} z`;

    }

    getStringX(stringNumber) {
           
        return ((stringNumber-1) * this.noteWidth) + Math.floor(this.noteWidth / 2); 
    }

    circlePath(cx, cy, r){
        return 'M '+cx+' '+cy+' m -'+r+', 0 a '+r+','+r+' 0 1,0 '+(r*2)+',0 a '+r+','+r+' 0 1,0 -'+(r*2)+',0';
    }
}