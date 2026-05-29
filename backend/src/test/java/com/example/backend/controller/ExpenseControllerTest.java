package com.example.backend.controller;

import com.example.backend.model.Expense;
import com.example.backend.service.ExpenseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ExpenseController.class) // loads only the web layer — no DB needed
class ExpenseControllerTest {

    @Autowired
    MockMvc mockMvc; // simulates HTTP requests without a real server

    @MockBean
    ExpenseService expenseService; // fake service injected into the controller

    @Autowired
    ObjectMapper objectMapper; // converts objects to JSON

    @Test
    void GET_expenses_returnsListOfExpenses() throws Exception {
        // ARRANGE
        Expense expense = new Expense();
        expense.setId(1L);
        expense.setDescription("Lunch");
        expense.setAmount(150.0);

        when(expenseService.getAllExpenses()).thenReturn(List.of(expense));

        // ACT + ASSERT
        mockMvc.perform(get("/api/expenses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].description").value("Lunch"))
                .andExpect(jsonPath("$[0].amount").value(150.0));
    }

    @Test
    void POST_expense_createsAndReturnsExpense() throws Exception {
        // ARRANGE
        Expense expense = new Expense();
        expense.setDescription("Coffee");
        expense.setAmount(60.0);

        when(expenseService.createExpense(any(Expense.class))).thenReturn(expense);

        // ACT + ASSERT
        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(expense)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Coffee"));
    }

    @Test
    void DELETE_expense_returns200() throws Exception {
        // ACT + ASSERT
        mockMvc.perform(delete("/api/expenses/1"))
                .andExpect(status().isNoContent());

        verify(expenseService, times(1)).deleteExpense(1L);
    }
}