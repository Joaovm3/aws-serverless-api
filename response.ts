export const response = (status: number, body: Record<string, unknown> = {}) => {
  return {
    statusCode: status,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};