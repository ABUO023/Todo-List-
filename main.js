// Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCU3TLp24zCs0qd9aYl9nm0J-H_8PAA2vg",
  authDomain: "todo-a3b9a.firebaseapp.com",
  projectId: "todo-a3b9a",
  storageBucket: "todo-a3b9a.firebasestorage.app",
  messagingSenderId: "325065425131",
  appId: "1:325065425131:web:0027de6e2f80d173fcfeae",
  measurementId: "G-XYJL92WC37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Database
const db = getDatabase(app);

// Linked List class
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insert(data) {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
  }

  display() {
    let current = this.head;
    let tasks = [];
    while (current) {
      tasks.push(current.data);
      current = current.next;
    }
    return tasks;
  }
}

// Initialize LinkedList
const todoList = new LinkedList();

// Event listener for adding tasks
document.getElementById("addTaskBtn").addEventListener("click", () => {
  const taskInput = document.getElementById("newTask").value;
  if (taskInput.trim()) {
    const task = { task: taskInput, completed: false };

    // Add task to LinkedList
    todoList.insert(task);

    // Push task to Firebase
    push(ref(db, 'todos'), task);

    // Clear input field
    document.getElementById("newTask").value = '';
  }
});

// Display tasks from Firebase and update LinkedList
onValue(ref(db, 'todos'), (snapshot) => {
  const tasks = snapshot.val();
  const taskList = document.getElementById("todoList");
  taskList.innerHTML = ''; // Clear current list

  // Update LinkedList with Firebase data
  for (const key in tasks) {
    const task = tasks[key];
    todoList.insert(task); // Insert into LinkedList

    // Create and append list item
    const li = document.createElement("li");
    li.textContent = task.task;
    if (task.completed) {
      li.classList.add("completed");
    }
    taskList.appendChild(li);
  }
});
