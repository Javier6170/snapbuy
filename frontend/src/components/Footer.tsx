// src/components/Footer.tsx
import React from 'react'

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
              <a href="/checkout" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                Checkout
              </a>
            </li>
            <li>
              <a href="/#productos" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                Productos
              </a>
            </li>
            <li>
              <a href="/#contacto" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
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
              <a href="/faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                Preguntas Frecuentes
              </a>
            </li>
            <li>
              <a href="/terminos" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                Términos y Condiciones
              </a>
            </li>
            <li>
              <a href="/privacidad" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                Política de Privacidad
              </a>
            </li>
          </ul>
        </div>

        {/* Sección: Síguenos */}
        <div>
          <h4 className="font-semibold mb-4">Síguenos</h4>
          <div className="flex space-x-4 text-xl">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              aria-label="Facebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12H18l-.5 3h-2v7A10 10 0 0022 12z"/>
              </svg>
            </a>
            {/* Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 dark:hover:text-blue-300 transition"
              aria-label="Twitter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 19c11 0 17-9 17-17v-.8A12.3 12.3 0 0028 1.9a12 12 0 01-3.5 1c1.2-.7 2-1.8 2.3-3.2a12 12 0 01-3.8 1.5A6 6 0 0020 0c-3.3 0-6 2.7-6 6a5.8 5.8 0 001.5 4A6 6 0 012 4a5.8 5.8 0 001.8.2 6 6 0 01-4.8 6 6.1 6.1 0 01-1-.1A6 6 0 006 14a6 6 0 01-5 1.5 8.5 8.5 0 007 2A17 17 0 010 16a12 12 0 006 2"/>
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 dark:hover:text-pink-400 transition"
              aria-label="Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37a4 4 0 11-4.01-4 4 4 0 014.01 4z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-700 dark:hover:text-blue-300 transition"
              aria-label="LinkedIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 3a2 2 0 11.001 4.001A2 2 0 014 3zm0 5h4v12H4zm7.5 0h3.5v1.7h.05c.49-.92 1.7-1.9 3.5-1.9 3.7 0 4.5 2.4 4.5 5.5V20h-4v-5.8c0-1.4-.02-3.2-2-3.2-2 0-2.3 1.5-2.3 3.1V20h-4z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Línea divisoria */}
      <hr className="border-gray-300 dark:border-gray-700 my-8 transition-colors duration-300" />

      {/* Derechos */}
      <div className="text-center text-sm">
        © {new Date().getFullYear()} SnapBuy. Ningún derecho reservado ❤️.
      </div>
    </div>
  </footer>
)

export default Footer
