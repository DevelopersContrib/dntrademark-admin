export const getNotificationsNew = async () => {
  const res = await fetch('/api/notifications/', { method: 'GET' });
  return res.json();
};

export const checkEmail = async (email: string) => {
  const res = await fetch('/api/user/email-available', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
};
