// GRAPHICS

paper.install(window);

// globals
var speed = 10;

var opacities = {
  'faint': 0.2,
  'light': 0.5,
  'dark': 1
}
var currOpacity = opacities['faint'];

var sizes = {
  'small': 2,
  'medium': 10,
  'large': 20
}
var currSize = 10;

var colors = {
  'red': '#e00000',
  'blue': '#044ae0',
  'yellow': '#ffdf2b'
};
var currColor = colors['red'];

var dest = {
  x: null, y: null
};

var isDrawing = false;
var startedDrawing = false;
var drawingPath;
var pencil;

window.onload = function() {
	// Setup directly from canvas id:
	paper.setup('myCanvas');
  pencil = new Path.Circle(new Point(80, 50), currSize);
  pencil.strokeColor = 'black';
  pencil.fillColor = currColor;
  pencil.fillColor.alpha = currOpacity;
  drawingPath = new Path();
  
  dest = {
    x: Math.floor(view.size.width * Math.random()),
    y: Math.floor(view.size.height * Math.random())
  };

  view.onFrame = function(event) {
    if (event.count % 2) return;
    var vector = {
      x: dest.x - pencil.position.x,
      y: dest.y - pencil.position.y,
    };
    length = Math.sqrt(vector.x*vector.x + vector.y*vector.y)

    pencil.position.x += (vector.x/length)*speed; 
    pencil.position.y += (vector.y/length)*speed; 
   
    if (isDrawing && !startedDrawing) {
      drawingPath = new Path();
      pencil.insertBelow(drawingPath)
      drawingPath.strokeColor = currColor;
      drawingPath.strokeWidth = currSize*2;
      drawingPath.strokeJoin = 'round';
      drawingPath.strokeCap = 'round';
      drawingPath.opacity = currOpacity;
      startedDrawing = true;
    }

    if (isDrawing) {
      drawingPath.add(new Point(pencil.position.x, pencil.position.y));
    }

    if (length < 20) {
      if (isDrawing) {
        drawingPath.flatten();
      }
      dest = {
        x: Math.floor(view.size.width * Math.random()),
        y: Math.floor(view.size.height * Math.random())
      };
    }
  }
}

function initializePath() {
  drawingPath = new Path();
  drawingPath.strokeColor = currColor;
  drawingPath.strokeWidth = currSize*2;
  drawingPath.strokeJoin = 'round';
  drawingPath.strokeCap = 'round';
  drawingPath.opacity = currOpacity;
}

function resetPencil() {
  let prevPos = {
    x: pencil.position.x,
    y: pencil.position.y
  }
  pencil.remove();
  pencil = new Path.Circle(new Point(prevPos.x, prevPos.y), currSize);
  pencil.strokeColor = 'black';
  pencil.fillColor = currColor;
  pencil.fillColor.alpha = currOpacity;
}


// VOICE
const artyom = new Artyom();

voiceCommands = [
  {
    indexes: ['stop'],
    action: (i) => {
      isDrawing = false;
      startedDrawing = false;
    }
  },
  {
    indexes: ['start'],
    action: (i) => {
      isDrawing = true;
    }
  },
  {
    indexes: ['red', 'blue', 'yellow'],
    action: function(i) {
      if (i==0) currColor = colors['red'];
      if (i==1) currColor = colors['blue'];
      if (i==2) currColor = colors['yellow'];
      initializePath();
      resetPencil();
    }
  },
  {
    indexes: ['small', 'medium', 'large'],
    action: (i) => {
      if (i==0) currSize = sizes['small'];
      if (i==1) currSize = sizes['medium'];
      if (i==2) currSize = sizes['large'];
      initializePath();
      resetPencil();
    }
  },
  {
    indexes: ['faint', 'light', 'dark'],
    action: (i) => {
      if (i==0) currOpacity = opacities['faint'];
      if (i==1) currOpacity = opacities['light'];
      if (i==2) currOpacity = opacities['dark'];
      initializePath();
      resetPencil();
    }
  }

]
//Updated to artyom v 0.6
artyom.addCommands(voiceCommands);

artyom.initialize({
  lang:"en-GB",
  debug:true, // Show what recognizes in the Console
  listen:true, // Start listening after this
  continuous: true,
  speed:0.9, // Talk a little bit slow
  mode:"normal" // This parameter is not required as it will be normal by default
});

