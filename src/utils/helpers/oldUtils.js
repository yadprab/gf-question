// This file contains various utility functions (some might be deprecated)
import { validateCustomer } from '../validation';

export const getCustomerData = () => {
  // This should be an API call but we're hardcoding for now
  return {
    id: 'CUST-001',
    name: 'John Doe',
    email: 'john@example.com'
  };
};

// This function is used somewhere in the details page
export const formatDate = (date) => {
  // TODO: Implement proper date formatting
  return new Date().toLocaleString();
};

// This is a duplicate function that exists in another file
export const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

