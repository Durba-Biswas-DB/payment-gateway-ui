# Payment Gateway UI

Customer-facing frontend for the Payment Gateway project, built with React + Vite.

## Live Links
- Frontend App: https://payment-gateway-ui-five.vercel.app
- Backend API: https://payment-gateway-service-uedm.onrender.com
- Swagger UI: https://payment-gateway-service-uedm.onrender.com/swagger-ui/index.html
- Backend Repository: https://github.com/Durba-Biswas-DB/payment-gateway-service
- Frontend Repository: https://github.com/Durba-Biswas-DB/payment-gateway-ui

## What This Frontend Does
- Customer signup (new user)
- Customer login (existing user via email)
- Uses backend-generated customer ID automatically
- Create payment with amount
- Display QR code
- Complete payment
- Show invoice details

## Tech Stack
- React
- Vite
- JavaScript (ES6+)
- CSS
- Fetch API

## Screens / Flow
1. Signup or Login
2. Payment creation
3. QR display
4. Complete payment
5. Invoice details

## Local Setup

### Prerequisites
- Node.js 18+
- npm

### Install dependencies
```bash
npm install
```

### Configure API Base URL
Create a `.env` file in project root:
```env
VITE_API_BASE_URL=http://localhost:8080
```

### If using deployed backend:
```env
VITE_API_BASE_URL=https://payment-gateway-service-uedm.onrender.com
```

### Run Locally
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## API Endpoints Used by Frontend
- `POST /api/v1/customers/signup`
- `POST /api/v1/customers/login`
- `POST /api/v1/payments`
- `POST /api/v1/payments/complete`
- `GET /api/v1/payments/invoice/{transactionNumber}`

## Verification Checklist

### Open frontend app and complete full flow:
- signup/login
- create payment
- complete payment
- invoice display

### Confirm backend health:
- `https://payment-gateway-service-uedm.onrender.com/health`

### Confirm backend docs:
- `https://payment-gateway-service-uedm.onrender.com/swagger-ui/index.html`


## Notes
- Backend is hosted on Render (free tier may take time on first request).
- Frontend is hosted on Vercel.
