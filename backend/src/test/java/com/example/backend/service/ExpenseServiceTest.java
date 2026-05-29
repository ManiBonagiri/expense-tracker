package com.example.backend.service;

import com.example.backend.model.Expense;
import com.example.backend.repository.ExpenseRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // enables Mockito — no Spring, no database
class ExpenseServiceTest {

    @Mock
    ExpenseRepository expenseRepository; // fake repository — no real DB calls

    @InjectMocks
    ExpenseService expenseService; // real service, but with fake repo injected

    @Test
    void getAllExpenses_returnsAllExpenses() {
        // ARRANGE — set up fake data
        Expense expense1 = new Expense();
        expense1.setId(1L);
        expense1.setDescription("Lunch");
        expense1.setAmount(150.0);

        Expense expense2 = new Expense();
        expense2.setId(2L);
        expense2.setDescription("Bus ticket");
        expense2.setAmount(30.0);

        when(expenseRepository.findAll()).thenReturn(List.of(expense1, expense2));

        // ACT — call the real method
        List<Expense> result = expenseService.getAllExpenses();

        // ASSERT — verify the result
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getDescription()).isEqualTo("Lunch");
        assertThat(result.get(1).getDescription()).isEqualTo("Bus ticket");
    }

    @Test
    void createExpense_savesAndReturnsExpense() {
        // ARRANGE
        Expense newExpense = new Expense();
        newExpense.setDescription("Coffee");
        newExpense.setAmount(60.0);

        when(expenseRepository.save(newExpense)).thenReturn(newExpense);

        // ACT
        Expense result = expenseService.createExpense(newExpense);

        // ASSERT
        assertThat(result.getDescription()).isEqualTo("Coffee");
        verify(expenseRepository, times(1)).save(newExpense); // confirm save was called once
    }

    @Test
    void deleteExpense_callsRepositoryDelete() {
        // ACT
        expenseService.deleteExpense(1L);

        // ASSERT — confirm deleteById was called with the right ID
        verify(expenseRepository, times(1)).deleteById(1L);
    }

    @Test
    void updateExpense_updatesFieldsAndSaves() {
        // ARRANGE — existing expense in DB
        Expense existing = new Expense();
        existing.setId(1L);
        existing.setDescription("Old description");
        existing.setAmount(100.0);

        // New data coming in from the request
        Expense updatedData = new Expense();
        updatedData.setDescription("New description");
        updatedData.setAmount(200.0);
        updatedData.setCategory("Food");
        updatedData.setDate(java.time.LocalDate.of(2026, 5, 29));

        when(expenseRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(expenseRepository.save(existing)).thenReturn(existing);

        // ACT
        Expense result = expenseService.updateExpense(1L, updatedData);

        // ASSERT
        assertThat(result.getDescription()).isEqualTo("New description");
        assertThat(result.getAmount()).isEqualTo(200.0);
        verify(expenseRepository, times(1)).save(existing);
    }
}