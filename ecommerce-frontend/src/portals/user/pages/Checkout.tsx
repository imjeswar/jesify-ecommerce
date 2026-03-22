import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../shared/context/CartContext';
import { useAuth } from '../../../shared/context/AuthContext';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { formatCurrency } from '../../../shared/utils/helpers';
import { OrderService } from '../../../shared/services/order.service';
import { Check, Truck, ShieldCheck, ChevronLeft } from 'lucide-react';
import { cn } from '../../../shared/utils/cn';

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
      window.scrollTo(0, 0);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newOrder = OrderService.createOrder({
      userId: user?.id || 'guest',
      userName: user?.name || address.name || 'Guest',
      userEmail: user?.email || 'guest@example.com',
      items: items.map(item => ({
        productId: item.id,
        sellerId: item.sellerId,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        imageUrl: item.imageUrl
      })),
      totalAmount: total,
      shippingAddress: `${address.name}, ${address.street}, ${address.landmark ? address.landmark + ', ' : ''}${address.city}, ${address.state} - ${address.zip}. Phone: ${address.phone}${address.alternatePhone ? ', Alt: ' + address.alternatePhone : ''}`,
      paymentMethod: paymentMethod === 'DUMMY' ? 'DUMMY' : 'COD'
    });
    setPlacedOrderId(newOrder.id);
    clearCart();
    setIsProcessing(false);
    setOrderPlaced(true);
    window.scrollTo(0, 0);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 text-center">
        <div className="bg-white p-10 sm:p-16 rounded-sm shadow-sm border border-primary-50 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
          <div className="w-24 h-24 bg-secondary-400 rounded-sm flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
            <Check className="w-12 h-12 text-primary-500" />
          </div>
          <h2 className="text-3xl font-black text-primary-500 uppercase tracking-tighter italic mb-4">Transmission Successful</h2>
          <p className="text-primary-300 font-medium mb-10 max-w-md mx-auto">
             Order Log <span className="text-primary-500 font-black font-mono tracking-widest bg-secondary-400 px-3 py-1 rounded-sm border border-primary-50 ml-1">#{placedOrderId.slice(-12).toUpperCase()}</span> has been verified and added to the dispatch queue.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Button onClick={() => navigate('/')} variant="outline" className="px-10 py-5 rounded-sm uppercase font-black tracking-widest text-[10px] border-primary-100 h-auto">
                Return to Hub
             </Button>
             <Button onClick={() => navigate('/orders')} className="px-10 py-5 rounded-sm uppercase font-black tracking-widest text-[10px] shadow-lg h-auto">
                View Shipment Logs
             </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Checkout Header */}
      <div className="flex items-center gap-4 px-4 sm:px-0">
         <button onClick={() => navigate(-1)} className="p-2 hover:bg-secondary-400 rounded-sm text-primary-200">
            <ChevronLeft className="w-6 h-6" />
         </button>
         <div>
            <h1 className="text-2xl font-black text-primary-500 uppercase tracking-tighter italic">Secure Checkout</h1>
            <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest mt-0.5">Step {currentStep === 'address' ? '1' : currentStep === 'summary' ? '2' : '3'} of 3</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* USER AUTH BLOCK */}
          <div className="bg-white p-5 rounded-sm border border-primary-50 shadow-sm mx-4 sm:mx-0">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                   <div className="h-10 w-10 bg-secondary-400 rounded-sm flex items-center justify-center text-primary-500 font-black text-xs border border-primary-50">01</div>
                   <div>
                      <h3 className="text-[10px] font-black text-primary-200 uppercase tracking-widest">Authentication Verified</h3>
                      <div className="flex items-center gap-3 mt-1">
                         <span className="text-xs font-black text-primary-500 uppercase">{user?.name || 'Guest User'}</span>
                      </div>
                   </div>
                </div>
                <button onClick={() => navigate('/login')} className="text-[9px] font-black text-primary-300 uppercase underline underline-offset-4 hover:text-primary-500">Switch ID</button>
             </div>
          </div>

          {/* ADDRESS BLOCK */}
          <div className={cn("bg-white border rounded-sm shadow-sm transition-all mx-4 sm:mx-0", currentStep === 'address' ? "p-0 border-primary-500 ring-4 ring-primary-500/5 shadow-xl" : "p-5 border-primary-50 opacity-80")}>
             {currentStep === 'address' ? (
                <div>
                   <div className="bg-primary-500 px-6 py-4 flex items-center gap-4">
                      <span className="h-7 w-7 bg-white text-primary-500 rounded-sm flex items-center justify-center font-black text-xs">02</span>
                      <h3 className="text-xs font-black text-secondary-500 uppercase tracking-[0.2em]">Shipping Coordinates</h3>
                   </div>
                   <form onSubmit={handleAddressSubmit} className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <Input label="Recipient Full Identity" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} required className="h-12 font-bold text-xs uppercase" />
                         <Input label="Primary Communication Link" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} required className="h-12 font-bold text-xs uppercase" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <Input label="Regional Pincode" value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} required className="h-12 font-bold text-xs uppercase" />
                         <Input label="Hub Locality" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} required className="h-12 font-bold text-xs uppercase" />
                      </div>
                      <Input label="Detailed Access Address (Street / Area / Floor)" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} required className="h-12 font-bold text-xs uppercase w-full" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <Input label="State Jurisdiction" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} required className="h-12 font-bold text-xs uppercase" />
                         <Input label="Landmark Descriptor" value={address.landmark} onChange={e => setAddress({...address, landmark: e.target.value})} className="h-12 font-bold text-xs uppercase" />
                      </div>
                      <div className="pt-4">
                         <Button type="submit" className="w-full sm:w-auto px-12 py-6 rounded-sm uppercase font-black tracking-widest text-[10px] shadow-lg">Confirm Coordinates</Button>
                      </div>
                   </form>
                </div>
             ) : (
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-5">
                      <div className="h-10 w-10 bg-secondary-400 rounded-sm flex items-center justify-center text-primary-500 font-black text-xs border border-primary-50">02</div>
                      <div>
                         <h3 className="text-[10px] font-black text-primary-200 uppercase tracking-widest">Shipment Target</h3>
                         <p className="text-xs font-black text-primary-500 mt-1 uppercase truncate max-w-[200px] sm:max-w-md">{address.name} • {address.street.slice(0, 30)}...</p>
                      </div>
                   </div>
                   <button onClick={() => setCurrentStep('address')} className="text-[9px] font-black text-primary-300 uppercase underline underline-offset-4 hover:text-primary-500">Edit Path</button>
                </div>
             )}
          </div>

          {/* SUMMARY BLOCK */}
          <div className={cn("bg-white border rounded-sm shadow-sm transition-all mx-4 sm:mx-0", currentStep === 'summary' ? "p-0 border-primary-500 ring-4 ring-primary-500/5 shadow-xl" : "p-5 border-primary-50 opacity-80")}>
             {currentStep === 'summary' ? (
                <div>
                   <div className="bg-primary-500 px-6 py-4 flex items-center gap-4">
                      <span className="h-7 w-7 bg-white text-primary-500 rounded-sm flex items-center justify-center font-black text-xs">03</span>
                      <h3 className="text-xs font-black text-secondary-500 uppercase tracking-[0.2em]">Package Inventory Audit</h3>
                   </div>
                   <div className="p-6 space-y-6">
                      {items.map(item => (
                        <div key={item.id} className="flex gap-6 items-center border-b border-primary-50 pb-6 last:border-0 last:pb-0">
                           <div className="w-20 h-20 bg-white border border-secondary-400 p-2 rounded-sm flex-shrink-0">
                              <img src={item.imageUrl} alt="" className="h-full w-full object-contain" />
                           </div>
                           <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-black text-primary-500 uppercase tracking-tight truncate leading-tight mb-1">{item.name}</h4>
                              <p className="text-[9px] font-black text-primary-200 uppercase tracking-widest mb-3">Merchant: {item.sellerName}</p>
                              <div className="flex items-center justify-between">
                                 <span className="text-[11px] font-black text-primary-500 tabular-nums">{formatCurrency(item.price)} <span className="text-primary-200">x {item.quantity}</span></span>
                              </div>
                           </div>
                        </div>
                      ))}
                      <div className="pt-4 border-t border-primary-50 flex justify-end">
                         <Button onClick={() => { setCurrentStep('payment'); window.scrollTo(0, 0); }} className="w-full sm:w-auto px-12 py-6 rounded-sm uppercase font-black tracking-widest text-[10px] shadow-lg">Finalize Load</Button>
                      </div>
                   </div>
                </div>
             ) : (
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-5">
                      <div className="h-10 w-10 bg-secondary-400 rounded-sm flex items-center justify-center text-primary-500 font-black text-xs border border-primary-50">03</div>
                      <div>
                         <h3 className="text-[10px] font-black text-primary-200 uppercase tracking-widest">Inventory Loadout</h3>
                         <p className="text-xs font-black text-primary-500 mt-1 uppercase tracking-tight">{items.length} Secure Asset Containers</p>
                      </div>
                   </div>
                   {currentStep === 'payment' && (
                     <button onClick={() => setCurrentStep('summary')} className="text-[9px] font-black text-primary-300 uppercase underline underline-offset-4 hover:text-primary-500">Re-Audit</button>
                   )}
                </div>
             )}
          </div>

          {/* PAYMENT BLOCK */}
          <div className={cn("bg-white border rounded-sm shadow-sm transition-all mx-4 sm:mx-0", currentStep === 'payment' ? "p-0 border-primary-500 ring-4 ring-primary-500/5 shadow-xl" : "p-5 border-primary-50 opacity-80")}>
             {currentStep === 'payment' ? (
                <div>
                   <div className="bg-primary-500 px-6 py-4 flex items-center gap-4">
                      <span className="h-7 w-7 bg-white text-primary-500 rounded-sm flex items-center justify-center font-black text-xs">04</span>
                      <h3 className="text-xs font-black text-secondary-500 uppercase tracking-[0.2em]">Settlement Protocols</h3>
                   </div>
                   <div className="p-6 space-y-4">
                      {/* DUMMY MODE */}
                      <div className={cn("border-2 p-5 rounded-sm flex gap-4 transition-all cursor-pointer relative group", paymentMethod === 'DUMMY' ? "border-primary-500 bg-secondary-400 shadow-inner" : "border-primary-50 hover:bg-secondary-50")}>
                         <input type="radio" id="dummy" name="pay" checked={paymentMethod === 'DUMMY'} onChange={() => setPaymentMethod('DUMMY')} className="w-5 h-5 mt-1 border-primary-100 text-primary-500 focus:ring-0" />
                         <label htmlFor="dummy" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                               <p className="text-xs font-black text-primary-500 uppercase tracking-widest">Digital Auth Protocol</p>
                               <ShieldCheck className="w-4 h-4 text-green-600" />
                            </div>
                            <p className="text-[10px] font-bold text-primary-300 uppercase leading-relaxed">Instant confirmation via encrypted test tunnel.</p>
                            {paymentMethod === 'DUMMY' && (
                               <div className="mt-6 animate-in fade-in duration-500">
                                  <Button onClick={handlePlaceOrder} disabled={isProcessing} className="w-full py-6 rounded-sm font-black uppercase tracking-widest text-xs h-auto shadow-lg">
                                     {isProcessing ? 'Executing Payload...' : 'Initiate Secure Payment'}
                                  </Button>
                               </div>
                            )}
                         </label>
                      </div>

                      {/* COD MODE */}
                      <div className={cn("border-2 p-5 rounded-sm flex gap-4 transition-all cursor-pointer relative group", paymentMethod === 'COD' ? "border-primary-500 bg-secondary-400 shadow-inner" : "border-primary-50 hover:bg-secondary-50")}>
                         <input type="radio" id="cod" name="pay" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="w-5 h-5 mt-1 border-primary-100 text-primary-500 focus:ring-0" />
                         <label htmlFor="cod" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                               <p className="text-xs font-black text-primary-500 uppercase tracking-widest">Physical Settlement (COD)</p>
                               <Truck className="w-4 h-4 text-primary-400" />
                            </div>
                            <p className="text-[10px] font-bold text-primary-300 uppercase leading-relaxed">Settle balance upon successful deployment.</p>
                            {paymentMethod === 'COD' && (
                               <div className="mt-6 animate-in fade-in duration-500">
                                  <Button onClick={handlePlaceOrder} disabled={isProcessing} className="w-full py-6 bg-orange-500 hover:bg-orange-600 rounded-sm font-black uppercase tracking-widest text-xs h-auto shadow-lg">
                                     {isProcessing ? 'Deploying Order...' : 'Confirm Shipment Delivery'}
                                  </Button>
                               </div>
                            )}
                         </label>
                      </div>
                      
                      {/* UNAVAILABLE MODES */}
                      <div className="grid grid-cols-2 gap-4 opacity-30 h-16 pointer-events-none">
                         <div className="bg-secondary-400 rounded-sm"></div>
                         <div className="bg-secondary-400 rounded-sm"></div>
                      </div>
                   </div>
                </div>
             ) : (
                <div className="flex items-center gap-5">
                   <div className="h-10 w-10 bg-secondary-400 rounded-sm flex items-center justify-center text-primary-500 font-black text-xs border border-primary-50">04</div>
                   <h3 className="text-[10px] font-black text-primary-200 uppercase tracking-widest">Settlement Selection</h3>
                </div>
             )}
          </div>
        </div>

        {/* SIDEBAR PRICE LOGS */}
        <div className="lg:col-span-4 px-4 sm:px-0">
           <div className="bg-white rounded-sm border border-primary-50 shadow-sm sticky top-24 overflow-hidden">
              <div className="px-6 py-5 bg-secondary-400/50 border-b border-primary-50">
                 <h3 className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em]">Transaction Ledger</h3>
              </div>
              <div className="p-6 space-y-6">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-primary-500">
                       <span className="uppercase tracking-widest text-[10px] text-primary-200">Manifest Value ({items.length})</span>
                       <span className="tabular-nums">{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-primary-500">
                       <span className="uppercase tracking-widest text-[10px] text-primary-200">Logistics Fee</span>
                       <span className="text-green-600 uppercase tracking-widest italic text-[10px]">Exempted / Free</span>
                    </div>
                    <div className="h-px bg-primary-100/50 border-dashed border-t"></div>
                    <div className="flex justify-between items-center py-2">
                       <span className="text-xs font-black text-primary-500 uppercase tracking-widest">Net Payable</span>
                       <span className="text-2xl font-black text-primary-500 tabular-nums">{formatCurrency(total)}</span>
                    </div>
                 </div>
                 
                 <div className="bg-secondary-50 p-4 rounded-sm border border-primary-50 space-y-3">
                    <div className="flex items-center gap-3">
                       <ShieldCheck className="w-5 h-5 text-green-600" />
                       <p className="text-[9px] font-black text-primary-500 uppercase tracking-widest">End-to-End Encrypted</p>
                    </div>
                    <p className="text-[8px] font-bold text-primary-200 uppercase leading-relaxed">Jesify Vault protects your assets and transaction logs with multi-layer encryption.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
