/**
 * Input Component
 * Reusable input field with label, error, and icon support
 * Location: partner/src/components/common/Input.jsx
 */

export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  error = '',
  icon = null,
  className = '',
  ...props
}) {
  const hasError = error && error.length > 0;

  return (
    <div className={`${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none">
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full
            ${icon ? 'pl-12' : 'pl-4'}
            pr-4
            py-3
            border-2
            rounded-lg
            transition-all
            duration-200
            focus:outline-none
            ${hasError
              ? 'border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200'
              : 'border-gray-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
            placeholder:text-gray-400
          `}
          {...props}
        />
      </div>

      {/* Error Message */}
      {hasError && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <span>❌</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

/**
 * Example Usage:
 * 
 * <Input
 *   label="Phone Number"
 *   type="tel"
 *   name="phone"
 *   value={phone}
 *   onChange={(e) => setPhone(e.target.value)}
 *   placeholder="Enter phone number"
 *   icon="📱"
 *   required
 * />
 * 
 * <Input
 *   label="Email"
 *   type="email"
 *   name="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   error={emailError}
 *   icon="✉️"
 * />
 * 
 * <Input
 *   label="Password"
 *   type="password"
 *   name="password"
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   disabled={isLoading}
 * />
 */