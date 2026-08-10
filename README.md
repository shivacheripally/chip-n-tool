# TechHub E-commerce Platform
https://chip-n-tool.netlify.app/
A modern e-commerce platform for computer hardware with Firebase authentication and admin features.

## Features

### Authentication
- Google OAuth login
- Role-based access control (Customer/Admin)
- Automatic user creation with default customer role

### Shopping Features
- Browse products without authentication
- Add to cart requires login
- Cart synchronization between localStorage and Firebase
- Secure checkout process

### Admin Features
- Add new products (admin-only route: `/add-products`)
- Product management with Firebase Firestore
- Role-based UI elements

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication with Google provider
3. Enable Firestore Database
4. Update `src/config/firebase.ts` with your Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## Database Structure

### Users Collection (`users`)
```typescript
{
  id: string,
  name: string,
  email: string,
  role: 'customer' | 'admin',
  phone?: string,
  addresses: Address[]
}
```

### Products Collection (`products`)
```typescript
{
  sku: string,
  name: string,
  category_id: string,
  brand: string,
  short_description: string,
  long_description: string,
  price: {
    current: number,
    original: number,
    currency: string
  },
  images: string[],
  specifications: Array<{key: string, value: string}>,
  stock_status: 'in_stock' | 'out_of_stock' | 'low_stock',
  tags: string[],
  average_rating: number,
  review_count: number,
  created_at: Date,
  created_by: string
}
```

### Carts Collection (`carts`)
```typescript
{
  items: CartItem[]
}
```

## Admin Access

To make a user an admin:
1. User must first sign in with Google
2. Manually update their role in Firestore:
   - Go to Firebase Console > Firestore Database
   - Find the user document in the `users` collection
   - Change the `role` field from `customer` to `admin`

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up Firebase configuration in `src/config/firebase.ts`

3. Start the development server:
```bash
npm run dev
```

## Routes

- `/` - Home page
- `/products` - Product listing
- `/products/:id` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/login` - Authentication
- `/add-products` - Add new product (admin only)
- `/account` - User account management

## Technologies Used

- React 18 with TypeScript
- Firebase (Auth, Firestore)
- Tailwind CSS
- Framer Motion
- React Router
- Lucide React Icons
