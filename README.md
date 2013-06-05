Maze Solver
==========

http://mehanian.com/mazeSolver/

In the last week of Hack Reactor, we were set loose to delve into anything we wanted.
Graphs and graph algorithms were in my queue of intriguing things I wanted to learn about,
so I took it upon myself to spend a few days learning how to generate a graph data structure,
from a string representation of a maze. After that was complete, I began reading about the many
options for path-finding. I chose the A* (A-Star) algorithm, because it offered just what I wanted.
Dijkstra's algorithm is super, but sub-optimal when you know exactly where you want to go. It expands
quickly. It's more of a bomb, where A* is a laser. I did not implement diagonals on this first rendition,
so I wouldn't use this for production--but merely for educational purposes.
