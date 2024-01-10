import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";

let assignmentsDataBase = assignments;
let commentsDataBase = comments;

const app = express();
const port = 4002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/assignments", (req, res) => {
  const limit = req.query.limit;

  if (limit > 10) {
    return res.status(401).json({
      message: "Invalid request, limit must not exceeds 10 assignments",
    });
  }

  const assignmentsPostWithLimit = assignmentsDataBase.slice(0, limit);
  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentsPostWithLimit,
  });
});

app.get("/assignments/:assignmentsId", (req, res) => {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);
  let assignmentsData = assignmentsDataBase.filter(
    (item) => item.id === assignmentsIdFromClient
  );

  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentsData[0],
  });
});

app.post("/assignments", (req, res) => {
  const assignmentsDataFromClient = req.body;
  assignmentsDataBase.push({
    id: assignmentsDataBase[assignmentsDataBase.length - 1].id + 1,
    ...assignmentsDataFromClient,
  });

  return res.json({
    message: "New assignment has been created successfully",
    data: [
      {
        id: assignmentsDataBase[assignmentsDataBase.length - 1].id + 1,
        ...assignmentsDataFromClient,
      },
    ],
  });
});

app.delete("/assignments/:assignmentsId", (req, res) => {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);

  if (assignmentsIdFromClient !== assignmentsDataBase.id) {
    return res.status(401).json({
      message: "Cannot delete, No data available!",
    });
  }

  const newAssignmentsData = assignmentsDataBase.filter((item) => {
    return item.id !== assignmentsIdFromClient;
  });

  assignmentsDataBase = newAssignmentsData;

  return res.json({
    message: `Assignment Id : ${assignmentsIdFromClient} has been deleted successfully`,
  });
});

app.put("/assignments/:assignmentsId", (req, res) => {
  const assignmentsDataFromClient = req.body;
  let assignmentsIdFromClient = Number(req.params.assignmentsId);

  if (assignmentsIdFromClient !== assignmentsDataBase.id) {
    return res.status(401).json({
      message: "Cannot edit, No data available!",
    });
  }

  const assignmentsIndex = assignmentsDataBase.findIndex((item) => {
    return item.id === assignmentsIdFromClient;
  });
  assignmentsDataBase[assignmentsIndex] = {
    id: assignmentsIdFromClient,
    ...assignmentsDataFromClient,
  };
  return res.json({
    message: `Assignment Id : ${assignmentsIdFromClient} has been updated successfully`,
    data: [
      {
        id: assignmentsIdFromClient,
        ...assignmentsDataFromClient,
      },
    ],
  });
});

app.get("/assignments/:assignmentsId/comments", (req, res) => {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);

  let commentsData = commentsDataBase.filter(
    (item) => item.assignmentId === assignmentsIdFromClient
  );
  return res.json({
    message: "Complete fetching comments",
    data: commentsData,
  });
});

app.post("/assignments/:assignmentsId/comments", (req, res) => {
  const commentsDataFromClient = req.body;
  commentsDataBase.push({
    id: commentsDataBase[commentsDataBase.length - 1].id + 1,
    ...commentsDataFromClient,
  });

  return res.json({
    message: "New comment has been created successfully",
    data: [
      {
        id: commentsDataBase[commentsDataBase.length - 1].id + 1,
        ...commentsDataFromClient,
      },
    ],
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
