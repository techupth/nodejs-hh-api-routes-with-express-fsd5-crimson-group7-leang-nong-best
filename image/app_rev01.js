import express from "express";
import { assignments } from "../data/assignments.js";
import { comments } from "../data/comments.js";

let assignmentsMockDatabase = assignments;
let commentsMockDatabase = comments;
const app = express();
const port = 4008;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/assignments", (req, res) => {
  let limit = req.query.limit;
  if (limit > 10) {
    return res.status(401).json({
      message: "Invalid request, limit must not exceeds 100 assignment.",
    });
  }
  const assignmentsResult = assignmentsMockDatabase.slice(0, limit);
  return res.json({
    data: assignmentsResult,
  });
});

app.get("/assignments/:assignmentId", (req, res) => {
  const assignmentIdFromClient = Number(req.params.assignmentId);
  let assignmentSelectById = assignmentsMockDatabase.filter(
    (item) => item.id === assignmentIdFromClient
  );

  return res.json({
    data: assignmentSelectById[0],
  });
});

// Create Assignment
app.post("/assignments", (req, res) => {
  let assignmentDataFromClient;
  let newAssignmentId;

  if (!assignmentsMockDatabase.length) {
    newAssignmentId = 1;
  } else {
    newAssignmentId =
      //.id access ค่าidล่าสุดของข้อมูล และบวก1 เป็นidใหม่
      assignmentsMockDatabase[assignmentsMockDatabase.length - 1].id + 1;
  }
  assignmentDataFromClient = {
    id: newAssignmentId,
    ...req.body,
  };

  assignmentsMockDatabase.push(assignmentDataFromClient);

  return res.json({
    message: "assignments has been created successfully.",
  });
});

app.put("/assignment/:assignmentId", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentId);

  const updateAssignmentData = {
    ...req.body,
  };

  const hasFound = assignmentsMockDatabase.find((item) => {
    return item.id === assignmentIdFromClient;
  });
  if (!hasFound) {
    return res.json({
      message: "No assignment to update",
    });
  }

  const assignmentIndex = assignmentsMockDatabase.findIndex((item) => {
    return item.id === assignmentIdFromClient;
  });

  assignmentsMockDatabase[assignmentIndex] = {
    id: assignmentIdFromClient,
    ...updateAssignmentData,
  };
  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient} has been updated successfully`,
  });
});

app.delete("/assignments/:assignmentId", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentId);

  // if have data,return true to "hasFound"
  const hasFound = assignmentsMockDatabase.find((item) => {
    return item.id === assignmentIdFromClient;
  });

  // ถ้าไม่มีก็ให้ Return error response กลับไปให้ Client
  if (!hasFound) {
    return res.json({
      message: "No assignment to delete",
    });
  }

  const newAssignmentData = assignmentsMockDatabase.filter((item) => {
    return item.id !== assignmentIdFromClient;
  });

  assignmentsMockDatabase = newAssignmentData;
  return res.json({
    message: "assignment has been deleted successfully.",
  });
});

app.get("/comments", (req, res) => {
  const limit = req.query.limit;
  if (limit > 100) {
    return res.status(401).json({
      message: "Invalid request. Can fetch up to 100 posts per request.",
    });
  }
  const commentsWithLimit = commentsMockDatabase.slice(0, limit);
  return res.json({
    data: commentsWithLimit,
  });
});

app.get("/comments/:commentId", (req, res) => {
  const commentIdFromClient = Number(req.params.commentId);
  let commentData = commentsMockDatabase.filter(
    (item) => item.id === commentIdFromClient
  );
  return res.json({
    data: commentData[0],
  });
});

app.post("/comments", (req, res) => {
  commentsMockDatabase.push({
    id: commentsMockDatabase[commentsMockDatabase.length - 1].id + 1,
    ...req.body,
  });
  return res.json({
    message: "comment has been created successfully.",
  });
});

app.put("/comments/:commentId", (req, res) => {
  let commentPostIdFromClient = Number(req.params.commentId);
  const commentPostIndex = commentsMockDatabase.findIndex((item) => {
    return item.id === commentPostIdFromClient;
  });
  commentsMockDatabase[commentPostIndex] = {
    id: commentPostIdFromClient,
    ...req.body,
  };
  return res.json({
    message: "comment has been updated successfully.",
  });
});

app.delete("/comments/:commentId", (req, res) => {
  let commentIdFromClient = Number(req.params.commentId);

  const newCommentData = commentsMockDatabase.filter((item) => {
    return item.id !== commentIdFromClient;
  });
  commentsMockDatabase = newCommentData;
  return res.json({
    message: "comment has been deleted successfully.",
  });
});

// ระบบสามารถที่จะดู Comment ทั้งหมดของ Assignment นั้นๆ ได้
app.get("/assignments/:assignmentId/comments", (req, res) => {
  const assignmentIdFromClient = Number(req.params.assignmentId);

  const assignmentComments = commentsMockDatabase.filter(
    (item) => item.assignmentId == assignmentIdFromClient
  );

  if (!assignmentComments.length) {
    return res.json({
      message: `No comments available on Assignment Id : ${assignmentIdFromClient}`,
    });
  }

  return res.json({
    data: assignmentComments,
  });
});

// ระบบสามารถที่จะเพิ่ม Comment ลงไปใน Assignment ได้
app.post("/assignments/:assignmentId/comments", (req, res) => {
  const assignmentIdFromClient = Number(req.params.assignmentId);

  // สร้าง id ใหม่ให้กับ comment
  const commentData = {
    id: commentsMockDatabase[commentsMockDatabase.length - 1].id + 1,
    ...req.body,
  };

  // Validate ก่อนว่ามี Assignment ให้เพิ่ม Comment หรือไม่
  const hasAssignment = assignmentsMockDatabase.find((item) => {
    return item.id === assignmentIdFromClient;
  });

  // ถ้าไม่ก็ให้ Return error response กลับไปหา Client
  if (!hasAssignment) {
    return res.json({
      message: "No assignment to add comments",
    });
  }

  // เพิ่ม commentData ลงใน Mock database
  commentsMockDatabase.push(commentData);

  return res.json({
    message: [
      `New comment of assignment id ${assignmentIdFromClient} has been created successfully`,
    ],
  });
});

app.get("/", (req, res) => {
  return res.send("Test Root OK");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
