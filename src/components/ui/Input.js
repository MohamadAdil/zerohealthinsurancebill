// src/components/ui/Input.js

/**
 * Reusable Input component with Tailwind CSS styling.
 * Provides a consistent look and feel for input fields.
 */
function Input({ type = 'text', placeholder, value, onChange, name, className = '', required = false, label }) {
    // Base styles for the input field
    const baseStyles = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200";
  
    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={name} className="block text-gray-700 text-sm font-medium mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${baseStyles} ${className}`} // Combine base and custom classes
          required={required}
        />
      </div>
    );
  }
  
  export default Input;
  