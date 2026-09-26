const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("SERVER WORKS");
});

app.get("/api/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      console.error("GET ERROR:", err.message);
      return res.status(500).json({ error: err.message });
    }

    console.log("DATABASE ROWS:", rows);

    res.json(rows);
  });
});

app.post("/api/tasks", (req, res) => {
  const { title, description, dueDate } = req.body;

  const sql = `
    INSERT INTO tasks (title, description, status, due_date)
    VALUES (?, ?, ?, ?)
  `;

  db.run(
    sql,
    [title, description || "", "Pending", dueDate || ""],
    function (err) {
      if (err) {
        console.error("POST ERROR:", err.message);
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        id: this.lastID,
        title,
        description: description || "",
        status: "Pending",
        due_date: dueDate || ""
      });
    }
  );
});
app.put("/api/tasks/:id", (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  db.run(
    "UPDATE tasks SET status = ? WHERE id = ?",
    [status, id],
    function (err) {
      if (err) {
        console.error("UPDATE ERROR:", err.message);
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "Task updated successfully"
      });
    }
  );
});
app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;

  db.run(
    "DELETE FROM tasks WHERE id = ?",
    [id],
    function (err) {
      if (err) {
        console.error("DELETE ERROR:", err.message);
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "Task deleted successfully"
      });
    }
  );
});
app.put("/api/tasks/edit/:id", (req, res) => {
  const { title, description, dueDate } = req.body;
  const { id } = req.params;

  db.run(
    `UPDATE tasks
     SET title = ?, description = ?, due_date = ?
     WHERE id = ?`,
    [title, description || "", dueDate || "", id],
    function (err) {
      if (err) {
        console.error("EDIT ERROR:", err.message);
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "Task edited successfully"
      });
    }
  );
});
const PORT = process.env.PORT || 5050;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});