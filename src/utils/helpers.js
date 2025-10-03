// src/utils/helpers.js
import { toast } from 'react-toastify';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Default referral IDs that will rotate weekly
const DEFAULT_REFERRAL_IDS = [
  'default1',
  'default2',
  'default3',
  'default4',
  'default5'
];

// Toast helper functions
export const showSuccessToast = (message) => toast.success(message);
export const showErrorToast = (message) => toast.error(message);
export const showWarningToast = (message) => toast.warning(message);
export const showInfoToast = (message) => toast.info(message);

/**
 * Extracts referral ID from URL or returns a default ID that rotates weekly
 * @returns {string} The referral ID
 */
export function getReferralId() {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');
    if (refParam) return refParam;
  }
  return getWeeklyRotatingDefaultId();
}

/**
 * Gets a default ID that changes consistently each week
 * @returns {string} One of the default referral IDs
 */
function getWeeklyRotatingDefaultId() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const weekNumber = Math.floor(diff / oneWeek);
  const index = weekNumber % DEFAULT_REFERRAL_IDS.length;
  return DEFAULT_REFERRAL_IDS[index];
}

/**
 * Formats a given date string or Date object into a readable format.
 * @param {string | Date} dateInput - The date to format.
 * @param {object} options - Options for Date.prototype.toLocaleDateString.
 * @returns {string} The formatted date string.
 */
export function formatDate(dateInput, options = {}) {
  const date = new Date(dateInput);
  const defaultOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, { ...defaultOptions, ...options });
}

/**
 * Basic email validation function.
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The input string.
 * @returns {string} The string with the first letter capitalized.
 */
export function capitalizeFirstLetter(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getImageUrl(imagePath) {
  if (!imagePath) return '';
  return `${BASE_URL}/${imagePath.replace(/^\/+/, '')}`;
}
// export const scrollToSection = (id) => {
//   if (!id) return;
//   const element = document.getElementById(id);
//   if (element) {
//     element.scrollIntoView({ behavior: 'smooth' });
//   }
// };
export const scrollToSection = (id) => {
  if (!id) return;

  const isHomePage = window.location.pathname === "/" || window.location.pathname === "/index.html";

  if (!isHomePage) {
    // Redirect to homepage with hash
    window.location.href = `/${id ? `#${id}` : ""}`;
    return;
  }

  // If already on homepage, scroll smoothly
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};