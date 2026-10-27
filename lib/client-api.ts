export const getNotificationsNew = async () => {
  const res = await fetch('/api/notifications/', { method: 'GET' });
  if (!res.ok) return { message: [] };
  const data = await res.json();
  if (data && typeof data === 'object' && !Array.isArray(data.message)) {
    console.warn(
      '[notifications] unexpected response shape:',
      'message type=' + typeof data.message,
      'keys=' + Object.keys(data).join(','),
    );
  }
  return data;
};

export const checkEmail = async (email: string) => {
  const res = await fetch('/api/user/email-available', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
};
