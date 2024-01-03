let tessellation = 0 //Setting this lower than 1 will make it look like the mirror dimension and setting it higher than 1 will make it look like Terraria.

const insert = (arr, index, newItem) => [
    // part of the array before the specified index
    ...arr.slice(0, index),
    // inserted item
    newItem,
    // part of the array after the specified index
    ...arr.slice(index)
]

function squares(field, h, rez) {
    let poly_raw = [];
    let poly = []


    if (tessellation < 0.25) tessellation = 0.25;
    if (tessellation > 5) tessellation = 5;

    for (let i = 0; i < field.length - 1; i++) {
        for (let j = 0; j < field[i].length - 1; j++) {
            let f0 = field[i][j] - h;
            let f1 = field[i + 1][j] - h;
            let f2 = field[i + 1][j + 1] - h;
            let f3 = field[i][j + 1] - h;

            
            //tessellation = f0 * 3

            //if (tessellation < 0.25) tessellation = 0.25;
            //if (tessellation > 1) tessellation = 1;
            
            //tessellation = 1 / tessellation

            let x = i * rez;
            let y = j * rez;
            let a = createVector(x + rez * ((f0 / (f0 - f1)) / tessellation), y);
            let b = createVector(x + rez, y + rez * ((f1 / (f1 - f2)) / tessellation));
            let c = createVector(x + rez * ((1 - f2 / (f2 - f3)) / tessellation), y + rez);
            let d = createVector(x, y + rez * ((1 - f3 / (f3 - f0))) / tessellation);

            let state = getState(f0, f1, f2, f3);
            switch (state) {
                case 1:
                    addLine(c, d, poly_raw);
                    break;
                case 2:
                    addLine(b, c, poly_raw);
                    break;
                case 3:
                    addLine(b, d, poly_raw);
                    break;
                case 4:
                    addLine(a, b, poly_raw);
                    break;
                case 5:
                    addLine(a, d, poly_raw);
                    addLine(b, c, poly_raw);
                    break;
                case 6:
                    addLine(a, c, poly_raw);
                    break;
                case 7:
                    addLine(a, d, poly_raw);
                    break;
                case 8:
                    addLine(a, d, poly_raw);
                    break;
                case 9:
                    addLine(a, c, poly_raw);
                    break;
                case 10:
                    addLine(a, b, poly_raw);
                    addLine(c, d, poly_raw);
                    break;
                case 11:
                    addLine(a, b, poly_raw);
                    break;
                case 12:
                    addLine(b, d, poly_raw);
                    break;
                case 13:
                    addLine(b, c, poly_raw);
                    break;
                case 14:
                    addLine(c, d, poly);
                    break;
            }
        }
    }



    poly = Delaunator.from(poly_raw, i => i.x, i => i.y);
    poly.coords = poly_raw;


    return poly;
}

function addLine(v1, v2, poly_raw) {
    poly_raw.push(v1)
    poly_raw.push(v2)
}

function getState(a, b, c, d) {
    return (a > 0 ? 8 : 0) + (b > 0 ? 4 : 0) + (c > 0 ? 2 : 0) + (d > 0 ? 1 : 0);
}