// Bad: Inconsistent function patterns, redundant code, no TypeScript

// Format date - multiple similar functions
export function formatDate1(date) {
  return new Date(date).toLocaleDateString();
}

export const formatDate2 = (date) => {
  const d = new Date(date);
  return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
};

// Format currency - inconsistent parameter order and style
export function formatMoney(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}



// Global variable - bad practice
window.formatSettings = {
  decimalPlaces: 2,
  thousandSeparator: ','
};

// Mutates input - side effect
const formatName = (user) => {
  user.fullName = `${user.firstName} ${user.lastName}`;
  return user;
};



// Adding to window object - pollutes global namespace
window.formatUtils = {
  formatDate: formatDate2,
  formatMoney
};
