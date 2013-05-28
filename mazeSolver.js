// Write a function that reads in a string
// representation of a maze and outputs a
// string of letters; N, S, E or W where each
// letter corresponds to North, South, East or West
// such that the maze is solved from the top left
// corner to the bottom right.

// Correct output for maze below:
// 'EE SS EEE NN EEEEE EEEEE S E SSSSS EE SSS'
// based on => start: (1, 1); end: (10, 19)

var maze = '_____________________\n' +
           '|_  |  ___     _   _|\n' +
           '| | |  _|___| |_  | |\n' +
           '|  _____|_  |  _|   |\n' +
           '| | |  _  |  _|_  | |\n' +
           '|___| | | |  _  | | |\n' +
           '| |_  |  _____| | |_|\n' +
           '| |___| |  _|   |_  |\n' +
           '|     | |___  |_  | |\n' +
           '|_| | |  _  |_| |_| |\n' +
           '|___|___|_______|__ |\n';


var _stringToMatrix = function(maze) {
  var matrix = [];
  var mazeRows = maze.split('\n');
  _(mazeRows).each(function(row) {
    matrix.push(row.split(''));
  });
  // Remove empty row
  matrix.pop();
  return matrix;
};


var _makeNodes = function() {
  var nodes = [];
  var matrix = _stringToMatrix(maze);
  for (var row = 0; row < matrix.length; row++) {
    var nodeRow = [];
    for (var col = 0; col < matrix[row].length; col++) {
      var node = new Node(matrix[row][col], row, col);
      node.x = col;
      node.y = row;
      nodeRow.push(node);
    }
    nodes.push(nodeRow);
  }
  return nodes;
};


var _north = function(node, graph, rowIndex, colIndex) {
  if (rowIndex > 0 && graph[rowIndex - 1][colIndex].token === ' ') {
    node.directions.N = graph[rowIndex - 1][colIndex];
  }
};


var _east  = function(node, graph, rowIndex, colIndex) {
  if (colIndex < graph[rowIndex].length - 1 &&
      rowIndex > 0 &&
      graph[rowIndex][colIndex + 1].token !== '|') {
    node.directions.E = graph[rowIndex][colIndex + 1];
  }
};


var _south = function(node, graph, rowIndex, colIndex) {
  if (rowIndex < graph.length - 1 && graph[rowIndex + 1][colIndex].token !== '|') {
    node.directions.S = graph[rowIndex + 1][colIndex];
  }
};


var _west  = function(node, graph, rowIndex, colIndex) {
  if (colIndex > 0 && rowIndex > 0 &&
      graph[rowIndex][colIndex - 1].token !== '|') {
    node.directions.W = graph[rowIndex][colIndex - 1];
  }
};


var _connect = function(node, graph, rowIndex, colIndex) {
  // Don't want to analyze walls
  if (node.token !== '|') {
    _north(node, graph, rowIndex, colIndex);
    _east(node, graph, rowIndex, colIndex);

    // Must not be an underscore to be eligible for a southern connection
    if (node.token !== '_') { _south(node, graph, rowIndex, colIndex); }
    _west(node, graph, rowIndex, colIndex);
  }
};


var _makeGraph = function() {
  var graph = _makeNodes();
  _(graph).each(function(row, rowIndex) {
    _(row).each(function(node, colIndex) {
      _connect(node, graph, rowIndex, colIndex);
    });
  });
  return graph;
};


// Kick off.
// To set START and END nodes, pass their coordinates in as tuples,
// like so: escapeTheMaze([1, 1], [10, 19]);
var escapeTheMaze = function(start, end) {
  console.log(maze);
  var graph = _makeGraph();
  var startNode = graph[start[0]][start[1]];
  var endNode = graph[end[0]][end[1]];
  // Following two lines set 'start' and 'end'
  // properties on the nodes, to distinguish
  // them from all other nodes. That way, when
  // 'currentNode.end' is truthy, we know we've found
  // our way through the maze.
  startNode.start = true;
  endNode.end = true;
  aStar.search(graph, startNode, endNode);
};


var Node = function(token, row, col) {
  Node.nodeId = Node.nodeId || 0;
  var self = this;
  var setProperties = function() {
    self.id = ++Node.nodeId;
    self.token = token;
    self.directions = {
      N: null,
      E: null,
      S: null,
      W: null
    };
    self.grossCost = 0;
    self.heuristicCost = 0;
    self.finalCost = self.grossCost + self.heuristicCost;
    self.parent = null;
  };
  setProperties();
};
