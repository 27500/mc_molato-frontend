import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const getSafePrice = (item) => {
    if (typeof item.rawPrice === 'number' && !isNaN(item.rawPrice)) {
      return item.rawPrice;
    }
    if (item.priceFormatted) {
      const cleaned = parseInt(String(item.priceFormatted).replace(/[^0-9]/g, ''), 10);
      if (!isNaN(cleaned)) return cleaned;
    }
    return 0;
  };

  const totalGeneral = cart.reduce((acc, item) => {
    const price = getSafePrice(item);
    const qty = Number(item.quantity) || 1;
    return acc + (price * qty);
  }, 0);

  const handleWhatsAppOrder = () => {
    const phoneNumber = "+212646101150";
    let message = "Bonjour Mc Molato, je souhaite passer commande :\n\n";
    
    cart.forEach((item) => {
      const unitPrice = getSafePrice(item);
      const qty = Number(item.quantity) || 1;
      message += `- ${item.name} (${qty}x) : ${(unitPrice * qty).toLocaleString()} CDF\n`;
    });
    
    message += `\n*Total général : ${totalGeneral.toLocaleString()} CDF*`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl shadow-sm overflow-hidden bg-white flex items-center justify-center">
          <img src="/logo.jpeg" alt="Mc Molato Logo" className="w-full h-full object-cover rounded-2xl" />
        </div>
        <h2 className="text-2xl font-serif font-light mb-2">Votre panier est vide</h2>
        <p className="text-xs text-gray-500 mb-6">Découvrez nos collections pour ajouter des articles à votre panier.</p>
        <Link to="/boutique" className="bg-black text-white text-xs px-6 py-3 rounded-xl uppercase tracking-wider inline-block hover:bg-zinc-800 transition">
          Explorer la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-[1400px] mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-light">Votre Panier ({cart.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0)})</h1>
        <div className="w-14 h-14 rounded-2xl shadow-sm overflow-hidden bg-white flex items-center justify-center">
          <img src="/logo.jpeg" alt="Mc Molato" className="w-full h-full object-cover rounded-2xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cart.map((item) => {
            const unitPrice = getSafePrice(item);
            const qty = Number(item.quantity) || 1;
            return (
              <div key={item.id} className="bg-gray-50 border border-gray-100 rounded-3xl p-4 flex items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-24 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = '/logo.jpeg'; }} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider block mb-1">{item.category}</span>
                    <h3 className="font-serif text-sm font-medium text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-xs font-bold text-black">{unitPrice.toLocaleString()} CDF</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden">
                    <button onClick={() => updateQuantity(item.id, qty - 1)} className="px-3 py-1 text-xs hover:bg-gray-100 transition">-</button>
                    <span className="px-3 text-xs font-semibold">{qty}</span>
                    <button onClick={() => updateQuantity(item.id, qty + 1)} className="px-3 py-1 text-xs hover:bg-gray-100 transition">+</button>
                  </div>

                  <p className="text-xs font-bold text-black min-w-[80px] text-right">
                    {(unitPrice * qty).toLocaleString()} CDF
                  </p>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-50 text-red-500 hover:bg-red-100 p-2.5 rounded-xl transition text-xs"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 h-fit flex flex-col justify-between shadow-sm">
          <h3 className="text-lg font-serif font-medium mb-6">Résumé du panier</h3>
          
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
            <span className="text-xs text-gray-500">Total général</span>
            <span className="text-base font-bold text-black">{totalGeneral.toLocaleString()} CDF</span>
          </div>

          <p className="text-[11px] text-gray-400 mb-6 leading-relaxed">
            Les taxes et frais de livraison seront confirmés directement lors de votre échange sur WhatsApp.
          </p>

          <button 
            onClick={handleWhatsAppOrder}
            className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition flex items-center justify-center gap-2 shadow-sm"
          >
            <span>💬</span> Commander via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}