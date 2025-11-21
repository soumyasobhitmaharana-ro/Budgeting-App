// Utility functions for preparing analytics data

/**
 * Get last 6 months in YYYY-MM format
 */
export const getLast6Months = () => {
  const months = [];
  const today = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    months.push(`${year}-${month}`);
  }
  
  return months;
};

/**
 * Prepare monthly spending trend data (last 6 months)
 */
export const prepareMonthlySpendingTrend = (expenses = []) => {
  const months = getLast6Months();
  const monthMap = {};
  
  // Initialize all months with 0
  months.forEach(month => {
    monthMap[month] = 0;
  });
  
  // Sum expenses by month
  expenses.forEach(expense => {
    if (!expense.date) return;
    const expenseDate = new Date(expense.date);
    const month = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, "0")}`;
    
    if (monthMap.hasOwnProperty(month)) {
      monthMap[month] += parseFloat(expense.amount || 0);
    }
  });
  
  return months.map(month => ({
    month,
    expense: monthMap[month] || 0,
  }));
};

/**
 * Prepare category-wise spending breakdown
 */
export const prepareCategorySpending = (expenses = [], categories = []) => {
  const categoryMap = {};
  
  expenses.forEach(expense => {
    const categoryId = expense.categoryId;
    if (!categoryId) return;
    
    const category = categories.find(cat => cat.id === categoryId);
    const categoryName = category ? `${category.icon} ${category.name}` : "Unknown";
    
    if (!categoryMap[categoryId]) {
      categoryMap[categoryId] = {
        category: categoryName,
        amount: 0,
        categoryId,
      };
    }
    
    categoryMap[categoryId].amount += parseFloat(expense.amount || 0);
  });
  
  // Convert to array and sort by amount (descending)
  return Object.values(categoryMap)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10); // Top 10 categories
};

/**
 * Prepare income vs expense comparison (last 6 months)
 */
export const prepareIncomeExpenseComparison = (incomes = [], expenses = []) => {
  const months = getLast6Months();
  const incomeMap = {};
  const expenseMap = {};
  
  // Initialize all months with 0
  months.forEach(month => {
    incomeMap[month] = 0;
    expenseMap[month] = 0;
  });
  
  // Sum incomes by month
  incomes.forEach(income => {
    if (!income.date) return;
    const incomeDate = new Date(income.date);
    const month = `${incomeDate.getFullYear()}-${String(incomeDate.getMonth() + 1).padStart(2, "0")}`;
    
    if (incomeMap.hasOwnProperty(month)) {
      incomeMap[month] += parseFloat(income.amount || 0);
    }
  });
  
  // Sum expenses by month
  expenses.forEach(expense => {
    if (!expense.date) return;
    const expenseDate = new Date(expense.date);
    const month = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, "0")}`;
    
    if (expenseMap.hasOwnProperty(month)) {
      expenseMap[month] += parseFloat(expense.amount || 0);
    }
  });
  
  return months.map(month => ({
    month,
    income: incomeMap[month] || 0,
    expense: expenseMap[month] || 0,
  }));
};

/**
 * Calculate this month's spending
 */
export const calculateThisMonthSpending = (expenses = []) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  return expenses
    .filter(expense => {
      if (!expense.date) return false;
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    })
    .reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
};

/**
 * Calculate this month's income
 */
export const calculateThisMonthIncome = (incomes = []) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  return incomes
    .filter(income => {
      if (!income.date) return false;
      const incomeDate = new Date(income.date);
      return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
    })
    .reduce((sum, income) => sum + parseFloat(income.amount || 0), 0);
};

/**
 * Find highest spending category
 */
export const findHighestSpendingCategory = (expenses = [], categories = []) => {
  const categoryMap = {};
  
  expenses.forEach(expense => {
    const categoryId = expense.categoryId;
    if (!categoryId) return;
    
    if (!categoryMap[categoryId]) {
      categoryMap[categoryId] = 0;
    }
    
    categoryMap[categoryId] += parseFloat(expense.amount || 0);
  });
  
  // Find category with highest spending
  let highestCategoryId = null;
  let highestAmount = 0;
  
  Object.entries(categoryMap).forEach(([categoryId, amount]) => {
    if (amount > highestAmount) {
      highestAmount = amount;
      highestCategoryId = categoryId;
    }
  });
  
  if (!highestCategoryId) return null;
  
  const category = categories.find(cat => cat.id === parseInt(highestCategoryId));
  
  return {
    id: highestCategoryId,
    name: category ? category.name : "Unknown",
    icon: category ? category.icon : "📊",
    amount: highestAmount,
  };
};

/**
 * Calculate percentage change from last month
 */
export const calculateChangeFromLastMonth = (expenses = []) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Calculate current month spending
  const currentMonthSpending = expenses
    .filter(expense => {
      if (!expense.date) return false;
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    })
    .reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
  
  // Calculate last month spending
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  const lastMonthSpending = expenses
    .filter(expense => {
      if (!expense.date) return false;
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
    })
    .reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
  
  if (lastMonthSpending === 0) return 0;
  
  return ((currentMonthSpending - lastMonthSpending) / lastMonthSpending) * 100;
};

