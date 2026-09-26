import { useEffect, useState } from 'react'
import './App.css'
function App() {
  const [tasks, setTasks] = useState([])
const [showModal, setShowModal] = useState(false)
const [editingTask, setEditingTask] = useState(null)
const [title, setTitle] = useState("")
const [description, setDescription] = useState("")
const [dueDate, setDueDate] = useState("")
const [searchTerm, setSearchTerm] = useState("")
const [filter, setFilter] = useState("all")
const [menuOpen, setMenuOpen] = useState(false)
const [loading, setLoading] = useState(true)
const [error, setError] = useState("")
const [darkMode, setDarkMode] = useState(false)
useEffect(() => {
  fetch('https://task-dashboard-backend-1g46.onrender.com/api/tasks')
    .then((response) => response.json())
    .then((data) => {
  setTasks(data)
  setLoading(false)
})
   .catch((error) => {
  console.error('Error fetching tasks:', error)
  setError("Failed to load tasks.")
  setLoading(false)
})
}, [])
const addTask = () => {
  fetch("https://task-dashboard-backend-1g46.onrender.com/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      description: description,
      dueDate: dueDate,
    }),
  })
    .then((response) => response.json())
    .then((newTask) => {
      setTasks([...tasks, newTask]);

      setTitle("");
      setDescription("");
      setDueDate("");

      setShowModal(false);
    })
    .catch((error) => {
      console.error("Error adding task:", error);
    });
};
const updateTaskStatus = (task) => {
  const newStatus =
    task.status === "Completed" ? "Pending" : "Completed";

    fetch(`https://task-dashboard-backend-1g46.onrender.com/api/tasks/${task.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: newStatus,
    }),
  })
    .then((response) => response.json())
    .then(() => {
      setTasks(
        tasks.map((item) =>
          item.id === task.id
            ? { ...item, status: newStatus }
            : item
        )
      );
    })
    .catch((error) => {
      console.error("Error updating task:", error);
    });
};
const deleteTask = (id) => {
  fetch(`https://task-dashboard-backend-1g46.onrender.com/api/tasks/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then(() => {
      setTasks(tasks.filter((task) => task.id !== id));
    })
    .catch((error) => {
      console.error("Error deleting task:", error);
    });
};

const editTask = (task) => {
  setEditingTask(task);
  setTitle(task.title);
  setDescription(task.description || "");
  setDueDate(task.due_date || "");
  setShowModal(true);
};
const saveEdit = () => {
  fetch(`https://task-dashboard-backend-1g46.onrender.com/api/tasks/edit/${editingTask.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      description: description,
      dueDate: dueDate,
    }),
  })
    .then((response) => response.json())
    .then(() => {
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                title: title,
                description: description,
                due_date: dueDate,
              }
            : task
        )
      );

      setEditingTask(null);
      setTitle("");
      setDescription("");
      setDueDate("");
      setShowModal(false);
    })
    .catch((error) => {
      console.error("Error editing task:", error);
    });
};
if (loading) {
  return (
    <div className="loading-message">
      <h2>Loading...</h2>
    </div>
  )
}

if (error) {
  return (
    <div className="loading-message">
      <h2>{error}</h2>
    </div>
  )
}
  return (
    
<div className={`dashboard ${darkMode ? "dark-mode" : ""}`}>
      {/* Sidebar */}
      <button
  className="menu-btn"
  onClick={() => setMenuOpen(!menuOpen)}
>
  ☰
</button>
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
<h2><span>✓</span> TaskDash</h2>
        <nav>
     <button onClick={() => {
  setFilter("all");
  setMenuOpen(false);
}}>
  ⌂ Dashboard
</button>

<button onClick={() => {
  setFilter("all");
  setMenuOpen(false);
}}>
  ☷ All Tasks
</button>

<button onClick={() => {
  setFilter("completed");
  setMenuOpen(false);
}}>
  ✓ Completed
</button>

<button onClick={() => {
  setFilter("pending");
  setMenuOpen(false);
}}>
  ◷ Pending
</button>
        </nav>
        <button
  className="settings"
  onClick={() => setDarkMode(!darkMode)}
>
  ⚙ {darkMode ? "Light Mode" : "Dark Mode"}
</button>
      </aside>

      {/* Main Content */}
<main
  className="main-content"
  onClick={() => {
    if (menuOpen) {
      setMenuOpen(false);
    }
  }}
>
        {/* Header */}
        <header className="header">
          <div>
            <h1>My Tasks</h1>
            <p>Manage your tasks and stay productive!</p>
          </div>

          <div className="header-right">
            <input
  type="text"
  placeholder="Search tasks..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
            <div className="avatar">AR</div>
          </div>
        </header>

        {/* Summary Cards */}
        <section className="stats">
  <div className="stat-card">
    <div className="stat-icon">☷</div>
    <div>
      <h2>{tasks.length}</h2>
      <p>Total Tasks</p>
    </div>
  </div>

  <div className="stat-card">
    <div className="stat-icon">✓</div>
    <div>
      <h2>{tasks.filter((task) => task.status === "Completed").length}</h2>
      <p>Completed</p>
    </div>
  </div>

  <div className="stat-card">
    <div className="stat-icon">◷</div>
    <div>
      <h2>{tasks.filter((task) => task.status === "Pending").length}</h2>
      <p>Pending</p>
    </div>
  </div>

  <div className="stat-card">
    <div className="stat-icon">!</div>
    <div>
      <h2>
  {tasks.filter(
    (task) =>
      task.status === "Pending" &&
      task.due_date &&
      new Date(task.due_date) < new Date()
  ).length}
</h2>
      <p>Overdue</p>
    </div>
  </div>
</section>

        {/* Tasks */}
        <section className="tasks-section">

          <button className="add-task" onClick={() => setShowModal(true)}>
  + Add Task
</button>

          <table>
            <thead>
              <tr>
                <th>✓</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>

  <tbody>
  {tasks
    .filter((task) =>
      (filter === "all" || task.status.toLowerCase() === filter) &&
      (
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .map((task) => (
    <tr key={task.id}>
      <td>
        <input
          type="checkbox"
          checked={task.status === "Completed"}
           onChange={() => updateTaskStatus(task)}
        />
      </td>

      <td>{task.title}</td>

      <td>
        {task.description || 'No description'}
      </td>

      <td>
        <span className={`status ${task.status === "Completed" ? "completed" : "pending"}`}>
  {task.status}
</span>
      </td>

<td>{task.due_date || "No date"}</td>
      <td>
        <button onClick={() => editTask(task)}>✎</button>
        <button onClick={() => deleteTask(task.id)}>🗑</button>
      </td>
    </tr>
  ))}
            </tbody>
          </table>

        </section>
{showModal && (
  <div className="modal-overlay">
    <div className="modal">
<h2>{editingTask ? "Edit Task" : "Add New Task"}</h2>
      <input 
  type="text" 
  placeholder="Task title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>

      <textarea 
  placeholder="Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>

      <input 
  type="date"
  value={dueDate}
  onChange={(e) => setDueDate(e.target.value)}
/>

      <div className="modal-actions">
        <button onClick={() => setShowModal(false)}>
          Cancel
        </button>

    <button onClick={editingTask ? saveEdit : addTask}>
  {editingTask ? "Save Changes" : "Add Task"}
</button>
      </div>
    </div>
  </div>
)}
      </main>
    </div>
  )
  
}

export default App