package com.example.backend.service;

import com.example.backend.model.Expense;
import com.example.backend.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public Expense updateExpense(Long id, Expense updatedExpense) {
        Expense existing = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
        existing.setDescription(updatedExpense.getDescription());
        existing.setCategory(updatedExpense.getCategory());
        existing.setAmount(updatedExpense.getAmount());
        existing.setDate(updatedExpense.getDate());
        return expenseRepository.save(existing);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}