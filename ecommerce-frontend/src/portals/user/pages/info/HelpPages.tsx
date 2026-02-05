import React from 'react';
import { InfoLayout } from './InfoLayout';
import { CreditCard, Truck, RefreshCw, HelpCircle } from 'lucide-react';

export const Payments: React.FC = () => {
  return (
    <InfoLayout title="Payments">
      <div className="flex items-start gap-4 mb-8">
        <CreditCard className="w-12 h-12 text-primary-500 flex-shrink-0" />
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Payment Options</h3>
          <p>
            We support a wide range of payment methods to ensure a seamless shopping experience. All transactions are processed through secure gateways.
          </p>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-4">Accepted Payment Methods:</h3>
      <ul className="list-disc pl-6 space-y-2 mb-8">
        <li>Credit and Debit Cards (Visa, Mastercard, Rupay, Amex)</li>
        <li>Net Banking (All major banks)</li>
        <li>UPI (Google Pay, PhonePe, Paytm, BHIM)</li>
        <li>Wallets</li>
        <li>Cash on Delivery (available on select pincodes)</li>
      </ul>
    </InfoLayout>
  );
};

export const Shipping: React.FC = () => {
  return (
    <InfoLayout title="Shipping">
      <div className="flex items-start gap-4 mb-8">
        <Truck className="w-12 h-12 text-primary-500 flex-shrink-0" />
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Delivery Information</h3>
          <p>
            We strive to deliver your products as quickly and safely as possible.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-gray-900">Delivery Charges</h4>
          <p>Delivery charges vary based on the seller and product. Orders above $500 usually qualify for free shipping.</p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900">Estimated Delivery Time</h4>
          <p>Standard delivery takes 3-5 business days. Express delivery is available for select locations.</p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900">Tracking</h4>
          <p>Once your order is shipped, you will receive a tracking link via email and SMS.</p>
        </div>
      </div>
    </InfoLayout>
  );
};

export const CancellationReturns: React.FC = () => {
  return (
    <InfoLayout title="Cancellation & Returns">
      <div className="flex items-start gap-4 mb-8">
        <RefreshCw className="w-12 h-12 text-primary-500 flex-shrink-0" />
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Returns Policy</h3>
          <p>
            Not satisfied with your purchase? No problem. We have a hassle-free return policy.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-gray-900">Return Window</h4>
          <p>You can return most items within 30 days of delivery for a full refund or exchange.</p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900">Cancellation</h4>
          <p>You can cancel your order any time before it is shipped. Once shipped, you can refuse delivery or initiate a return.</p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900">Refunds</h4>
          <p>Refunds are processed within 5-7 business days after the returned item reaches our warehouse and passes quality check.</p>
        </div>
      </div>
    </InfoLayout>
  );
};

export const FAQ: React.FC = () => {
  return (
    <InfoLayout title="Frequently Asked Questions">
      <div className="flex items-start gap-4 mb-8">
        <HelpCircle className="w-12 h-12 text-primary-500 flex-shrink-0" />
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">How can we help you?</h3>
          <p>Find answers to common questions below.</p>
        </div>
      </div>

      <div className="space-y-6">
        <details className="group bg-white p-4 rounded-lg border border-gray-200 cursor-pointer">
          <summary className="font-bold text-gray-900 list-none flex justify-between items-center">
            <span>How do I track my order?</span>
            <span className="text-primary-500">+</span>
          </summary>
          <p className="mt-2 text-gray-600">Go to 'My Orders' section and click on the specific order to see tracking details.</p>
        </details>
        
        <details className="group bg-white p-4 rounded-lg border border-gray-200 cursor-pointer">
          <summary className="font-bold text-gray-900 list-none flex justify-between items-center">
            <span>Can I change my delivery address?</span>
            <span className="text-primary-500">+</span>
          </summary>
          <p className="mt-2 text-gray-600">You can change the address before the order is shipped. Contact customer support for assistance.</p>
        </details>

        <details className="group bg-white p-4 rounded-lg border border-gray-200 cursor-pointer">
          <summary className="font-bold text-gray-900 list-none flex justify-between items-center">
            <span>What if I receive a damaged product?</span>
            <span className="text-primary-500">+</span>
          </summary>
          <p className="mt-2 text-gray-600">Please report it within 24 hours of delivery. We will arrange for a replacement or refund.</p>
        </details>
      </div>
    </InfoLayout>
  );
};
