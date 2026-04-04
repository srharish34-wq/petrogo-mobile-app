# 🚗 PetroGo Backend API

Emergency Fuel Delivery Platform - Backend Server

## 📋 Description

PetroGo is an emergency fuel delivery platform for India that connects customers who run out of fuel with nearby petrol bunks through verified delivery partners.

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

**Required Variables:**
- `MONGODB_URI` - Your MongoDB connection string (already configured)
- `JWT_SECRET` - Secret key for JWT (already configured)
- `PORT` - Server port (default: 5000)

### 3. Start Server

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

## 🌐 API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Health Check
```
GET /health
```

### Authentication
```
POST /api/v1/auth/send-otp          - Send OTP to phone
POST /api/v1/auth/verify-otp        - Verify OTP and login
GET  /api/v1/auth/profile/:phone    - Get user profile
PATCH /api/v1/auth/profile/:phone   - Update profile
POST /api/v1/auth/logout/:phone     - Logout
```

### Orders
```
POST /api/v1/orders/create              - Create new order
GET  /api/v1/orders/:orderId            - Get order by ID
GET  /api/v1/orders/customer/:phone     - Get customer orders
PATCH /api/v1/orders/:orderId/status    - Update order status
POST /api/v1/orders/:orderId/verify-otp - Verify delivery OTP
POST /api/v1/orders/:orderId/cancel     - Cancel order
```

### Payments
```
GET  /api/v1/payments/order/:orderId    - Get payment by order
PATCH /api/v1/payments/:paymentId       - Update payment
GET  /api/v1/payments/customer/:phone   - Get payment history
```

### Petrol Bunks
```
POST /api/v1/bunks/create               - Create new bunk
GET  /api/v1/bunks                      - Get all bunks
GET  /api/v1/bunks/:bunkId              - Get bunk by ID
POST /api/v1/bunks/nearby               - Find nearby bunks
PATCH /api/v1/bunks/:bunkId             - Update bunk
PATCH /api/v1/bunks/:bunkId/fuel-prices - Update fuel prices
PATCH /api/v1/bunks/:bunkId/fuel-stock  - Update fuel stock
GET  /api/v1/bunks/:bunkId/orders       - Get bunk orders
GET  /api/v1/bunks/:bunkId/stats        - Get bunk statistics
```

### Delivery Partners
```
POST /api/v1/partners/register                  - Register partner
GET  /api/v1/partners/phone/:phone              - Get partner by phone
PATCH /api/v1/partners/:partnerId/availability  - Update availability
PATCH /api/v1/partners/:partnerId/location      - Update location
GET  /api/v1/partners/:partnerId/orders         - Get partner orders
POST /api/v1/partners/:partnerId/assign-order   - Assign order
GET  /api/v1/partners/:partnerId/earnings       - Get earnings
POST /api/v1/partners/nearby                    - Find nearby partners
```

### Admin
```
GET  /api/v1/admin/dashboard                - Dashboard stats
GET  /api/v1/admin/users                    - Get all users
GET  /api/v1/admin/orders                   - Get all orders
GET  /api/v1/admin/partners                 - Get all partners
PATCH /api/v1/admin/partners/:id/kyc        - Update partner KYC
GET  /api/v1/admin/settings                 - Get settings
PATCH /api/v1/admin/settings                - Update settings
GET  /api/v1/admin/analytics                - Get analytics
```

## 🗄️ Database Models

### User
- Customers, Delivery Partners, Admins
- Phone-based authentication
- Location tracking
- Role-based access

### PetrolBunk
- Fuel station details
- Location and service radius
- Fuel availability and pricing
- Operating hours

### Order
- Order details and status
- Fuel type and quantity
- Delivery location
- Charges breakdown
- OTP verification

### Payment
- Payment transactions
- Multiple payment methods
- Refund support

### DeliveryPartner
- Partner profile
- Vehicle details
- KYC documents
- Earnings tracking

### Settings
- App-wide configurations
- Fuel prices
- Commission rates
- Delivery charges

## 🔌 Real-time Features (Socket.io)

### Events

**Client → Server:**
- `join_order` - Join order tracking room
- `leave_order` - Leave order room
- `partner_location_update` - Update partner location
- `partner_online` - Partner comes online

**Server → Client:**
- `order_update` - Order status changed
- `partner_location` - Partner location update
- `new_order_available` - New order for partners
- `order_assigned` - Order assigned to partner

## 📁 Project Structure
```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # MongoDB models
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
├── logs/                # Log files (auto-generated)
├── .env                 # Environment variables
├── package.json         # Dependencies
└── README.md            # This file
```

## 🔒 Security Features

- Phone-based OTP authentication
- Role-based access control
- Input validation
- Error handling
- Request logging
- CORS configuration
- Safe fuel quantity limits

## 🧪 Testing

**Test Health Endpoint:**
```bash
curl http://localhost:5000/health
```

**Test API Root:**
```bash
curl http://localhost:5000/api/v1
```

**Test Send OTP:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210"}'
```

## 📊 Logging

Logs are stored in the `logs/` directory:
- `error.log` - Error logs
- `combined.log` - All logs

## 🚀 Deployment

### Prerequisites
- Node.js 18+
- MongoDB database
- Environment variables configured

### Deploy to Railway/Render/Heroku

1. Push code to GitHub
2. Connect repository to platform
3. Set environment variables
4. Deploy!

## 🛠️ Development

**Watch Mode:**
```bash
npm run dev
```

**Check Logs:**
```bash
tail -f logs/combined.log
```

## ⚠️ Important Notes

- ✅ Maximum fuel limit: 5 liters (safety compliance)
- ✅ Service radius: 5 km from petrol bunk
- ✅ PESO-approved containers only
- ✅ Emergency fuel assistance only
- ✅ OTP verification required for delivery

## 📞 Support

For issues or questions:
- Check logs in `logs/` directory
- Review API documentation
- Check MongoDB connection

## 📄 License

MIT License

---

**Built with ❤️ for safer roads in India**