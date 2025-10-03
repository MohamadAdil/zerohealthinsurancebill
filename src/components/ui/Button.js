// src/components/ui/Button.js
import React from 'react';

/**
 * Reusable Button component with different variants and states.
 * @param {string} variant - The button style variant ('primary', 'secondary', etc.).
 * @param {string} type - The button type ('button', 'submit', 'reset').
 * @param {boolean} disabled - Whether the button is disabled.
 * @param {string} className - Additional Tailwind CSS classes to apply.
 * @param {React.ReactNode} children - The content to display inside the button.
 * @param {function} onClick - The click event handler.
 */
function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  ...props
}) {
  // Define base and variant-specific styles
  const baseStyles = "bg-[#051a6f] text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition";

  const variantStyles = {
    primary: "bg-[#051a6f] text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition",
    secondary: "bg-[#051a6f] text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition",
    danger: "bg-[#051a6f] text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition",
    outline: "bg-[#051a6f] text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed";

  // Combine styles
  const combinedStyles = `${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${disabled ? disabledStyles : ''} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedStyles}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
