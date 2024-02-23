import axios from 'axios';

export const apiRequest = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const Fetcher = (url: string) => apiRequest.get(url).then((res) => res.data);

// Dashboard
export const getDashboard = async () => apiRequest.get('/');

// Wealth
export const getWealth = async () => apiRequest.get('/Wealth');

// Incomes
export const getIncomes = async () => apiRequest.get('/Incomes');
export const createIncome = async (data: unknown) => apiRequest.post('/Incomes', data);
export const updateIncome = async (data: unknown) => apiRequest.put('/Incomes', data);
export const deleteIncome = async (id: string) => apiRequest.delete(`/Incomes/${id}`);

// Expenses
export const getExpenses = async () => apiRequest.get('/Expenses');
export const createExpenses = async (data: unknown) => apiRequest.post('/Expenses', data);
export const updateExpense = async (data: unknown) => apiRequest.put('/Expenses', data);
export const deleteExpense = async (id: string) => apiRequest.delete(`/Expenses/${id}`);

// Investments
export const getInvestments = async () => apiRequest.get('/Investments');
export const createInvestments = async (data: unknown) => apiRequest.post('/Investments', data);
export const updateInvestment = async (data: unknown) => apiRequest.put('/Investments', data);
export const deleteInvestment = async (id: string) => apiRequest.delete(`/Investments/${id}`);

// Profile
export const getProfile = async () => apiRequest.get('/Profile');
export const updateProfile = async (data: unknown) => apiRequest.put('/Profile', data);
