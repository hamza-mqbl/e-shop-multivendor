# Qadam — Shoes for every step

Qadam (Urdu for *"step"*) is a real, branded online footwear store built on a fullstack **MERN** (MongoDB, Express, React, Node.js) multivendor base. It sells the full range — chappals, sandals, formal, sneakers, Peshawari & khussa, heels, flats, kids and sports — for ladies, gents and kids, with a warm leather-craft visual identity.

> Started life as a MERN practice template and was rebranded into a product: a coherent design system, real shoe catalogue, size-selection flow, offers, and polished customer + seller dashboards.

## Features

- **Storefront** — branded hero, shoe categories, Best Deals auto-carousel, offers/flash sales with live countdown
- **Shoe attributes end-to-end** — every product has brand, gender, material, **sizes** and colours; a required size picker on the product page that carries the selected size into the cart
- **Product detail page** — square image gallery with **hover-zoom / fullscreen** preview, specifications table, ratings summary & reviews
- **Cart, wishlist, checkout** — Stripe / PayPal / Cash-on-Delivery, prices in **Rs**
- **Customer dashboard** — profile, orders, refunds, track order, change password, saved addresses, real-time inbox
- **Seller dashboard** — products, orders, events/offers, coupons, withdrawals, messages
- **Real-time chat & notifications** (Socket.io), Cloudinary image uploads, email (Nodemailer)
- Responsive React + Tailwind frontend; visible keyboard focus and reduced-motion respected

## Design system (Qadam)

Defined in [`frontend/tailwind.config.js`](frontend/tailwind.config.js), [`frontend/src/App.css`](frontend/src/App.css) and [`frontend/src/styles/styles.js`](frontend/src/styles/styles.js).

- **Colours:** espresso `#241A14`, coffee `#3A2A20`, marigold `#F2A93B`, brick `#B5462B`, bone `#FBF8F3`, sand `#E7DDCE`, clay `#8C7A6B`
- **Type:** Clash Display (`font-display`), Inter (`font-sans`), JetBrains Mono (`font-mono`, used for prices/sizes)
- **Signature:** the *stitch-seam* (dashed dividers) and a sole-tread texture on dark panels

## Tech stack

- **Frontend:** React, Redux Toolkit, Tailwind CSS, Axios, Socket.io-client, react-inner-image-zoom
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Cloudinary, Nodemailer, Stripe
- **Realtime:** standalone Socket.io server
- **Deployment:** Vercel / Render / your own server

## Getting started

### 1. Clone

```bash
git clone https://github.com/hamza-mqbl/e-shop-multivendor.git
cd e-shop-multivendor
```

### 2. Backend (port 8000)

```bash
cd backend
npm install
npm run dev
```

Create `backend/config/.env` (see [Environment variables](#environment-variables)).

### 3. Frontend (port 3000)

```bash
cd frontend
npm install --legacy-peer-deps   # legacy flag required (Material UI v4 ↔ React 18)
npm start
```

### 4. Socket server (port 4000, for real-time chat)

```bash
cd socket
npm install
npm start
```

## Database & seed data

Qadam uses its **own dedicated `qadam` database** (keep this separate from any shared `test` database). Make sure your `MONGO_URL` ends with `/qadam`, e.g.:

```
mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/qadam?retryWrites=true&w=majority
```

Seed the store with a customer, the **Qadam Footwear** shop, 10 products and one running offer:

```bash
cd backend
node seed/qadamSeed.js
```

The script refuses to run against any database not named `qadam`, then wipes and reseeds it. Demo logins it creates:

| Role     | Where                | Email               | Password   |
| -------- | -------------------- | ------------------- | ---------- |
| Customer | storefront `/login`  | `customer@qadam.pk` | `qadam123` |
| Seller   | dashboard `/shop-login` | `seller@qadam.pk`  | `qadam123` |

## Environment variables

`backend/config/.env`:

```env
PORT=8000
MONGO_URL="your_mongodb_connection_string/qadam"
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRES=5d
ACTIVATION_SECRET="your_activation_secret"
SMPT_HOST="smtp.gmail.com"
SMPT_PORT=465
SMPT_MAIL="your_email@gmail.com"
SMPT_PASSWORD="your_smtp_password"
CLOUDINARY_NAME="your_cloudinary_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
STRIPE_SECRET_KEY="your_stripe_secret_key"
STRIPE_API_KEY="your_stripe_publishable_key"
```

The socket server reads its own `socket/.env` (e.g. `PORT=4000`).

> Never commit real secrets. `backend/config/.env` is git-ignored.

## Scripts

- **Backend:** `npm run dev` (dev) · `npm start` (prod) · `node seed/qadamSeed.js` (seed)
- **Frontend:** `npm start` · `npm run build`
- **Socket:** `npm start`

## Folder structure

```
e-shop-multivendor/
  backend/        Express API, Mongoose models, controllers, seed script
  frontend/       React app (Qadam UI + Redux)
  socket/         Socket.io real-time server
  uploads/        local image uploads
```

## License

ISC License.
