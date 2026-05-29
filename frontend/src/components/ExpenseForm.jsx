import { useState, useEffect } from "react";

// Empty starting state for the form
const emptyForm = {
  amount: "",
  category: "",
  description: "",
  date: "",
};

function ExpenseForm({ onSave, editingExpense, onCancelEdit }) {
  const [formData, setFormData] = useState(emptyForm);

  // When editingExpense changes (user clicked Edit), pre-fill the form
  useEffect(() => {
    if (editingExpense) {
      setFormData({
        amount: editingExpense.amount,
        category: editingExpense.category,
        description: editingExpense.description,
        date: editingExpense.date,
      });
    } else {
      setFormData(emptyForm); // reset form when cancel or after save
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.date) {
      alert("Amount, Category and Date are required.");
      return;
    }
    onSave(formData); // passes data up to App.jsx
    setFormData(emptyForm); // clear form after submit
  };

  return (
    <div className="form-card">
      <h2>{editingExpense ? "Edit Expense" : "Add New Expense"}</h2>

      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Amount (₹) *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Health">Health</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What was this expense for?"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingExpense ? "Update Expense" : "Add Expense"}
          </button>
          {editingExpense && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;