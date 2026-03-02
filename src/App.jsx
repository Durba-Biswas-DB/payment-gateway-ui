import { useState } from "react";
import { createPayment, completePayment, getInvoice } from "./api";
import "./App.css";

function App() {
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const [payment, setPayment] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [completionMsg, setCompletionMsg] = useState("");
  const [error, setError] = useState("");

  const [view, setView] = useState("form");

  const resetAll = () => {
    setCustomerId("");
    setAmount("");
    setPayment(null);
    setInvoice(null);
    setCompletionMsg("");
    setError("");
    setView("form");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setCompletionMsg("");
    try {
      setLoading(true);
      const data = await createPayment({
        customerId,
        amount: Number(amount),
      });
      setPayment(data);
      setView("payment");
    } catch (err) {
      setError(err.message || "Could not create payment.");
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
      setError(err.message || "Could not complete payment.");
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
      setError(err.message || "Could not fetch invoice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>PayMeow Gateway</h1>
        <p className="subtitle">Demo company console for payment flow</p>

        {error && <p className="error">{error}</p>}

        {view === "form" && (
          <form onSubmit={handleCreate}>
            <label>Customer ID</label>
            <input
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="CUST-1001"
              required
            />

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
        )}

        {view === "payment" && payment && (
          <div className="payment-layout">
            <div className="payment-left">
              <p><strong>Customer:</strong> {payment.customerId}</p>
              <p><strong>Transaction:</strong> {payment.transactionNumber}</p>
              <p><strong>Amount:</strong> {payment.amount}</p>
              <p><strong>Status:</strong> {payment.status}</p>

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
              New Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
