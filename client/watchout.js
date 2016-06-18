// start slingin' some d3 here.
var numberOfEnemies = 10;


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
          .attr('xlink:href', 'deathstar.png');

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
          // .style('fill', 'white');

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
    .attr('cx', function(d) { return d.cx; })
    .attr('cy', function(d) { return d.cy; });
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

  // players.on('click', function() {
  //   console.log('you just dragged me :(');
  // });

  // EXIT
  // remove excess enemies
  players.exit().remove();
};


// COLLISION CODE

var collision = function(thisCircle, otherCircle) {
  console.log('Collision at: ' + thisCircle.attr('cx') + ',' + thisCircle.attr('cy'));
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
}, 1000);