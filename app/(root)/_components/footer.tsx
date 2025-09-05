import { Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <h3 className="text-xl font-bold">optim bozor</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              O&apos;zbekistondagi eng yaxshi onlayn do&apos;kon. Sifatli
              mahsulotlar, tez yetkazib berish va qulay narxlar.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="w-4 h-4" />
                <span>+998 (90) 123-45-67</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="w-4 h-4" />
                <span>info@optimbozor.uz</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>Toshkent, O&apos;zbekiston</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Kategoriyalar</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Elektr asboblar
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Qurilish materiallari
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Bog&apos;-tomorqa anjomlari
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Uy anjomlari
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Avtomobil ehtiyot qismlari
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Sport anjomlari
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Mijozlar uchun</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Yetkazib berish
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  To&apos;lov usullari
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Qaytarish va almashtirish
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Yordam markazi
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Bizning do&apos;konlarimiz
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Aloqa
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Bizni kuzatib boring</h4>

            {/* Social Media Links */}
            <div className="flex space-x-3">
              <Link
                href="https://instagram.com/optimbozor"
                className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Instagram"
              >
                <svg
                  data-v-438291e5=""
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ui-icon "
                >
                  <g clipPath="url(#clip0_883_567)">
                    <path
                      d="M24 0c20 0 24 4 24 24s-4 24-24 24S0 44 0 24 4 0 24 0Z"
                      fill="url(#paint0_linear_883_567)"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M24 12.522c3.738 0 4.18.015 5.657.082 1.365.062 2.106.29 2.6.482.653.254 1.12.557 1.61 1.047.49.49.793.956 1.047 1.61.191.493.42 1.235.481 2.6.068 1.476.082 1.918.082 5.657 0 3.738-.014 4.18-.082 5.657-.062 1.365-.29 2.106-.482 2.6a4.341 4.341 0 0 1-1.046 1.61c-.49.49-.957.793-1.61 1.047-.494.191-1.235.42-2.6.481-1.476.068-1.919.082-5.657.082-3.739 0-4.181-.014-5.657-.082-1.365-.062-2.107-.29-2.6-.482a4.342 4.342 0 0 1-1.61-1.046 4.329 4.329 0 0 1-1.047-1.61c-.192-.494-.42-1.235-.482-2.6-.067-1.476-.082-1.919-.082-5.657 0-3.739.015-4.181.082-5.657.062-1.365.29-2.107.482-2.6a4.343 4.343 0 0 1 1.047-1.61 4.33 4.33 0 0 1 1.61-1.047c.493-.192 1.235-.42 2.6-.482 1.476-.067 1.918-.082 5.657-.082ZM24 10c-3.802 0-4.28.016-5.773.085-1.49.067-2.507.304-3.398.65a6.857 6.857 0 0 0-2.48 1.615 6.858 6.858 0 0 0-1.614 2.48c-.346.89-.583 1.908-.65 3.397C10.015 19.721 10 20.197 10 24c0 3.802.016 4.279.085 5.772.067 1.49.304 2.507.65 3.398.358.921.837 1.702 1.615 2.48a6.862 6.862 0 0 0 2.48 1.615c.89.346 1.908.583 3.398.65 1.493.069 1.97.085 5.772.085 3.802 0 4.28-.016 5.773-.084 1.49-.068 2.508-.305 3.398-.651a6.857 6.857 0 0 0 2.48-1.615 6.86 6.86 0 0 0 1.614-2.48c.346-.89.583-1.908.651-3.398.068-1.493.085-1.97.085-5.772 0-3.802-.017-4.28-.085-5.773-.068-1.49-.304-2.508-.65-3.398a6.855 6.855 0 0 0-1.616-2.48 6.86 6.86 0 0 0-2.48-1.614c-.89-.346-1.908-.583-3.398-.65C28.279 10.015 27.802 10 24 10Zm0 6.81a7.189 7.189 0 1 0 0 14.378 7.189 7.189 0 0 0 0-14.377Zm0 11.856a4.666 4.666 0 1 1 0-9.333 4.666 4.666 0 0 1 0 9.333Zm9.153-12.14a1.68 1.68 0 1 1-3.36 0 1.68 1.68 0 0 1 3.36 0Z"
                      fill="#fff"
                    ></path>
                  </g>
                  <defs>
                    <linearGradient
                      id="paint0_linear_883_567"
                      x1="42.81"
                      y1="5.656"
                      x2="5.044"
                      y2="42.485"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#BA00B2"></stop>
                      <stop offset=".5" stopColor="#F40000"></stop>
                      <stop offset="1" stopColor="#FFA800"></stop>
                    </linearGradient>
                    <clipPath id="clip0_883_567">
                      <path fill="#fff" d="M0 0h48v48H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
              </Link>

              <Link
                href="https://t.me/optimbozor_2025"
                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Telegram"
              >
                <svg
                  data-v-438291e5=""
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ui-icon "
                >
                  <g clipPath="url(#clip0_883_569)">
                    <path
                      d="M24 0c20 0 24 4 24 24s-4 24-24 24S0 44 0 24 4 0 24 0Z"
                      fill="url(#paint0_linear_883_569)"
                    ></path>
                    <path
                      d="M11.792 23.799c6.996-3.048 11.662-5.058 13.996-6.029 6.665-2.772 8.05-3.254 8.953-3.27.198-.003.642.046.93.28.242.196.31.463.341.65.032.186.072.612.04.944-.36 3.795-1.924 13.005-2.719 17.255-.336 1.798-.998 2.401-1.64 2.46-1.394.129-2.452-.92-3.802-1.806-2.112-1.384-3.305-2.246-5.356-3.597-2.37-1.562-.833-2.42.517-3.823.354-.367 6.494-5.952 6.613-6.459.015-.063.029-.3-.111-.424-.14-.125-.348-.082-.497-.048-.212.048-3.587 2.278-10.124 6.69-.958.659-1.825.979-2.602.962-.857-.018-2.506-.484-3.731-.883-1.503-.488-2.698-.747-2.594-1.576.054-.432.65-.874 1.786-1.326Z"
                      fill="#fff"
                    ></path>
                  </g>
                  <defs>
                    <linearGradient
                      id="paint0_linear_883_569"
                      x1="24"
                      y1="0"
                      x2="24"
                      y2="47.644"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#2AABEE"></stop>
                      <stop offset="1" stopColor="#229ED9"></stop>
                    </linearGradient>
                    <clipPath id="clip0_883_569">
                      <path fill="#fff" d="M0 0h48v48H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
              </Link>

              <Link
                href="https://facebook.com/optimbozor"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Facebook"
              >
                <svg
                  data-v-438291e5=""
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ui-icon "
                >
                  <g clipPath="url(#clip0_1020_9699)">
                    <path
                      d="M24 0c20 0 24 4 24 24s-4 24-24 24S0 44 0 24 4 0 24 0Z"
                      fill="#1877F2"
                    ></path>
                    <path
                      d="M33.186 30.938 34.25 24h-6.656v-4.502c0-1.898.93-3.748 3.911-3.748h3.026V9.844s-2.746-.469-5.372-.469c-5.482 0-9.065 3.322-9.065 9.337V24H14v6.938h6.094v17.009C21.5 48 21.5 48 23.844 48c1.276 0 2.656 0 3.75-.053v-17.01h5.592Z"
                      fill="#fff"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_1020_9699">
                      <path fill="#fff" d="M0 0h48v48H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
              </Link>

              <Link
                href="https://youtube.com/@optimbozor"
                className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="YouTube"
              >
                <svg
                  data-v-438291e5=""
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ui-icon "
                >
                  <g clipPath="url(#clip0_13094_71909)">
                    <path
                      d="M24 0c20 0 24 4 24 24s-4 24-24 24S0 44 0 24 4 0 24 0Z"
                      fill="red"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M36.502 13.657a3.972 3.972 0 0 1 2.83 2.778C40 18.886 40 24 40 24s0 5.114-.669 7.565a3.972 3.972 0 0 1-2.829 2.778C34.006 35 24 35 24 35s-10.007 0-12.502-.657a3.973 3.973 0 0 1-2.83-2.778C8 29.114 8 24 8 24s0-5.114.669-7.565a3.973 3.973 0 0 1 2.829-2.778C13.992 13 24 13 24 13s10.006 0 12.502.657ZM29 24l-8 4.75v-9.5L29 24Z"
                      fill="#fff"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_13094_71909">
                      <path fill="#fff" d="M0 0h48v48H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
              </Link>
            </div>

            {/* Working Hours */}

            {/* Newsletter */}
            <div className="space-y-2">
              <h5 className="font-medium">Yangiliklar</h5>
              <p className="text-sm text-gray-300">
                Maxsus takliflar va yangiliklar haqida birinchi bo&apos;lib
                bilib oling
              </p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Email manzilingiz"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm focus:outline-none focus:border-purple-500"
                />
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-sm font-medium transition-colors">
                  Obuna
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024 Optim Bozor. Barcha huquqlar himoyalangan.
            </div>

            <div className="flex space-x-6 text-sm">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Maxfiylik siyosati
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Foydalanish shartlari
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Sayt xaritasi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
