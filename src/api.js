const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function parseResponse(response) {
  if (!response.ok) {
    let message = "Request failed";
    try {
      const err = await response.json();
      message = err.message || message;
    } catch (_) {
      // ignore parse errors
    }
    throw new Error(message);
  }
  return response.json();
}

export async function createPayment(payload) {
  const response = await fetch(`${API_BASE_URL}/api/v1/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
}

export async function completePayment(transactionNumber) {
  const response = await fetch(`${API_BASE_URL}/api/v1/payments/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transactionNumber }),
  });
  return parseResponse(response);
}

export async function getInvoice(transactionNumber) {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/payments/invoice/${transactionNumber}`
  );
  return parseResponse(response);
}

export async function signupCustomer(payload) {
  const response = await fetch(`${API_BASE_URL}/api/v1/customers/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
}

export async function loginCustomer(payload) {
  const response = await fetch(`${API_BASE_URL}/api/v1/customers/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
}
