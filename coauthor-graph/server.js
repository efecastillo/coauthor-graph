const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// Shared graph state: nodes and edges
const graph = {
  nodes: [],  // { id, label, x, y, color }
  edges: [],  // { id, from, to }
};

let nextNodeId = 1;
let nextEdgeId = 1;

function broadcastCount() {
  io.emit('connect-count', io.engine.clientsCount);
}

io.on('connection', (socket) => {
  broadcastCount();
  // Send current graph state to the newly connected client
  socket.emit('init', graph);

  socket.on('disconnect', broadcastCount);

  socket.on('add-node', (data) => {
    const node = {
      id: nextNodeId++,
      label: data.label.trim(),
      x: data.x ?? Math.random() * 600 - 300,
      y: data.y ?? Math.random() * 400 - 200,
      color: data.color ?? '#97c2fc',
    };
    graph.nodes.push(node);
    io.emit('node-added', node);
  });

  socket.on('update-node', (data) => {
    const node = graph.nodes.find((n) => n.id === data.id);
    if (!node) return;
    if (data.label !== undefined) node.label = data.label.trim();
    if (data.x !== undefined) node.x = data.x;
    if (data.y !== undefined) node.y = data.y;
    if (data.color !== undefined) node.color = data.color;
    io.emit('node-updated', node);
  });

  socket.on('delete-node', (id) => {
    graph.nodes = graph.nodes.filter((n) => n.id !== id);
    // Remove all edges involving this node
    const removedEdges = graph.edges.filter((e) => e.from === id || e.to === id);
    graph.edges = graph.edges.filter((e) => e.from !== id && e.to !== id);
    io.emit('node-deleted', { id, removedEdgeIds: removedEdges.map((e) => e.id) });
  });

  socket.on('add-edge', (data) => {
    // Prevent duplicate edges
    const exists = graph.edges.some(
      (e) =>
        (e.from === data.from && e.to === data.to) ||
        (e.from === data.to && e.to === data.from)
    );
    if (exists) return;
    const edge = { id: nextEdgeId++, from: data.from, to: data.to };
    graph.edges.push(edge);
    io.emit('edge-added', edge);
  });

  socket.on('delete-edge', (id) => {
    graph.edges = graph.edges.filter((e) => e.id !== id);
    io.emit('edge-deleted', id);
  });

  socket.on('clear-graph', () => {
    graph.nodes = [];
    graph.edges = [];
    nextNodeId = 1;
    nextEdgeId = 1;
    io.emit('graph-cleared');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Coauthor graph server running on http://localhost:${PORT}`);
});
