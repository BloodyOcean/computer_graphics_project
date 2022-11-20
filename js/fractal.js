
function download() {
    var canvas = document.getElementById("viewport");
    var anchor = document.createElement("a");
    anchor.href = canvas.toDataURL("image/png");
    anchor.download = "IMAGE.PNG";
    anchor.click();
}

function create() {

    var scale = document.getElementById("typeNumber").value;

    console.log(scale)

    // емпірично підібрані коефіцієнти для відцентрування фракталу
    var xLimit = 2.38 / scale;
    var yLimit = 5 / scale;

    var canvas = document.getElementById("viewport");
    var ctx = canvas.getContext("2d");

    var CANVAS_WIDTH = canvas.width;
    var CANVAS_HEIGHT = canvas.height;

    var imagedata = ctx.createImageData(CANVAS_WIDTH, CANVAS_HEIGHT);
    var counter = 10;

    //цикл по всіх точках канвасу
    for (var row = 0; row < CANVAS_HEIGHT; row++) {
        for (var col = 0; col < CANVAS_WIDTH; col++) {
            //конвертування в нові координати з початком в центрі канвасу
            var x = (col - CANVAS_WIDTH / xLimit) * yLimit / CANVAS_WIDTH;
            var y = (row - CANVAS_HEIGHT / xLimit) * yLimit / CANVAS_WIDTH;

            var iteration = 0;

            //процес обрахування кількості можливих ітерацій для заданої точки
            while (Math.abs(x + y) < 16 && iteration < counter + 1) {
                var x_new = (x * Math.sin(x) * Math.cosh(y) - y * Math.cos(x) * Math.sinh(y));
                y = (y * Math.sin(x) * Math.cosh(y) + x * Math.cos(x) * Math.sinh(y));
                x = x_new;
                iteration++;
            }

            var color;

            //підбір кольору відносно кількості пройдених ітерацій
            if (iteration < counter) {

                var colid = parseInt(document.getElementById('color-list').value);

                switch (colid) {
                    case 1:
                        var r = (10 * iteration % 256).toString(16);
                        var g = (20 * iteration % 256).toString(16);
                        var b = (30 * iteration % 256).toString(16);
                        break;

                    case 2:
                        var r = (110 * iteration % 256).toString(16);
                        var g = (200 * iteration % 256).toString(16);
                        var b = (188 * iteration % 256).toString(16);
                        break;

                    case 3:
                        var r = (123 * iteration % 256).toString(16);
                        var g = (125 * iteration % 256).toString(16);
                        var b = (126 * iteration % 256).toString(16);
                        break;
                }

                ctx.fillStyle = '#' + r + g + b;
                ctx.fillRect(col, row, 1, 1);
            } else {
                ctx.fillStyle = 'black';
                ctx.fillRect(col, row, 1, 1);
            }

        }
    }

}
