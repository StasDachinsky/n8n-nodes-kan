module.exports = {
  nodes: [
    './dist/nodes/Kan/KanTask.node.js',
    './dist/nodes/Kan/KanProject.node.js',
    './dist/nodes/Kan/KanBoard.node.js',
    './dist/nodes/Kan/KanComment.node.js',
    './dist/nodes/Kan/KanWebhook.node.js',
    './dist/nodes/Kan/KanUser.node.js',
  ],
  credentials: [
    './dist/credentials/KanApi.credentials.js',
  ],
};