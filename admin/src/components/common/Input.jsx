/**
 * Input Component
 * Reusable input with validation and different sizes
 * Location: admin/src/components/common/Input.jsx & partner/src/components/common/Input.jsx
 */

import { forwardRef } from 'react';

const Input = forwardRef(({
  type = 'text',
  placeholder = '',
  value = '',
  onChange = () => {},
  onBlur = () => {},
  disabled = false,
  required = false,
  error = null,
  helperText = '',
  label = '',
  icon = null,
  size = 'md',
  className = '',
  maxLength = null,
  ...props
}, ref) => {
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg'
  };

  const inputStyles = `
    w-full border-2 rounded-lg focus:outline-none transition-all
    ${error ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-gray-300 focus:border-orange-500'}
    ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
    ${sizeStyles[size] || sizeStyles.md}
    ${icon ? 'pl-10' : ''}
    ${className}
  `;

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
            {icon}
          </span>
        )}

        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          className={inputStyles}
          {...props}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span>❌</span> {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-600">ℹ️ {helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

/**
 * Textarea Component
 */
export const Textarea = forwardRef(({
  placeholder = '',
  value = '',
  onChange = () => {},
  disabled = false,
  required = false,
  error = null,
  helperText = '',
  label = '',
  rows = 4,
  maxLength = null,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        rows={rows}
        className={`
          w-full px-4 py-2.5 text-base border-2 rounded-lg
          focus:outline-none transition-all resize-none
          ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-orange-500'}
          ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span>❌</span> {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-600">ℹ️ {helperText}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

/**
 * Select Component
 */
export const Select = forwardRef(({
  options = [],
  value = '',
  onChange = () => {},
  disabled = false,
  required = false,
  error = null,
  helperText = '',
  label = '',
  placeholder = 'Select...',
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
        ref={ref}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-2.5 text-base border-2 rounded-lg
          focus:outline-none transition-all
          ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-orange-500'}
          ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
          ${className}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span>❌</span> {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-600">ℹ️ {helperText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

/**
 * Checkbox Component
 */
export const Checkbox = forwardRef(({
  checked = false,
  onChange = () => {},
  disabled = false,
  label = '',
  error = null,
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="w-5 h-5 rounded border-2 border-gray-300 focus:outline-none"
          {...props}
        />
        {label && <span className="text-sm text-gray-700">{label}</span>}
      </label>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span>❌</span> {error}
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';