/**
 * useForm Hook
 * Custom hook for form state management, validation, and submission
 * Location: admin/src/hooks/useForm.js
 */

import { useState, useCallback, useRef } from 'react';

/**
 * Validation rules
 */
export const validationRules = {
  required: (value) => {
    if (!value || value.toString().trim() === '') {
      return 'This field is required';
    }
    return null;
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return 'Invalid email address';
    }
    return null;
  },

  minLength: (min) => (value) => {
    if (value && value.length < min) {
      return `Minimum length is ${min} characters`;
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return `Maximum length is ${max} characters`;
    }
    return null;
  },

  min: (min) => (value) => {
    if (value && parseInt(value) < min) {
      return `Minimum value is ${min}`;
    }
    return null;
  },

  max: (max) => (value) => {
    if (value && parseInt(value) > max) {
      return `Maximum value is ${max}`;
    }
    return null;
  },

  phone: (value) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (value && !phoneRegex.test(value.replace(/\D/g, ''))) {
      return 'Invalid phone number';
    }
    return null;
  },

  url: (value) => {
    try {
      if (value) {
        new URL(value);
      }
    } catch {
      return 'Invalid URL';
    }
    return null;
  },

  match: (fieldName) => (value, formData) => {
    if (value !== formData[fieldName]) {
      return `Fields do not match`;
    }
    return null;
  },

  custom: (validatorFn) => validatorFn
};

export const useForm = (initialValues = {}, onSubmit = null, validationSchema = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const formRef = useRef(null);

  /**
   * Validate field
   */
  const validateField = useCallback((name, value) => {
    const rules = validationSchema[name];

    if (!rules) {
      return null;
    }

    // If rules is a single rule function
    if (typeof rules === 'function') {
      return rules(value, values);
    }

    // If rules is an array of rule functions
    if (Array.isArray(rules)) {
      for (let rule of rules) {
        const error = rule(value, values);
        if (error) {
          return error;
        }
      }
    }

    return null;
  }, [validationSchema, values]);

  /**
   * Validate all fields
   */
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isFormValid = true;

    Object.keys(validationSchema).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName]);

      if (error) {
        newErrors[fieldName] = error;
        isFormValid = false;
      }
    });

    setErrors(newErrors);
    setIsValid(isFormValid);

    return isFormValid;
  }, [validationSchema, values, validateField]);

  /**
   * Handle field change
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    const newValue = type === 'checkbox' ? checked : value;

    setValues((prev) => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  /**
   * Handle field blur
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true
    }));

    // Validate on blur
    const error = validateField(name, values[name]);

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error
      }));
    }
  }, [values, validateField]);

  /**
   * Set field value
   */
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);

  /**
   * Set field error
   */
  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  }, []);

  /**
   * Set field touched
   */
  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched((prev) => ({
      ...prev,
      [name]: isTouched
    }));
  }, []);

  /**
   * Reset form
   */
  const resetForm = useCallback((newValues = null) => {
    setValues(newValues || initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Handle form submit
   */
  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      // Validate form
      const isFormValid = validateForm();

      if (!isFormValid) {
        return;
      }

      setIsSubmitting(true);

      try {
        if (onSubmit) {
          await onSubmit(values);
        }
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm, onSubmit]
  );

  /**
   * Get field props
   */
  const getFieldProps = useCallback(
    (name) => ({
      name,
      value: values[name] || '',
      onChange: handleChange,
      onBlur: handleBlur
    }),
    [values, handleChange, handleBlur]
  );

  /**
   * Get field state
   */
  const getFieldState = useCallback(
    (name) => ({
      value: values[name],
      error: errors[name],
      isTouched: touched[name],
      isDirty: values[name] !== initialValues[name]
    }),
    [values, errors, touched, initialValues]
  );

  /**
   * Check if form is dirty
   */
  const isDirty = useCallback(() => {
    return Object.keys(values).some((key) => values[key] !== initialValues[key]);
  }, [values, initialValues]);

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty: isDirty(),

    // Methods
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
    validateForm,

    // Helpers
    getFieldProps,
    getFieldState,
    formRef
  };
};

/**
 * Hook for form array (dynamic form fields)
 */
export const useFormArray = (initialValues = []) => {
  const [values, setValues] = useState(initialValues);

  const push = useCallback((value) => {
    setValues((prev) => [...prev, value]);
  }, []);

  const remove = useCallback((index) => {
    setValues((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const insert = useCallback((index, value) => {
    setValues((prev) => [
      ...prev.slice(0, index),
      value,
      ...prev.slice(index)
    ]);
  }, []);

  const update = useCallback((index, value) => {
    setValues((prev) => [
      ...prev.slice(0, index),
      value,
      ...prev.slice(index + 1)
    ]);
  }, []);

  const move = useCallback((from, to) => {
    const newValues = [...values];
    const temp = newValues[from];
    newValues[from] = newValues[to];
    newValues[to] = temp;
    setValues(newValues);
  }, [values]);

  const reset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  return {
    values,
    push,
    remove,
    insert,
    update,
    move,
    reset,
    length: values.length
  };
};

export default useForm;