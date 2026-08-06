const express = require("express");
const store = require("../data/store");

const router = express.Router();

function validateStudentPayload(body, { partial = false } = {}) {
  const errors = [];

  if (!partial || body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim() === "") {
      errors.push("name is required and must be a non-empty string");
    }
  }

  if (!partial || body.email !== undefined) {
    if (typeof body.email !== "string" || body.email.trim() === "") {
      errors.push("email is required and must be a non-empty string");
    }
  }

  if (!partial || body.age !== undefined) {
    const age = Number(body.age);
    if (!Number.isInteger(age) || age < 1) {
      errors.push("age is required and must be a positive integer");
    }
  }

  return errors;
}

router.post("/", (req, res) => {
  const errors = validateStudentPayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const student = store.createStudent({
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    age: Number(req.body.age),
  });

  return res.status(201).json(student);
});

router.get("/", (_req, res) => {
  res.json(store.getAllStudents());
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid student id" });
  }

  const student = store.getStudentById(id);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  return res.json(student);
});

router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid student id" });
  }

  const errors = validateStudentPayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const student = store.updateStudent(id, {
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    age: Number(req.body.age),
  });

  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  return res.json(student);
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid student id" });
  }

  const errors = validateStudentPayload(req.body, { partial: true });
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const updates = {};
  if (req.body.name !== undefined) {
    updates.name = req.body.name.trim();
  }
  if (req.body.email !== undefined) {
    updates.email = req.body.email.trim();
  }
  if (req.body.age !== undefined) {
    updates.age = Number(req.body.age);
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No valid fields provided to update" });
  }

  const student = store.updateStudent(id, updates);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  return res.json(student);
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid student id" });
  }

  const deleted = store.deleteStudent(id);
  if (!deleted) {
    return res.status(404).json({ error: "Student not found" });
  }

  return res.status(204).send();
});

module.exports = router;
