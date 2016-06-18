// start slingin' some d3 here.
var numberOfEnemies = 10;

var generateCircle = function() {

  var circle = {};
  circle.radius = 25;
  // circle.cx = randomCoordinate();
  // circle.cy = randomCoordinate();

  circle.randomCoordinate = function () {
    return (Math.floor(Math.random() * (750 - circle.radius * 2)) + circle.radius);
  };

  return circle;
};

var enemyArray = [];
for (var i = 0; i <= numberOfEnemies; i++) {
  enemyArray.push(generateCircle());
}

var playerArray = [];
playerArray.push(generateCircle());

var gameBoard = d3.select('body')
                  .append('svg')
                  .classed({'board': true})
                  .style('background-color', 'black')
                  .style('height', '750px')
                  .style('width', '750px');

var moveEnemies = function(enemyArray) {

  var enemies = gameBoard.selectAll('.enemy')
                          .data(enemyArray);

  // UPDATE
  // update enemies' position
  enemies.transition()
            .duration(1000)
            .attr('cx', function(d) { return d.randomCoordinate(); })
            .attr('cy', function(d) { return d.randomCoordinate(); });

  // ENTER
  // create new enemies if they don't exist, and assign them random coordinate
  enemies.enter().append('circle')
          .attr('cx', function(d) { return d.randomCoordinate(); })
          .attr('cy', function(d) { return d.randomCoordinate(); })
          .attr('r', function(d) { return d.radius; })
          .classed({'enemy': true})
          .style('fill', 'white');

  // EXIT
  // remove excess enemies
  enemies.exit().remove();

};

var addPlayersToBoard = function(playerArray) {
  var players = gameBoard.selectAll('.player')
                          .data(playerArray);

  var drag = d3.behavior.drag();

  var origin = drag.origin(function(d) {
    return d;
  });

  drag.on('drag', function(d, i) {
    d.cx += d3.event.dx;
    d.cy += d3.event.dy;
    d3.select(this).attr('transform', function(d, i) {
      console.log("d.cx", d.cx);
      return 'translate(' + [5, 5] + ')';
    });
  });

  drag.on('dragstart', function() {
    console.log('starting drag');
  });

  drag.on('dragend', function() {
    console.log('ending drag');
  });

  // ENTER
  // create new enemies if they don't exist, and assign them random coordinate
  players.enter().append('circle')
          .attr('cx', function(d) { return d.randomCoordinate(); })
          .attr('cy', function(d) { return d.randomCoordinate(); })
          .attr('r', function(d) { return d.radius; })
          .classed({'player': true})
          .style('fill', 'red')
          //.attr('transform', 'translate(' + cx + ',' + cy + ')')
          .call(drag);

  // players.on('click', function() {
  //   console.log('you just dragged me :(');
  // });

  // EXIT
  // remove excess enemies
  players.exit().remove();
};



//Add player to board in a random spot
addPlayersToBoard(playerArray);

// Make enemies move every second
setInterval(function() {
  moveEnemies(enemyArray);
}, 1000);