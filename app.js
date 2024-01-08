// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";

let assignmentsDataBase = assignments;

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/assignments", function (req, res) {
  const limit = req.query.limit;

  if (limit > 10) {
    return res.status(401).json({
      message: "Invalid request. Can fetch up to 10 posts per request.",
    });
  }

  const assignments = assignmentsDataBase.slice(0, limit);

  return res.json({
    data: assignments,
  });
});

app.get("/assignments/:assignmentsId", function (req, res) {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);
  let assignmentData = assignmentsDataBase.filter(
    (item) => item.id === assignmentsIdFromClient
  );
  return res.json({
    data: assignmentData[0],
  });
});

app.post("/assignments", function (req, res) {
  assignmentsDataBase.push({
    id: assignmentsDataBase[assignmentsDataBase.length - 1].id + 1,
    ...req.body,
  });
  return res.json({
    message: "Assignment has been created successfully",
  });
});

app.delete("/assignments/:assignmentsId", function (req, res) {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);
  const newassignmentsData = assignmentsDataBase.filter(
    (item) => item.id !== assignmentsIdFromClient
  );
  assignmentsDataBase = newassignmentsData;
  return res.json({
    message: "Assignment has been deleted successfully",
  });
});

app.put("/assignments/:assignmentsId", function (req, res) {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);
  const assignmentsIndex = assignmentsDataBase.findIndex(
    (item) => item.id === assignmentsIdFromClient
  );
  assignmentsDataBase[assignmentsIndex] = {
    id: assignmentsIdFromClient,
    ...req.body,
  };
  return res.json({
    message: "Assignment has been updated successfully",
  });
});

app.listen(port, () => {
  console.log(`server is running at ${port}`);
});
