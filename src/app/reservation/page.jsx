import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <div>
      
      {/* Section Comment ça marche */}
      <section className="py-16 bg-gray-50">
        <div className="mt-10 container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">COMMENT ÇA MARCHE ?</h2>
            <div className="w-24 h-1 bg-amber-400 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {/* Étape 1 */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h18v18H3zM9 3v18M3 9h6M3 15h6M15 3v18M15 9h6M15 15h6" />
                  </svg>
                </div>
              </div>
              <div className="text-amber-500 font-medium mb-2">Étape 1</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Commandez en ligne</h3>
              <p className="text-gray-600">
                Connectez-vous sur ordinateur ou téléphone, créez un compte,passez votre commande, recevez votre facture.
              </p>
            </div>
            
            {/* Étape 2 */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 17h14M5 17a2 2 0 100 4h14a2 2 0 100-4M5 17v-2m14 2v-2M5 11h14M5 11a2 2 0 100 4h14a2 2 0 100-4M5 11V9m14 2V9M5 5h14M5 5a2 2 0 100 4h14a2 2 0 100-4M5 5V3m14 2V3" />
                  </svg>
                </div>
              </div>
              <div className="text-amber-500 font-medium mb-2">Étape 2</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Collecte à domicile</h3>
              <p className="text-gray-600">
                Nous récupérons votre linge grâce à notre service logistique et transport partout à Douala.
              </p>
            </div>
            
            {/* Étape 3 */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
              </div>
              <div className="text-amber-500 font-medium mb-2">Étape 3</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Traitement soigné</h3>
              <p className="text-gray-600">
                Vos habits sont nettoyés, lavés, repassés, teints et traités selon vos besoins.
              </p>
            </div>
            
            {/* Étape 4 */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
              </div>
              <div className="text-amber-500 font-medium mb-2">Étape 4</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Livraison</h3>
              <p className="text-gray-600">
                Vos habits vous sont livrés dans les délais indiqués. Vous payez à la livraison.
              </p>
            </div>
          </div>
        </div>
      </section>
 <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-gray-90 to-gray-90 text-black rounded-xl p-4 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3 mb-6 md:mb-0 text-left">
                {/* <h2 className="text-3xl font-bold mb-4">Appelez-nous : <span className="text-amber-300">678 269 637/694 264 005 </span></h2> */}
                <p className="text-lg mb-4 md:pr-10">
                  Reservez 1 jour avant pour nos services spéciaux. Notre équipe est impatiente de vous servir !                  
                </p>
                <div className="flex items-center space-x-2 text-amber-100">
                  {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Lundi - Samedi : 8h00 - 19h00</span> */}
                    <Link 
                  href="/reservation/commande/commandes" 
                  className="inline-block bg-green-600 text-white-100 px-3 py-2 rounded-lg font-medium text-lg hover:bg-green-600 "
                >
                Voir mes commandes
                </Link>
                </div>
               
              </div>
         
            </div>
          </div>
        </div>
      </section>    
    </div>
  )
}

export default page
