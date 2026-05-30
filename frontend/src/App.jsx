import { useState, useEffect } from "react";
import axios from "axios";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseTable from "./components/ExpenseTable";
import "./App.css";

const API_URL = "/api/expenses";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(API_URL);
      setExpenses(response.data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${API_URL}/summary`);
      setSummary(response.data);
    } catch (error) {
      console.error("Failed to fetch summary:", error);
    }
  };

  const handleSave = async (expenseData) => {
    try {
      if (editingExpense) {
        await axios.put(`${API_URL}/${editingExpense.id}`, expenseData);
        setEditingExpense(null);
      } else {
        await axios.post(API_URL, expenseData);
      }
      fetchExpenses();
      fetchSummary();
    } catch (error) {
      console.error("Failed to save expense:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchExpenses();
      fetchSummary();
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  const handleEdit = (expense) => setEditingExpense(expense);
  const handleCancelEdit = () => setEditingExpense(null);

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

        {Object.keys(summary).length > 0 && (
          <div className="summary-card">
            <h2>Spending by Category</h2>
            <div className="summary-grid">
              {Object.entries(summary).map(([category, total]) => (
                <div className="summary-item" key={category}>
                  <div className="cat-label">{category}</div>
                  <div className="cat-amount">₹{total.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

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