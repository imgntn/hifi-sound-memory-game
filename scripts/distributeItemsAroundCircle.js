//adapted from C# at http://answers.unity3d.com/questions/28215/instantiate-prefabs-in-a-circle-or-elipsoid.html


var IS_VERTICAL = true;
var circleBoxes=[];
function distribute(_numberOfPoints, radiusX, radiusY) {

    var centrePos = {
        x: 100,
        y: 100,
        z: 100
    }

    for (var pointNum = 0; pointNum < _numberOfPoints; pointNum++) {
        // "i" now represents the progress around the circle from 0-1
        // we multiply by 1.0 to ensure we get a fraction as a result.
        var i = (pointNum * 1.0) / _numberOfPoints;

        // get the angle for this step (in radians, not degrees)
        var angle = i * Math.PI * 2;

        // the X &amp; Y position for this angle are calculated using Sin &amp; Cos
        var x = Math.sin(angle) * radiusX;
        var y = Math.cos(angle) * radiusY;


        if (IS_VERTICAL) {
            var pos = {
                x: x + centrePos.x,
                y: y + centrePos.y,
                z: 0 + centrePos.z
            }

        } else {


            var pos = {
                x: x + centrePos.x,
                y: 0 + centrePos.z,
                z: y + centrePos.y
            }
        }


        print('CREATE AT:' + pos.x + "/" + pos.y + "/" + pos.z);
        var size = 3;
        var myBox = {
            type: 'Sphere',
            dimensions: {
                x: size,
                y: size,
                z: size
            },
            position: {
                x: pos.x,
                y: pos.y,
                z: pos.z
            },
            color: {
                red: Math.random() * 255,
                green: Math.random() * 255,
                blue: Math.random() * 255
            },
            collisionsWillMove: false,
            gravity: {
                x: 0,
                y: 0,
                z: 0
            }
        };
        circleBoxes.push(Entities.addEntity(myBox));
    }


}
//to use:
distribute(24, 50, 50);