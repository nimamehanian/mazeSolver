// ----- ----- ----- ----- ----- -----
// A* algorithm
// Adapted from this article:
// http://www.policyalmanac.org/games/aStarTutorial.htm
// ----- ----- ----- ----- ----- -----

var aStar = {
  search: function(graph, startNode, endNode) {
    var openList = [];
    var closedList = [];
    openList.push(startNode);

    while (openList.length > 0) {
      // Grab node with lowest finalCost to process next
      // Index of openList pointing to node with lowest finalCost
      var lowInd = 0;
      for (var i = 0; i < openList.length; i++) {
        if (openList[i].finalCost < openList[lowInd].finalCost) { lowInd = i; }
      }

      var currentNode = openList[lowInd];

      // Base case: endNode found; return directions
      if (currentNode.end) {
        var node = currentNode;
        var directions = [];
        var route = [];

        while (node.parent) {
          route.push(node);
          node = node.parent;
        }

        // Nodes are pushed from last to first
        route.reverse();

        _(route).each(function(node) {
          _(node.directions).each(function(value, key) {
            if (value && value.id === node.parent.id) {
              if (key === 'N') { directions.push('S'); }
              if (key === 'S') { directions.push('N'); }
              if (key === 'E') { directions.push('W'); }
              if (key === 'W') { directions.push('E'); }
            }
          });
        });
        directions = directions.join(' ');
        console.log('Directions:', directions);
      }

      // Default case: move currentNode from openList into closedList,
      // and process its neighbors.

      // Simultaneously drop currentNode from openList and push into closedList
      for (node in openList) {
        if (openList[node].id === currentNode.id) {
          closedList.push(openList.splice(node, 1)[0]);
        }
      }

      // using 'aStar' instead of 'this', just to be safe
      var neighbors = aStar.neighbors(graph, currentNode);
      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];

        // Don't want to process walls or prev. traversed nodes
        if (_(closedList).contains(neighbor) || neighbor.token === '|') { continue; }

        var grossCost = currentNode.grossCost + 10;
        var lowestGrossCost = false;

        if (!_(openList).contains(neighbor)) {
          // First encounter of this node, so it must be best choice
          lowestGrossCost = true;

          // Calculate its heuristicCost, since it hasn't been done yet
          neighbor.heuristicCost = aStar.heuristic(neighbor, endNode);
          openList.push(neighbor);
        } else if (grossCost < neighbor.grossCost) {
          lowestGrossCost = true;
        }

        if (lowestGrossCost) {
          // Optimal path (thus far) to this node,
          // so we set the neighbor's parent to be the currentNode
          neighbor.parent = currentNode;
          neighbor.grossCost = grossCost;
          neighbor.finalCost = neighbor.grossCost + neighbor.heuristicCost;
        }
      }
    }
    // No path found
    return [];
  },


  heuristic: function(neighbor, endNode) {
    // Manhattan method
    var dist1 = Math.abs(endNode.y - neighbor.y);
    var dist2 = Math.abs(endNode.x - neighbor.x);
    return dist1 + dist2;
  },


  neighbors: function(graph, currentNode) {
    var neighbors = [];
    var x = currentNode.x;
    var y = currentNode.y;

    // Gather neighbors (above, below, left, and right of currentNode)

    // North
    if (y > 0 && graph[y - 1][x].token === ' ') {
      neighbors.push(graph[y - 1][x]);
    }

    // South
    if (y < graph.length - 1 && graph[y + 1][x].token !== '|' &&
        currentNode.token !== '_') {
      neighbors.push(graph[y + 1][x]);
    }

    // East
    if (x < graph[y].length - 1 &&
        y > 0 &&
        graph[y][x + 1].token !== '|') {
      neighbors.push(graph[y][x + 1]);
    }

    // West
    if (x > 0 && y > 0 &&
        graph[y][x - 1].token !== '|') {
      neighbors.push(graph[y][x - 1]);
    }

    return neighbors;
  }
};
