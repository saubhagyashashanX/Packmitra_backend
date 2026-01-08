# Payment Gateway Setup (Razorpay)

## Environment Variables Required

Add these to your `.env` file in the backend directory:

```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## Getting Razorpay Credentials

1. Sign up at https://razorpay.com/
2. Go to Dashboard → Settings → API Keys
3. Generate Test/Live API keys
4. Copy the Key ID and Key Secret
5. Add them to your `.env` file

## Payment Flow

1. Customer fills booking form and selects a partner
2. Booking is created with `paymentStatus: "pending"`
3. Payment order is created via Razorpay
4. Customer completes payment through Razorpay checkout
5. Payment is verified on success
6. Booking status is updated to `"assigned"` and `paymentStatus: "paid"`

## Testing

For testing, use Razorpay test cards:
- Card Number: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name



