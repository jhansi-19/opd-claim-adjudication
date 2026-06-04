export const generateClaimId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `CLM_${timestamp}_${random}`;
};

export const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
};

export const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  let age = today.getFullYear() - new Date(birthDate).getFullYear();
  const monthDiff = today.getMonth() - new Date(birthDate).getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < new Date(birthDate).getDate())) {
    age--;
  }
  return age;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ''));
};

export const sanitizeFileName = (fileName) => {
  return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
};

export const getFileExtension = (filePath) => {
  const parts = filePath.split('.');
  return parts[parts.length - 1].toLowerCase();
};

export default {
  generateClaimId,
  formatDate,
  calculateAge,
  validateEmail,
  validatePhoneNumber,
  sanitizeFileName,
  getFileExtension
};
