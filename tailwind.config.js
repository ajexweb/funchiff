/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,jsx,ts,tsx}", // फ्लैट स्ट्रक्चर: सारी फाइल्स बाहर ही मिलेंगी
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0A1428', // बहुत डार्क नेवी ब्लू (Background के लिए)
          800: '#001233', // थोड़ा हल्का नेवी (Cards के लिए)
          700: '#1A2A4A', // होवर इफ़ेक्ट (Hover) के लिए
        },
        pureWhite: '#FFFFFF',
        darkBlack: '#000000',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(10, 20, 40, 0.5)', // गेमिंग कार्ड्स के लिए प्रीमियम शैडो
      },
      backdropBlur: {
        'glass': '12px', // आर-पार दिखने वाला शीशे जैसा इफ़ेक्ट
      }
    },
  },
  plugins: [],
}