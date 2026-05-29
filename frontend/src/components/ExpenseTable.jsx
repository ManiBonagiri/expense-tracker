function ExpenseTable({ expenses, onDelete, onEdit }) {
  if (expenses.length === 0) {
    return (
      <div className="table-card">
        <h2>Expenses</h2>
        <p className="empty-state">No expenses yet. Add one above!</p>
      </div>
    );
  }

  // Calculate total
  const total = expenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0
  );

  return (
    <div className="table-card">
      <div className="table-header">
        <h2>Expenses</h2>
        <span className="total-badge">
          Total: ₹{total.toFixed(2)}
        </span>
      </div>

      <table className="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.date}</td>
              <td>
                <span className={`category-tag cat-${expense.category?.toLowerCase()}`}>
                  {expense.category}
                </span>
              </td>
              <td>{expense.description || "—"}</td>
              <td className="amount-cell">₹{parseFloat(expense.amount).toFixed(2)}</td>
              <td className="actions-cell">
                <button
                  className="btn btn-edit"
                  onClick={() => onEdit(expense)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => onDelete(expense.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseTable;