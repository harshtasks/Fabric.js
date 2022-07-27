var canvas = new fabric.Canvas('canvas-fb', {
    backgroundColor: 'rgb(75, 75, 75)'
});

function moveImage(event) {
    let delta = event.e.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 3) zoom = 3;
    if (zoom < 1) {
        zoom = 1;
        let changes = canvas.viewportTransform
        let changeY = changes[5]
        let changeX = changes[4]
        // canvas.viewportTransform = [1, 0, 0, 1, 0, 0]

        // Change the image position to difference between the x and y 
        // transform on the canvas and animate that
        image.animate({left: initLeft-changeX, top: initTop-changeY}, {
            onChange: canvas.renderAll.bind(canvas),
            duration: 200
        });
        canvas.renderAll();
    }
    canvas.zoomToPoint({ x: event.e.offsetX, y: event.e.offsetY }, zoom);
    event.e.preventDefault();
    event.e.stopPropagation();
}

var image = new Image();
var initLeft = 0, initTop = 0;
imgFile = document.getElementById('imgfile')
imgFile.addEventListener('change', (event) => {
    var reader = new FileReader();
    reader.onload = function (event) {
        // Make new image and get data uri
        var img = new Image();
        img.src = event.target.result;
        img.onload = function () {
            image = new fabric.Image(img);
            image.set({left: 0, top: 0});
            
            if (img.width > img.height) {
                image.scaleToWidth(canvas.width);
            } else {
                image.scaleToHeight(canvas.height);
            }
            image.hasControls = false;

            image.on('mousewheel', (event) => {
                moveImage(event);
            });

            // Center image object and store left
            canvas.centerObject(image);
            initLeft = image.left
            initTop = image.top
            // Add the image to canvas
            canvas.setActiveObject(image);
            canvas.add(image);
            canvas.renderAll();
        }
    }
    // Reads the data uri of the input file
    reader.readAsDataURL(event.target.files[0]);
});

function throttle (callback, limit) {
    var waiting = false;
    return function () {
        if (!waiting) {
            callback.apply(this, arguments);
            waiting = true;
            setTimeout(function () {
                waiting = false;
            }, limit);
        }
    }
}
