// src/components/Footer.tsx
import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'

const Footer: React.FC = () => (
  <footer className="bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300 py-10 transition-colors duration-300">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Sección: Acerca de */}
        <div>
          <h3 className="text-lg font-semibold mb-4">SnapBuy</h3>
          <p className="text-sm">
            Tienda en línea de productos electrónicos con los mejores precios y envío rápido.
          </p>
        </div>

        {/* Sección: Enlaces */}
        <div>
          <h4 className="font-semibold mb-4">Enlaces útiles</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                Inicio
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                Checkout
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                Productos
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                Contacto
              </a>
            </li>
          </ul>
        </div>

        {/* Sección: Soporte */}
        <div>
          <h4 className="font-semibold mb-4">Soporte</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                Preguntas Frecuentes
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                Términos y Condiciones
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                Política de Privacidad
              </a>
            </li>
          </ul>
        </div>

        {/* Sección: Síguenos */}
        <div>
          <h4 className="font-semibold mb-4">Síguenos</h4>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
             
            </a>
          </div>
        </div>
      </div>

      {/* Línea divisoria */}
      <hr className="border-gray-300 dark:border-gray-700 my-8 transition-colors duration-300" />

      {/* Derechos */}
      <div className="text-center text-sm">
         {new Date().getFullYear()} SnapBuy. ningun derecho reservado ❤.
      </div>
    </div>
  </footer>
)

export default Footer
