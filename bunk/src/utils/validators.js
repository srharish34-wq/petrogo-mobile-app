/**
 * Validators
 * Location: bunk/src/utils/validators.js
 */

export const validateEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 && /^[6-9]/.test(cleaned);
};

export const validatePassword = (password) => {
  if (!password) return false;
  return password.length >= 6;
};

export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateNumber = (value, min = null, max = null) => {
  const num = parseFloat(value);
  
  if (isNaN(num)) return false;
  if (min !== null && num < min) return false;
  if (max !== null && num > max) return false;
  
  return true;
};

export const validatePositiveNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

export const validateInteger = (value) => {
  const num = parseInt(value, 10);
  return !isNaN(num) && num.toString() === value.toString();
};

export const validateGST = (gst) => {
  if (!gst) return false;
  const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return regex.test(gst);
};

export const validatePAN = (pan) => {
  if (!pan) return false;
  const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return regex.test(pan);
};

export const validateAadhaar = (aadhaar) => {
  if (!aadhaar) return false;
  const cleaned = aadhaar.replace(/\s/g, '');
  return /^\d{12}$/.test(cleaned);
};

export const validateIFSC = (ifsc) => {
  if (!ifsc) return false;
  const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return regex.test(ifsc);
};

export const validateAccountNumber = (accountNumber) => {
  if (!accountNumber) return false;
  const cleaned = accountNumber.replace(/\D/g, '');
  return cleaned.length >= 9 && cleaned.length <= 18;
};

export const validateVehicleNumber = (vehicleNumber) => {
  if (!vehicleNumber) return false;
  const regex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
  return regex.test(vehicleNumber.replace(/\s/g, ''));
};

export const validatePincode = (pincode) => {
  if (!pincode) return false;
  return /^\d{6}$/.test(pincode);
};

export const validateURL = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateFileSize = (file, maxSizeMB = 5) => {
  if (!file) return false;
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
};

export const validateFileType = (file, allowedTypes = []) => {
  if (!file) return false;
  if (allowedTypes.length === 0) return true;
  return allowedTypes.includes(file.type);
};

export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validateFileType(file, allowedTypes) && validateFileSize(file, 5);
};

export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
};

export const validateFutureDate = (date) => {
  if (!date) return false;
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate >= today;
};

export const validatePastDate = (date) => {
  if (!date) return false;
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return inputDate <= today;
};

export const validateTime = (time) => {
  if (!time) return false;
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(time);
};

export const validateOTP = (otp) => {
  if (!otp) return false;
  return /^\d{6}$/.test(otp);
};

export const validateMinLength = (value, minLength) => {
  if (!value) return false;
  return value.length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  if (!value) return false;
  return value.length <= maxLength;
};

export const validateRange = (value, min, max) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
};

export const getValidationErrors = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && !validateRequired(value)) {
      errors[field] = fieldRules.messages?.required || `${field} is required`;
      return;
    }
    
    if (fieldRules.email && !validateEmail(value)) {
      errors[field] = fieldRules.messages?.email || 'Invalid email address';
      return;
    }
    
    if (fieldRules.phone && !validatePhone(value)) {
      errors[field] = fieldRules.messages?.phone || 'Invalid phone number';
      return;
    }
    
    if (fieldRules.minLength && !validateMinLength(value, fieldRules.minLength)) {
      errors[field] = fieldRules.messages?.minLength || `Minimum ${fieldRules.minLength} characters required`;
      return;
    }
    
    if (fieldRules.maxLength && !validateMaxLength(value, fieldRules.maxLength)) {
      errors[field] = fieldRules.messages?.maxLength || `Maximum ${fieldRules.maxLength} characters allowed`;
      return;
    }
  });
  
  return errors;
};

export default {
  validateEmail,
  validatePhone,
  validatePassword,
  validateRequired,
  validateNumber,
  validatePositiveNumber,
  validateInteger,
  validateGST,
  validatePAN,
  validateAadhaar,
  validateIFSC,
  validateAccountNumber,
  validateVehicleNumber,
  validatePincode,
  validateURL,
  validateFileSize,
  validateFileType,
  validateImageFile,
  validateDateRange,
  validateFutureDate,
  validatePastDate,
  validateTime,
  validateOTP,
  validateMinLength,
  validateMaxLength,
  validateRange,
  getValidationErrors
};