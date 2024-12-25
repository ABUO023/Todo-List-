// Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push, remove, update, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCU3TLp24zCs0qd9aYl9nm0J-H_8PAA2vg",
  authDomain: "todo-a3b9a.firebaseapp.com",
  databaseURL: "https://todo-a3b9a-default-rtdb.firebaseio.com/", // RTDB URL
  projectId: "todo-a3b9a",
  storageBucket: "todo-a3b9a.appspot.com",
  messagingSenderId: "325065425131",
  appId: "1:325065425131:web:0027de6e2f80d173fcfeae",
  measurementId: "G-XYJL92WC37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // Initialize Firebase Database

// Event listener for adding tasks
document.getElementById("addTaskBtn").addEventListener("click", () => {
  const taskInput = document.getElementById("newTask").value;
  if (taskInput.trim()) {
    const task = { task: taskInput, completed: false };

    // Push task to Firebase
    const tasksRef = ref(db, 'todos'); // Get the reference for todos
    push(tasksRef, task)
      .then(() => {
        console.log("Task added to Firebase!");
      })
      .catch((error) => {
        console.error("Error adding task to Firebase:", error);
      });

    // Clear input field
    document.getElementById("newTask").value = '';
  } else {
    console.log("No task entered.");
  }
});

// Display tasks from Firebase
onValue(ref(db, 'todos'), (snapshot) => {
  const tasks = snapshot.val();
  console.log("Fetched tasks from Firebase:", tasks);  // Log tasks fetched from Firebase
  const taskList = document.getElementById("todoList");
  taskList.innerHTML = '';  // Clear the list before adding new items

  if (tasks) {
    for (const key in tasks) {
      const task = tasks[key];

      // Create a list item for each task
      const li = document.createElement("li");
      li.textContent = task.task;

      // Add class if task is completed
      if (task.completed) {
        li.classList.add("completed");
      }

      // Create a delete button for each task
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");

      // Add event listener to delete the task
      deleteBtn.addEventListener("click", () => {
        deleteTask(key);  // Pass the task's unique key to delete it from Firebase
      });

      // Add event listener to mark the task as completed
      li.addEventListener("click", () => {
        toggleCompleted(key, task.completed); // Toggle task completion in Firebase
      });

      // Append delete button to list item
      li.appendChild(deleteBtn);

      // Append list item to the task list
      taskList.appendChild(li);
    }
  } else {
    console.log("No tasks in the database.");
  }
});

// Function to delete a task from Firebase
function deleteTask(taskKey) {
  const taskRef = ref(db, 'todos/' + taskKey);  // Get reference to the task in Firebase
  remove(taskRef)
    .then(() => {
      console.log("Task deleted from Firebase!");
    })
    .catch((error) => {
      console.error("Error deleting task from Firebase:", error);
    });
}

// Function to toggle task completion status
function toggleCompleted(taskKey, currentCompletedStatus) {
  const taskRef = ref(db, 'todos/' + taskKey);  // Get reference to the task in Firebase
  update(taskRef, { completed: !currentCompletedStatus }) // Toggle completion
    .then(() => {
      console.log("Task completion toggled in Firebase!");
    })
    .catch((error) => {
      console.error("Error toggling task completion:", error);
    });
}
