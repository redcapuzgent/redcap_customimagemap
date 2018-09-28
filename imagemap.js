/**
 * This uses an imageId and an imagemap id.
 * It will render a canvas over the imagemap.
 * When something is clicked the underlying imagemap is used to render a figure with fillColors over the image.
 * The imageareas are augmented with a "toggled" attribute.
 *
 * @param imageIdL Id of the image.
 * @param mapIdL Id of the map.
 * @param updateFunctionL Your updatefunction, can be null.
 * @param fillColor a color, preferably with transparency used to highlight an image.
 * @returns {{}}
 * @constructor
 */
function ImageMapAug(imageIdL, mapIdL, updateFunctionL, fillColor) {

    const toggleAttribute = "toggled";

    /**
     *
     * @param ids array of ids to toggle.
     */
    function populateAreas(ids) {
        var map = document.getElementById(this.mapId);
        if (map === null) {
            throw "Found no map elements with id " + this.mapId;
        }
        if (ids.constructor !== Array) {
            throw "ids isn't an array " + ids;
        }
        var childNodes = Array.from(map.childNodes);
        var codeAttribute = this.codeAttribute;
        childNodes.forEach(function (child) {
            if (child.nodeType !== Node.TEXT_NODE && child.nodeType !== Node.COMMENT_NODE) {
                if (contains.call(ids, child.getAttribute(codeAttribute))) {
                    child.setAttribute(toggleAttribute, 1);
                } else {
                    child.setAttribute(toggleAttribute, 0);
                }
            }
        });
    }

    function getDictionary() {
        var dictionary = {};
        var map = document.getElementById(this.mapId);
        if (map === null) {
            throw "Found no map elements with id " + this.mapId;
        }
        var childNodes = Array.from(map.childNodes);
        var codeAttribute = this.codeAttribute;

        childNodes.forEach(function (child) {
            if (child.nodeType !== Node.TEXT_NODE  && child.nodeType !== Node.COMMENT_NODE) {
                var codeAttributeValue = child.getAttribute(codeAttribute);
                if (!child.hasAttribute(toggleAttribute) || child.getAttribute(toggleAttribute) == 0) {
                    dictionary[codeAttributeValue] = 0;
                } else {
                    dictionary[codeAttributeValue] = 1;
                }
            }
        });
        return dictionary;
    }

    function getPos(el) {
        // yay readability
        for (var lx=0, ly=0;
             el != null;
             lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
        return {x: lx,y: ly};
    }


    /**
     * Highlight the selected areas over the image.
     */
    function renderMap() {


        function createDrawingCanvas() {
            canvas = document.createElement("canvas");
            canvas.id = this.imageId + "canvas";
            console.log("Created a canvas with id: " + canvas.id);
            canvas.style.position = "absolute";

            var checkTime = 100; //100 ms interval
            var check = setInterval(function() {
                if (image.offsetWidth === 0) 
                {
                    canvas.style.left = "-1px";
                    canvas.style.top = "-1px";
                    canvas.width = "0px";
                    canvas.height = "0px";
                    
                } else 
                {   
                    var position = getPos(image);
                    if (canvas.style.left !== position.x+"px" || canvas.style.top !== position.y+"px")
                    {
                        canvas.style.left = position.x + "px";
                        canvas.style.top = position.y + "px";
                        canvas.width = image.width;
                        canvas.height = image.height;
                        renderMap.call(canvas.imageMapAug);
                    }
                }

            }, checkTime);
            canvas.zIndex = 2000;
            canvas.imageMapAug = this;
        }

        var imageId = this.imageId;
        var mapId = this.mapId;

        var image = document.getElementById(imageId);
        if (image === null) throw "Image with id " + imageId + " not found.";
        var canvas = document.getElementById(imageId + "canvas");
        if (canvas === null) {
            createDrawingCanvas.call(this);
            canvas.onclick = clickOnImage;
            document.body.appendChild(canvas);
        }
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var map = document.getElementById(this.mapId);
        if (map === null) {
            throw "Found no map elements with id " + mapId;
        }
        var childNodes = Array.from(map.childNodes);
        var fillColor  = this.fillColor;
        childNodes.forEach(function (child) {
            if (child.nodeType !== Node.TEXT_NODE  && child.nodeType !== Node.COMMENT_NODE) {
                if (child.getAttribute(toggleAttribute) == 1) {
                    draw(ctx, child.getAttribute("coords").split(","), fillColor);
                }
            }
        });

    }

    /**
     * Toggle an area.
     * @param area
     * @param imageMapAug
     */
    function toggle(area, imageMapAug) {
        var newValue = 1;
        if (area.hasAttribute(toggleAttribute)) {
            var val = area.getAttribute(toggleAttribute);
            if (val == 1) newValue = 0;
        }
        area.setAttribute(toggleAttribute, newValue);
        console.info("Toggled " + area + " to " + newValue);
        imageMapAug.renderMap();
        if (imageMapAug.updateFunction != null) {
            imageMapAug.updateFunction(imageMapAug.getDictionary());
        }
    }

    /**
     * We must find the area map that is behind the canvas. The trick is to hide the canvas quickly.
     * Find the element at x, y and render the map again.
     * @param event A click event.
     */
    function clickOnImage(event) {
        // find the element at x,y
        // toggle it.
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE");
        var pageXcorrection = 0;
        var pageYcorrection = 0;

        if (msie !== -1)
        {
            var pageXcorrection = window.pageXOffset;
            var pageYcorrection = window.pageYOffset;
        }
        var canvas = document.elementFromPoint(event.x - pageXcorrection, event.y - pageYcorrection);
        
        var mapId = canvas.imageMapAug.mapId;
        var canvasPos = getPos(canvas);
        var area = findAreaByMapId(mapId, event.pageX - canvasPos.x, event.pageY - canvasPos.y, canvas);
        if (area != null)
        {
            toggle(area, canvas.imageMapAug);            
        }
    }
    
    function findAreaByMapId(mapId, x, y, canvas)
    {
        var map = document.getElementById(mapId);
        var childNodes = Array.from(map.childNodes);
        var area = null;
        var tempcanvas = document.createElement("canvas");
        tempcanvas.width = canvas.width;
        tempcanvas.height = canvas.height;
        
        var ctx = tempcanvas.getContext("2d");

        childNodes.forEach(function (child) {
            if (child.nodeType !== Node.TEXT_NODE  && child.nodeType !== Node.COMMENT_NODE ) {
                ctx.clearRect(0, 0, tempcanvas.width, tempcanvas.height);
                draw(ctx, child.getAttribute("coords").split(","), "rgb(255,212,0)");
                var p = ctx.getImageData(x, y, 1, 1).data; 
                if (p[0] !== 0)
                    area = child;
            }
        });
        return area;
    }
    

    /**
     * Draw the image according to the coordinates.
     * @param ctx Canvas drawing context.
     * @param coords Coords as from imageMap.
     * @param fillColor color to fill the image up with.
     */
    function draw(ctx, coords, fillColor) {
        function drawPoly(ctx, coords) {
            ctx.beginPath();
            ctx.moveTo(coords[0], coords[1]);

            for (var index = 2; index < coords.length; index += 2) {
                ctx.lineTo(coords[index], coords[index + 1]);
            }
            ctx.closePath();
            ctx.fill();
        }

        /**
         *
         * @param ctx
         * @param coords x, y, radius
         */
        function drawCircle(ctx, coords) {
            ctx.beginPath();
            ctx.arc(coords[0], coords[1], coords[2], 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        }

        /**
         *
         * @param ctx Context
         * @param coords int[]
         */
        function drawRectangle(ctx, coords) {
            ctx.fillRect(coords[0], coords[1], coords[2] - coords[0], coords[3] - coords[1]);
        }

        ctx.fillStyle = fillColor;

        if (coords.length < 3) {
            throw "Unexpectedly low coordinates: " + coords.length + " " + coords;
        }
        if (coords.length === 4) {
            drawRectangle(ctx, coords);
        }
        else if (coords.length === 3) {
            drawCircle(ctx, coords);
        } else {
            drawPoly(ctx, coords);
        }

    }


    var contains = function (needle) {
        // Per spec, the way to identify NaN is that it is not equal to itself
        var findNaN = needle !== needle;
        var indexOf;

        if (!findNaN && typeof Array.prototype.indexOf === 'function') {
            indexOf = Array.prototype.indexOf;
        } else {
            indexOf = function (needle) {
                var i = -1, index = -1;

                for (i = 0; i < this.length; i++) {
                    var item = this[i];

                    if ((findNaN && item !== item) || item === needle) {
                        index = i;
                        break;
                    }
                }

                return index;
            };
        }

        return indexOf.call(this, needle) > -1;
    };

    var obj = {};
    obj.codeAttribute = "code";
    obj.imageId = imageIdL;
    obj.mapId = mapIdL;
    obj.updateFunction = updateFunctionL;
    obj.renderMap = renderMap;
    obj.populateAreas = populateAreas;
    obj.getDictionary = getDictionary;
    obj.fillColor = fillColor;
    return obj;
}