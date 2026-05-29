import { useState, useEffect } from "react";
import axios from "axios";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseTable from "./components/ExpenseTable";
import "./App.css";

const API_URL = "/api/expenses";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null); // holds expense being edited

  // Fetch all expenses from Spring Boot on page load
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(API_URL);
      setExpenses(response.data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  // Called by ExpenseForm when user submits — handles both create and update
  const handleSave = async (expenseData) => {
    try {
      if (editingExpense) {
        // PUT — update existing
        await axios.put(`${API_URL}/${editingExpense.id}`, expenseData);
        setEditingExpense(null);
      } else {
        // POST — create new
        await axios.post(API_URL, expenseData);
      }
      fetchExpenses(); // refresh the table
    } catch (error) {
      console.error("Failed to save expense:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense); // pre-fills the form
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Expense Tracker</h1>
        <p className="subtitle">CI/CD Learning Project — Mani Bonagiri</p>
      </header>

      <main>
        <ExpenseForm
          onSave={handleSave}
          editingExpense={editingExpense}
          onCancelEdit={handleCancelEdit}
        />
        <ExpenseTable
          expenses={expenses}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </main>
    </div>
  );
}

export default App;