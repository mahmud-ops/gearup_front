# Provider Orders Page Implementation Plan

## Context
Build a provider orders page at `app/(dashboard)/dashboard/provider/orders/page.tsx` that displays incoming rental orders with status action buttons. The page already exists as a stub. `getProviderOrders` service already exists.

## Tasks

### 1. Update types/rental.types.ts
Add `customer: Provider` field to `RentalOrder` interface because the provider orders endpoint returns customer data, while the customer orders endpoint returns provider data.

### 2. Add `updateOrderStatus` in services/rentals.ts
Create a new service function:
- Method: PATCH
- URL: `https://gearup-backend-api.onrender.com/api/rental_orders/:orderID`
- Headers: Content-Type + Authorization token
- Body: `{ "status": "<STATUS>" }`
- Handle 401 and generic HTTP errors following existing patterns

### 3. Create components/shared/ProviderOrdersClient.tsx
A `"use client"` component that:
- Accepts `initialOrders: RentalOrder[]` prop
- Manages local `orders` state
- Manages `loadingOrderIds` state (Set) to prevent double-clicks
- Manages `toast` state for notifications (same pattern as GearTableClient)
- Defines status transition map:
  - PENDING → confirm → CONFIRMED
  - CONFIRMED → mark picked up → PICKED_UP
  - PICKED_UP → mark returned → RETURNED
  - RETURNED / CANCELLED → no actions (terminal)
- `handleStatusUpdate(orderId, newStatus)`:
  - Reads token from js-cookie
  - Adds orderId to loading set
  - Calls `updateOrderStatus`
  - On success: updates local state optimistically
  - On error: shows error toast, reverts
  - Removes from loading set in finally
- `getOrderStatusVariant(status)` helper for Badge variants
- Desktop table (`hidden md:block`):
  - Columns: Order ID (last 6 chars), Customer (name + email), Rental Dates, Items, Total, Status, Actions
- Mobile cards (`md:hidden`):
  - One card per order with stacked info and action buttons
- Empty state: "No orders received yet."
- Error state: card with destructive border showing error message

### 4. Update page.tsx
Convert to Server Component:
- Fetch token from cookies()
- Redirect to /login if no token
- Call `getProviderOrders(token)` in try/catch
- On 401: redirect to /login
- On other error: pass error to client
- Pass `initialOrders` and `error` to ProviderOrdersClient

## Validation
- Verify `getProviderOrders` works with existing backend endpoint
- Verify PATCH endpoint accepts `{ "status": "RETURNED" }` body
- Verify optimistic update renders without full reload
- Verify loading states prevent duplicate requests
- Verify redirect on unauthorized

## Risk / Notes
- Backend may use different status strings (e.g., "PENDING", "CONFIRMED", "PICKED_UP", "RETURNED", "CANCELLED"). Adjust transition map if actual values differ.
- Customer page already uses `order.provider` for customer view; provider page uses `order.customer`. Ensure type supports both.
