import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../shared/context/CartContext';
import { useAuth } from '../../../shared/context/AuthContext';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { formatCurrency } from '../../../shared/utils/helpers';
import { OrderService } from '../../../shared/services/order.service';
import { Check, CreditCard, Truck, Wallet, ShieldCheck } from 'lucide-react';

type CheckoutStep = 'address' | 'summary' | 'payment';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [address, setAddress] = useState({
    name: user?.name || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    landmark: '',
    alternatePhone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  if (items.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.street && address.city && address.zip) {
      setCurrentStep('summary');
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create mock order
    const newOrder = OrderService.createOrder({
      userId: user?.id || 'guest',
      userName: user?.name || address.name || 'Guest',
      userEmail: user?.email || 'guest@example.com',
      items: items.map(item => ({
        productId: item.id,
        sellerId: item.sellerId, // Assuming item has sellerId
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        imageUrl: item.imageUrl
      })),
      totalAmount: total,
      shippingAddress: `${address.name}, ${address.street}, ${address.landmark ? address.landmark + ', ' : ''}${address.city}, ${address.state} - ${address.zip}. Phone: ${address.phone}${address.alternatePhone ? ', Alt: ' + address.alternatePhone : ''}`,
      paymentMethod: 'COD'
    });

    setPlacedOrderId(newOrder.id);
    clearCart();
    setIsProcessing(false);
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-200 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-500 mb-8">
            Thank you for your order. Your order ID is <span className="font-mono font-medium text-gray-900">#{placedOrderId}</span>.
            <br />
            We will deliver your items to <span className="font-medium text-gray-900">{address.name}</span> soon.
          </p>
          
          <div className="flex justify-center gap-4">
             <Button onClick={() => navigate('/')} variant="outline">
                Continue Shopping
             </Button>
             <Button onClick={() => navigate('/orders')} className="bg-primary-600 hover:bg-primary-700 text-white">
                View Orders
             </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        
        {/* Step 1: Login Check (Implicitly done if user is logged in, else simplified) */}
        <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-200">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gray-200 text-gray-500 px-2 py-1 text-xs font-bold rounded-sm">1</div>
                <div>
                   <h3 className="text-gray-500 font-medium uppercase text-sm">Login</h3>
                   <div className="flex items-center gap-2 mt-1">
                      <Check className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900">{user?.name || 'Guest User'}</span>
                      <span className="text-gray-500 text-sm">{user?.email || '+91 9999999999'}</span>
                   </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>Change</Button>
           </div>
        </div>

        {/* Step 2: Delivery Address */}
        <div className={`bg-white rounded-sm shadow-sm border border-gray-200 ${currentStep === 'address' ? 'p-6' : 'p-4'}`}>
           {currentStep === 'address' ? (
             <div className="bg-primary-50 -mx-6 -mt-6 px-6 py-4 mb-4 border-b border-gray-200">
                <h3 className="text-primary-600 font-medium uppercase text-sm flex items-center gap-3">
                  <span className="bg-primary-600 text-white px-2 py-0.5 text-xs rounded-sm">2</span>
                  Delivery Address
                </h3>
             </div>
           ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="bg-gray-200 text-gray-500 px-2 py-1 text-xs font-bold rounded-sm">2</div>
                   <div>
                      <h3 className="text-gray-500 font-medium uppercase text-sm">Delivery Address</h3>
                      <p className="mt-1 font-medium text-gray-900">{address.name} {address.zip && `- ${address.zip}`}</p>
                      <p className="text-sm text-gray-500 truncate max-w-md">{address.street}, {address.city}...</p>
                   </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentStep('address')}>Change</Button>
              </div>
           )}

           {currentStep === 'address' && (
             <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Name" 
                    value={address.name} 
                    onChange={e => setAddress({...address, name: e.target.value})} 
                    required 
                  />
                  <Input 
                    label="10-digit mobile number" 
                    value={address.phone} 
                    onChange={e => setAddress({...address, phone: e.target.value})} 
                    required 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Pincode" 
                    value={address.zip} 
                    onChange={e => setAddress({...address, zip: e.target.value})} 
                    required 
                  />
                  <Input 
                    label="Locality" 
                    value={address.city} 
                    onChange={e => setAddress({...address, city: e.target.value})} 
                    required 
                  />
                </div>
                <Input 
                    label="Address (Area and Street)" 
                    value={address.street} 
                    onChange={e => setAddress({...address, street: e.target.value})} 
                    required 
                    className="w-full"
                />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="City/District/Town" 
                    value={address.city} 
                    onChange={e => setAddress({...address, city: e.target.value})} 
                    required 
                  />
                  <Input 
                    label="State" 
                    value={address.state} 
                    onChange={e => setAddress({...address, state: e.target.value})} 
                    required 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Landmark (Optional)" 
                    value={address.landmark} 
                    onChange={e => setAddress({...address, landmark: e.target.value})} 
                  />
                  <Input 
                    label="Alternate Phone (Optional)" 
                    value={address.alternatePhone} 
                    onChange={e => setAddress({...address, alternatePhone: e.target.value})} 
                  />
                </div>
                
                <div className="mt-4">
                   <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white rounded-sm px-8 font-medium">
                      DELIVER HERE
                   </Button>
                </div>
             </form>
           )}
        </div>

        {/* Step 3: Order Summary */}
        <div className={`bg-white rounded-sm shadow-sm border border-gray-200 ${currentStep === 'summary' ? 'p-6' : 'p-4'}`}>
            {currentStep === 'summary' ? (
             <div className="bg-primary-50 -mx-6 -mt-6 px-6 py-4 mb-4 border-b border-gray-200">
                <h3 className="text-primary-600 font-medium uppercase text-sm flex items-center gap-3">
                  <span className="bg-primary-600 text-white px-2 py-0.5 text-xs rounded-sm">3</span>
                  Order Summary
                </h3>
             </div>
           ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="bg-gray-200 text-gray-500 px-2 py-1 text-xs font-bold rounded-sm">3</div>
                   <div>
                      <h3 className="text-gray-500 font-medium uppercase text-sm">Order Summary</h3>
                      <p className="mt-1 font-medium text-gray-900">{items.length} Items</p>
                   </div>
                </div>
                {currentStep === 'payment' && (
                   <Button variant="outline" size="sm" onClick={() => setCurrentStep('summary')}>Change</Button>
                )}
              </div>
           )}

           {currentStep === 'summary' && (
             <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4">
                    <div className="w-24 h-24 bg-gray-100 flex-shrink-0 flex items-center justify-center">
                       <img src={item.imageUrl} alt={item.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">Seller: {item.sellerName}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-gray-500 text-sm">Quantity: {item.quantity}</span>
                      </div>
                      <p className="font-bold text-gray-900 mt-2">{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                ))}
                
                <div className="mt-6 flex justify-between items-center bg-white border-t border-gray-100 pt-4">
                   <div className="text-gray-600">
                     Order confirmation email will be sent to <span className="font-bold text-gray-900">{user?.email || 'your email'}</span>
                   </div>
                   <Button 
                      className="bg-orange-500 hover:bg-orange-600 text-white rounded-sm px-8 font-medium uppercase"
                      onClick={() => setCurrentStep('payment')}
                   >
                      Continue
                   </Button>
                </div>
             </div>
           )}
        </div>

        {/* Step 4: Payment Options */}
        <div className={`bg-white rounded-sm shadow-sm border border-gray-200 ${currentStep === 'payment' ? 'p-6' : 'p-4'}`}>
             {currentStep === 'payment' ? (
             <div className="bg-primary-50 -mx-6 -mt-6 px-6 py-4 mb-4 border-b border-gray-200">
                <h3 className="text-primary-600 font-medium uppercase text-sm flex items-center gap-3">
                  <span className="bg-primary-600 text-white px-2 py-0.5 text-xs rounded-sm">4</span>
                  Payment Options
                </h3>
             </div>
           ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="bg-gray-200 text-gray-500 px-2 py-1 text-xs font-bold rounded-sm">4</div>
                   <div>
                      <h3 className="text-gray-500 font-medium uppercase text-sm">Payment Options</h3>
                   </div>
                </div>
              </div>
           )}

           {currentStep === 'payment' && (
             <div className="space-y-4">
                <div className="space-y-3">
                   {/* UPI */}
                   <div className={`border p-4 rounded-sm flex items-start gap-3 opacity-60 bg-gray-50 cursor-not-allowed`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        disabled
                        className="mt-1 cursor-not-allowed"
                      />
                      <label className="flex-1 cursor-not-allowed">
                         <div className="font-medium text-gray-500">UPI</div>
                         <div className="text-sm text-gray-400">Google Pay, PhonePe, Paytm (Unavailable)</div>
                      </label>
                   </div>

                   {/* Credit/Debit Card */}
                   <div className={`border p-4 rounded-sm flex items-start gap-3 opacity-60 bg-gray-50 cursor-not-allowed`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        disabled
                        className="mt-1 cursor-not-allowed"
                      />
                      <label className="flex-1 cursor-not-allowed">
                         <div className="font-medium text-gray-500 flex items-center gap-2">
                            Credit / Debit / ATM Card
                            <CreditCard className="w-4 h-4 text-gray-400" />
                         </div>
                         <div className="text-sm text-gray-400">Add new card for payment (Unavailable)</div>
                      </label>
                   </div>

                   {/* Wallets */}
                   <div className={`border p-4 rounded-sm flex items-start gap-3 opacity-60 bg-gray-50 cursor-not-allowed`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        disabled
                        className="mt-1 cursor-not-allowed"
                      />
                      <label className="flex-1 cursor-not-allowed">
                         <div className="font-medium text-gray-500 flex items-center gap-2">
                            Wallets
                            <Wallet className="w-4 h-4 text-gray-400" />
                         </div>
                         <div className="text-sm text-gray-400">Paytm, PhonePe Wallet (Unavailable)</div>
                      </label>
                   </div>

                   {/* Cash on Delivery */}
                   <div className={`border p-4 rounded-sm flex items-start gap-3 ${paymentMethod === 'COD' ? 'bg-primary-50 border-primary-500' : 'border-gray-200'}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        id="cod" 
                        checked={paymentMethod === 'COD'} 
                        onChange={() => setPaymentMethod('COD')} 
                        className="mt-1"
                      />
                      <label htmlFor="cod" className="flex-1 cursor-pointer">
                         <div className="font-medium text-gray-900 flex items-center gap-2">
                            Cash on Delivery
                            <Truck className="w-4 h-4 text-gray-400" />
                         </div>
                         <div className="text-sm text-gray-500">Pay when you receive the order</div>
                         {paymentMethod === 'COD' && (
                             <div className="mt-2">
                                <Button 
                                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-sm uppercase"
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'Processing...' : 'Place Order'}
                                </Button>
                             </div>
                         )}
                      </label>
                   </div>
                </div>
             </div>
           )}
        </div>

      </div>

      {/* Right Sidebar: Price Details */}
      <div className="lg:col-span-1">
         <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-200 sticky top-24">
            <h3 className="text-gray-500 font-bold uppercase text-sm border-b border-gray-200 pb-4 mb-4">Price Details</h3>
            
            <div className="space-y-4 text-gray-900">
               <div className="flex justify-between">
                  <span>Price ({items.length} items)</span>
                  <span>{formatCurrency(total)}</span>
               </div>
               <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-green-600">FREE</span>
               </div>
               <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-4 border-dashed">
                  <span>Total Payable</span>
                  <span>{formatCurrency(total)}</span>
               </div>
            </div>

            <div className="mt-4 text-green-600 font-medium text-sm flex items-center gap-2">
               <ShieldCheck className="w-5 h-5" />
               Safe and Secure Payments. 100% Authentic products.
            </div>
         </div>
      </div>
    </div>
  );
};
