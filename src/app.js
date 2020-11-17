const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(request, response, next) {

  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid project ID!" })
  };

  return next();
};

app.use("/repositories/:id", validateProjectId);

app.get("/repositories", (request, response) => {

  return response.status(200).send(repositories);
});

app.post("/repositories", (request, response) => {

  const { title, techs, url } = request.body;
  const id = uuid();
  const likes = 0;

  const project = {
    id,
    title,
    url,
    techs,
    likes
  };

  repositories.push(project);

  return response.status(200).send(project);
});

app.put("/repositories/:id", (request, response) => {
  
  const { id } = request.params;
  const { title, techs, url } = request.body;
  
  const projectIndex = repositories.findIndex(project => project.id === id);
  
  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found!" });
  };
  
  const projectUpdate = {
    title,
    techs,
    url
  };

  const project = repositories[projectIndex];
  
  Object.keys(project).forEach(item => {
    if (item != 'id' && item != 'likes') {
      project[item] = projectUpdate[item] != project[item] ? projectUpdate[item] : project[item];
    };
  });

  repositories[projectIndex] = project;

  return response.status(200).send(project);
});

app.delete("/repositories/:id", (request, response) => {
  
  const { id } = request.params;

  const projectIndex = repositories.findIndex(project => project.id === id);
  
  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found!" });
  };

  repositories.splice(projectIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  
  const { id } = request.params;

  const projectIndex = repositories.findIndex(project => project.id === id);
  
  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found!" });
  };

  const project = repositories[projectIndex];
  
  project.likes += 1;

  return response.status(200).send(project)
});

module.exports = app;
