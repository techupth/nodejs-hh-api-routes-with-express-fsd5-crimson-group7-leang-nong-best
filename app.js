// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";

let commentsDataBase = comments;
let assignmentsDataBase = assignments;

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/assignments", function (req, res) {
  const limit = req.query.limit;

  if (limit > 10) {
    return res.status(401).json({
      message: "Invalid request,limit must not exceeds 10 assignments",
    });
  }

  const assignments = assignmentsDataBase.slice(0, limit);

  return res.json({
    message: "Complete Fetching assignments",
    data: assignments,
  });
});

app.get("/assignments/:assignmentsId", function (req, res) {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);
  let assignmentData = assignmentsDataBase.filter(
    (item) => item.id === assignmentsIdFromClient
  );
  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentData[0],
  });
});

app.get("/assignments/:assignmentsId/comments", function (req, res) {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);
  let commentData = commentsDataBase.filter(
    (item) => item.id === assignmentsIdFromClient
  );
  return res.json({
    message: "Complete fetching comments",
    data: commentData[0],
  });
});

app.post("/assignments", function (req, res) {
  assignmentsDataBase.push({
    id: assignmentsDataBase[assignmentsDataBase.length - 1].id + 1,
    ...req.body,
  });
  return res.json({
    message: "New assignment has been created successfully",
    data: [
      {
        id: assignmentsDataBase[assignmentsDataBase.length - 1].id + 1,
        ...req.body,
      },
    ],
  });
});

app.delete("/assignments/:assignmentsId", function (req, res) {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);
  const newassignmentsData = assignmentsDataBase.filter(
    (item) => item.id !== assignmentsIdFromClient
  );
  assignmentsDataBase = newassignmentsData;
  return res.json({
    message: `Assignment Id: ${assignmentsIdFromClient} has been deleted successfully`,
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
    message: "Assignment Id : <assignmentsId>  has been updated successfully",
    data: [{ id: assignmentsIdFromClient, ...req.body }],
  });
});

app.listen(port, () => {
  console.log(`server is running at ${port}`);
});
