import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, totalPrice } = useCart();

  // Fonction pour générer le message et rediriger vers WhatsApp
  const handleWhatsAppOrder = () => {
    const phoneNumber = "243999999999"; // Remplace par ton numéro WhatsApp professionnel (ex: code pays + numéro)
    
    let message = "Bonjour Mc Molato, je souhaite passer commande pour les articles suivants :\n\n";
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (x${item.quantity}) - ${item.priceFormatted}\n`;
    });
    message += `\n*Montant total : ${totalPrice.toLocaleString()} CDF*`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="py-16 px-4 max-w-[1200px] mx-auto text-center">
        <h1 className="text-4xl font-serif font-light mb-6">Votre Panier</h1>
        <div className="bg-gray-50 border border-gray-100 rounded-[2.5rem] p-12 max-w-lg mx-auto flex flex-col items-center gap-4 shadow-sm">
          <span className="text-5xl">🛍️</span>
          <p className="text-gray-600 font-light">Votre panier est actuellement vide.</p>
          <Link to="/boutique" className="bg-black text-white text-xs tracking-wider uppercase px-6 py-3.5 rounded-full font-medium transition hover:bg-zinc-800 shadow-md">
            Explorer la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 max-w-[1200px] mx-auto text-gray-900">
      <h1 className="text-4xl font-serif font-light mb-8">Votre Panier ({cart.reduce((acc, item) => acc + item.quantity, 0)})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Liste des articles */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-gray-50 border border-gray-100 p-4 rounded-3xl gap-4 shadow-sm">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-2xl" />
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-xs text-gray-500 font-light">{item.priceFormatted} × {item.quantity}</p>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-semibold text-sm">{(item.priceValue * item.quantity).toLocaleString()} CDF</span>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 p-2.5 rounded-full transition text-xs"
                  title="Supprimer l'article"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé de la commande et bouton WhatsApp */}
        <div className="bg-[#f7f7f7] border border-gray-200/80 rounded-[2.5rem] p-8 flex flex-col justify-between h-fit">
          <div>
            <h2 className="text-2xl font-serif mb-6">Résumé du panier</h2>
            <div className="flex justify-between items-center mb-4 text-sm">
              <span className="text-gray-600 font-light">Total général</span>
              <span className="text-xl font-bold">{totalPrice.toLocaleString()} CDF</span>
            </div>
            <p className="text-xs text-gray-500 font-light mb-6">
              Les taxes et frais de livraison seront confirmés directement lors de votre échange sur WhatsApp.
            </p>
          </div>

          <button 
            onClick={handleWhatsAppOrder}
            className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs tracking-wider uppercase px-6 py-4 rounded-full font-medium transition shadow-md flex items-center justify-center gap-2"
          >
            <span>💬</span> Commander via WhatsApp
          </button>
        </div>

      </div>
    </div>
  );
}