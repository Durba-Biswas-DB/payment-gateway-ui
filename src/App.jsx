import { useState } from "react";
import {
  signupCustomer,
  loginCustomer,
  createPayment,
  completePayment,
  getInvoice,
} from "./api";
import "./App.css";

function App() {
  const [authMode, setAuthMode] = useState("signup"); // signup | login
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [customer, setCustomer] = useState(null);

  const [amount, setAmount] = useState("");
  const [payment, setPayment] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [completionMsg, setCompletionMsg] = useState("");

  const [view, setView] = useState("auth"); // auth | payment | invoice
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetAll = () => {
    setAuthMode("signup");
    setName("");
    setEmail("");
    setPhone("");
    setCustomer(null);
    setAmount("");
    setPayment(null);
    setInvoice(null);
    setCompletionMsg("");
    setError("");
    setView("auth");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const data = await signupCustomer({ name, email, phone });
      setCustomer(data);
      setView("payment");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const data = await loginCustomer({ email });
      setCustomer(data);
      setView("payment");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    if (!customer?.customerId) return;
    setError("");
    setCompletionMsg("");
    setInvoice(null);
    try {
      setLoading(true);
      const data = await createPayment({
        customerId: customer.customerId,
        amount: Number(amount),
      });
      setPayment(data);
    } catch (err) {
      setError(err.message || "Could not create payment");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!payment?.transactionNumber) return;
    setError("");
    try {
      setLoading(true);
      const data = await completePayment(payment.transactionNumber);
      setCompletionMsg(data.message || "Payment completed.");
    } catch (err) {
      setError(err.message || "Could not complete payment");
    } finally {
      setLoading(false);
    }
  };

  const handleInvoice = async () => {
    if (!payment?.transactionNumber) return;
    setError("");
    try {
      setLoading(true);
      const data = await getInvoice(payment.transactionNumber);
      setInvoice(data);
      setView("invoice");
    } catch (err) {
      setError(err.message || "Could not fetch invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>PayMeow Gateway</h1>
        <p className="subtitle">Customer flow demo (signup/login + payment)</p>

        {error && <p className="error">{error}</p>}

        {view === "auth" && (
          <>
            <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
              <button
                type="button"
                onClick={() => setAuthMode("signup")}
                disabled={loading}
                style={{ opacity: authMode === "signup" ? 1 : 0.75 }}
              >
                Signup
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                disabled={loading}
                style={{ opacity: authMode === "login" ? 1 : 0.75 }}
              >
                Login
              </button>
            </div>

            {authMode === "signup" ? (
              <form onSubmit={handleSignup}>
                <label>Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Durba"
                  required
                />

                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="durba@example.com"
                  required
                />

                <label>Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  required
                />

                <button type="submit" disabled={loading}>
                  {loading ? "Signing up..." : "Signup"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin}>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="durba@example.com"
                  required
                />

                <button type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            )}
          </>
        )}

        {view === "payment" && customer && (
          <>
            <div className="result">
              <p><strong>Name:</strong> {customer.name}</p>
              <p><strong>Email:</strong> {customer.email}</p>
              <p><strong>Customer ID:</strong> {customer.customerId}</p>
            </div>

            <form onSubmit={handleCreatePayment}>
              <label>Amount</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="499.99"
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Payment"}
              </button>
            </form>

            {payment && (
              <div className="payment-layout">
                <div className="payment-left">
                  <p><strong>Transaction:</strong> {payment.transactionNumber}</p>
                  <p><strong>Status:</strong> {payment.status}</p>
                  <p><strong>Amount:</strong> {payment.amount}</p>
                  {completionMsg && <p className="ok-msg">{completionMsg}</p>}

                  <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
                    <button type="button" onClick={handleComplete} disabled={loading}>
                      Complete Payment
                    </button>
                    <button type="button" onClick={handleInvoice} disabled={loading}>
                      Get Invoice
                    </button>
                  </div>
                </div>

                <div className="payment-right">
                  <img
                    alt="Payment QR"
                    src={`data:image/png;base64,${payment.qrCodeBase64}`}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {view === "invoice" && invoice && (
          <div className="result">
            <h3>Invoice Details</h3>
            <p><strong>Invoice Ref:</strong> {invoice.invoiceReference}</p>
            <p><strong>Transaction:</strong> {invoice.transactionNumber}</p>
            <p><strong>Customer:</strong> {invoice.customerId}</p>
            <p><strong>Amount:</strong> {invoice.amount}</p>
            <p><strong>Status:</strong> {invoice.status}</p>
            <p><strong>Date:</strong> {invoice.date}</p>

            <button type="button" onClick={resetAll} style={{ marginTop: "10px" }}>
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
