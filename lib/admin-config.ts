export const getAdminEmails = () => {
  const adminEmails = process.env.ADMIN_EMAILS || '';
  return adminEmails.split(',').map(email => email.trim());
};

export const isAdminEmail = (email: string) => {
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email);
};