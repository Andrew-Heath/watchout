// start slingin' some d3 here.

//SCOREBOARD CODE

var scores = [{'highscore': 0, 'currentscore': 0, 'collisions': 0}];

var collisionFlag = false;

var updateScores = function(scores) {
  var scoreBoard = d3.select('.scoreboard')
                     .data(scores);

  scoreBoard.select('.collisions')
            .select('span')
            .text(function(d) { 
              return d.collisions;
            });

  scoreBoard.select('.current')
            .select('span')
            .text(function(d) { 
              return d.currentscore;
            });

  scoreBoard.select('.highscore')
            .select('span')
            .text(function(d) { 
              return d.highscore;
            });
};



//Circle class for all objects
var Circle = function() {

  var circle = {};
  circle.radius = 25;

  circle.randomCoordinate = function () {
    return (Math.floor(Math.random() * (750 - circle.radius * 2)) + circle.radius);
  };

  circle.cx = circle.randomCoordinate();
  circle.cy = circle.randomCoordinate();  

  return circle;
};

var numberOfEnemies = 10;
//Creating all enemies
var enemyArray = [];
for (var i = 0; i <= numberOfEnemies; i++) {
  enemyArray.push(Circle());
}

var playerArray = [];
playerArray.push(Circle());

var gameBoard = d3.select('body')
                  .append('svg')
                  .classed({'board': true})
                  .style('background-color', 'black')
                  .style('height', '750px')
                  .style('width', '750px');

// Add pattern to gameBoard to house images
gameBoard.append('defs').append('pattern')
          .attr('id', 'deathStarPattern')
          .attr('width', 50)
          .attr('height', 50)
          .append('image')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', 50)
          .attr('height', 50)
          .attr('xlink:href', 'deathstar.png')
          // Animation to cause enemy image pattern to rotate
          .append('animateTransform')
          .attr('attributeName', 'transform')
          .attr('type', 'rotate')
          .attr('from', '0 25 25')
          .attr('to', '360 25 25')
          .attr('begin', '0')
          .attr('dur', '1s')
          .attr('repeatCount', 'indefinite');

gameBoard.append('defs').append('pattern')
          .attr('id', 'alderaanPattern')
          .attr('width', 50)
          .attr('height', 50)
          .append('image')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', 50)
          .attr('height', 50)
          .attr('xlink:href', 'alderaan.png');


var moveEnemies = function(enemyArray) {

  var enemies = gameBoard.selectAll('.enemy')
                          .data(enemyArray);

  // UPDATE
  // update enemies' position
  enemies.transition()
            .duration(1000)
            .attr('cx', function(d) { return d.randomCoordinate(); })
            .attr('cy', function(d) { return d.randomCoordinate(); })
            .tween('collision', collisionDetection);

  // ENTER
  // create new enemies if they don't exist, and assign them random coordinate
  enemies.enter().append('circle')
          .attr('cx', function(d) { return d.randomCoordinate(); })
          .attr('cy', function(d) { return d.randomCoordinate(); })
          .attr('r', function(d) { return d.radius; })
          .attr('fill', 'url(#deathStarPattern)')
          .classed({'enemy': true});
          // .attr('transform', function(d) {
          //   return 'rotate(360 ' + d.cx + ' ' + d.cy + ')';
          // });
          // .append('animateTransform')
          // .attr('attributeName', 'transform')
          // .attr('type', 'rotate')
          // .attr('from', '0')
          // .attr('to', '360')
          // .attr('begin', '0')
          // .attr('dur', '1s')
          // .attr('repeatCount', 'indefinite');

  // EXIT
  // remove excess enemies
  enemies.exit().remove();

};

var addPlayersToBoard = function(playerArray) {
  //UPDATE
  var players = gameBoard.selectAll('.player')
                          .data(playerArray);

  var drag = d3.behavior.drag();

  var origin = drag.origin(function(d) {
    return d;
  });

  var px = 0;
  var py = 0;

  drag.on('drag', function(d, i) {
    d.cx += d3.event.dx;
    d.cy += d3.event.dy;
    d3.select(this)
    .attr('cx', function(d) { 
      var coord = d.cx;
      if (coord < 25) {
        coord = 25;
      } else if (coord > 725) {
        coord = 725;
      }
      return coord;
    })
    .attr('cy', function(d) {
      var coord = d.cy;
      if (coord < 25) {
        coord = 25;
      } else if (coord > 725) {
        coord = 725;
      }
      return coord;
    });
  });

  drag.on('dragstart', function() {
    console.log('starting drag');
  });

  drag.on('dragend', function() {
    console.log('ending drag');
  });

  // ENTER
  // create new players if they don't exist, and assign them random coordinate
  players.enter().append('circle')
          .attr('cx', function(d) { return d.cx; })
          .attr('cy', function(d) { return d.cy; })
          .attr('r', function(d) { return d.radius; })
          .classed({'player': true})
          .attr('fill', 'url(#alderaanPattern)')
          .call(drag);

  // EXIT
  // remove excess enemies
  players.exit().remove();
};


// COLLISION CODE

var collision = function(thisCircle, otherCircle) {
  collisionFlag = true;
};

var collisionDetection = function() {  
  return function() {
    var enemyCircle = d3.select(this);

    d3.select('.player').each(function() {
      var playerCircle = d3.select(this);

      if (enemyCircle.datum() !== playerCircle.datum()) {

        dx = enemyCircle.attr('cx') - playerCircle.attr('cx'),
          dy = enemyCircle.attr('cy') - playerCircle.attr('cy'),
          distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        if (distance < +enemyCircle.attr('r') + +playerCircle.attr('r')) {
          collision(enemyCircle, playerCircle);
        }
      }
    });
  };
};

//COLLISION CODE OVER

//Add player to board in a random spot
addPlayersToBoard(playerArray);

// Make enemies move every second
setInterval(function() {
  moveEnemies(enemyArray);

  if (collisionFlag === true) {
    collisionFlag = false;
    scores[0].collisions++;
    scores[0].currentscore = 0;
  }
  updateScores(scores);
}, 1000);

setInterval(function() {
  scores[0].currentscore++;

  if (scores[0].currentscore > scores[0].highscore) {
    scores[0].highscore = scores[0].currentscore;
  }
  updateScores(scores);
}, 100);