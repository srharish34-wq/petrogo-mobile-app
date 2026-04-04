/**
 * EditModal Component
 * Modal to edit delivery partner or order details
 * Location: admin/src/components/modals/EditModal.jsx
 */

import { useState, useEffect } from 'react';

export default function EditModal({
  isOpen,
  title = 'Edit Item',
  item = null,
  fields = [],
  onClose = () => {},
  onSave = () => {},
  loading = false
}) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form data when item changes
  useEffect(() => {
    if (item) {
      const initialData = {};
      fields.forEach(field => {
        // Handle nested properties (e.g., "performance.rating")
        const keys = field.key.split('.');
        let value = item;
        
        for (let key of keys) {
          value = value?.[key];
        }
        
        initialData[field.key] = value || '';
      });
      setFormData(initialData);
      setErrors({});
    }
  }, [item, fields, isOpen]);

  if (!isOpen || !item) return null;

  // Handle input change
  const handleChange = (fieldKey, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldKey]: value
    }));
    // Clear error for this field
    if (errors[fieldKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    fields.forEach(field => {
      if (field.required && !formData[field.key]) {
        newErrors[field.key] = `${field.label} is required`;
      }
      
      if (field.type === 'email' && formData[field.key]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.key])) {
          newErrors[field.key] = 'Invalid email address';
        }
      }
      
      if (field.type === 'number' && formData[field.key]) {
        if (isNaN(formData[field.key])) {
          newErrors[field.key] = 'Must be a number';
        }
        if (field.min !== undefined && Number(formData[field.key]) < field.min) {
          newErrors[field.key] = `Minimum value is ${field.min}`;
        }
        if (field.max !== undefined && Number(formData[field.key]) > field.max) {
          newErrors[field.key] = `Maximum value is ${field.max}`;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  // Get field config
  const getFieldConfig = (fieldKey) => {
    return fields.find(f => f.key === fieldKey);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">Edit the details below</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Form Fields */}
          <div className="space-y-4">
            {fields.map((field) => {
              const fieldError = errors[field.key];
              const value = formData[field.key];

              return (
                <div key={field.key} className="space-y-2">
                  {/* Label */}
                  <label className="block text-sm font-semibold text-gray-900">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {/* Input Field */}
                  {field.type === 'select' ? (
                    <select
                      value={value || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                        fieldError
                          ? 'border-red-500 focus:border-red-600 bg-red-50'
                          : 'border-gray-300 focus:border-orange-500'
                      }`}
                      disabled={isSaving}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={value || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={field.rows || 4}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition resize-none ${
                        fieldError
                          ? 'border-red-500 focus:border-red-600 bg-red-50'
                          : 'border-gray-300 focus:border-orange-500'
                      }`}
                      disabled={isSaving}
                    />
                  ) : field.type === 'checkbox' ? (
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value || false}
                        onChange={(e) => handleChange(field.key, e.target.checked)}
                        className="w-5 h-5 rounded"
                        disabled={isSaving}
                      />
                      <span className="text-sm text-gray-700">{field.checkboxLabel}</span>
                    </label>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={value || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                        fieldError
                          ? 'border-red-500 focus:border-red-600 bg-red-50'
                          : 'border-gray-300 focus:border-orange-500'
                      }`}
                      disabled={isSaving || field.disabled}
                    />
                  )}

                  {/* Error Message */}
                  {fieldError && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <span>❌</span> {fieldError}
                    </p>
                  )}

                  {/* Helper Text */}
                  {field.helperText && !fieldError && (
                    <p className="text-xs text-gray-600">{field.helperText}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Note:</strong> Changes will be saved to the database. Make sure all required fields are filled.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || Object.keys(errors).length > 0}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                💾 Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}