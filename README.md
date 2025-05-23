<p align="center">
  <img src="https://raw.githubusercontent.com/Javier6170/snapbuy/33221d08cf76478f2137c17081a3f8d0d7a72d23/frontend/src/logo.svg" width="120" alt="SnapBuy Logo" />
</p>

<p align="center">
  <b>SnapBuy</b> · A modern FullStack E-commerce App using <a href="https://reactjs.org/">React</a>, <a href="https://nestjs.com/">NestJS</a>, and <a href="https://wompi.co/">Wompi</a> for payments.
</p>

---

##  Tech Stack

- **Frontend:** React 18, Redux Toolkit, Tailwind CSS, Vite, Yup + React Hook Form
- **Backend:** NestJS, PostgreSQL, TypeORM, Validation Pipes, Custom Exception Filters
- **Payments:** Wompi (Sandbox)
- **Tools:** Docker-ready, ESLint + Prettier, RESTful API, CORS

---

##  Project Structure

```bash
snapbuy/
├── frontend/               # React SPA
│   ├── components/         # Shared UI components
│   ├── features/           # Redux slices and domain logic
│   ├── hooks/              # Custom hooks (e.g., usePayment)
│   ├── routes/             # App routing
│   └── services/           # API and Wompi integrations
├── backend/                # NestJS RESTful API
│   ├── src/
│   │   ├── products/       # Product entity & controller
│   │   ├── customers/      # Customer registration
│   │   ├── deliveries/     # Delivery creation per transaction
│   │   ├── transactions/   # Record of transactions
│   │   └── common/         # Pipes, filters, interceptors
│   ├── .env                # Environment configuration
│   └── config/             # TypeORM and other configs
```

---

##  Getting Started

### Backend

```bash
cd backend
cp  .env  
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
cp .env 
npm install
npm run dev
```

---

##  Payment Flow

1. User selects product → adds to cart.
2. Proceeds to checkout → submits form.
3. Client actions:
   - Create customer (`POST /customers`)
   - Create delivery (`POST /deliveries`)
4. If approved:
   - Record transaction (`POST /transactions`)
   - Update stock (`PATCH /products/:id/stock`)

---

##  Testing

```bash
npm run test          
npm run test:e2e      
npm run test:cov     
```

---

##  Deployment

- Use `.env.production` for production builds.
- Frontend: Host with Vercel, Netlify, etc.
- Backend: Deploy to Railway, Render, or similar.

---

##  Useful Commands

```bash

npm start               # Dev mode
npm run build           # Compile


npm start               # Start dev server
npm run build           # Build production bundle
```

---
