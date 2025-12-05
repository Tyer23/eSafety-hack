/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // COLORS - KindNet iOS 18 Palette (from Figma)
      colors: {
        // Brand Colors - Reference CSS variables from globals.css
        blurple: {
          DEFAULT: 'var(--blurple)',
          light: 'var(--blurple-light)',
          dark: 'var(--blurple-dark)',
        },

        // Traffic Light System - Reference CSS variables
        safe: {
          DEFAULT: 'var(--safe)',
          dark: 'var(--safe-dark)',
        },
        caution: {
          DEFAULT: 'var(--caution)',
          dark: 'var(--caution-dark)',
        },
        alert: {
          DEFAULT: 'var(--alert)',
          dark: 'var(--alert-dark)',
        },

        // Neutral Colors (iOS 18) - Reference CSS variables
        gray: {
          50: 'var(--gray-50)',
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          300: 'var(--gray-300)',
          400: 'var(--gray-400)',
          500: 'var(--gray-500)',
          600: 'var(--gray-600)',
          700: 'var(--gray-700)',
          800: 'var(--gray-800)',
          900: 'var(--gray-900)',
        },

        // Semantic Colors - Reference CSS variables
        success: {
          DEFAULT: 'var(--success)',
          bg: 'var(--success-bg)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          bg: 'var(--warning-bg)',
        },
        error: {
          DEFAULT: 'var(--error)',
          bg: 'var(--error-bg)',
        },
        info: {
          DEFAULT: 'var(--info)',
          bg: 'var(--info-bg)',
        },

        // Radix UI compatibility colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },

      // TYPOGRAPHY - iOS San Francisco Style
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'system-ui',
          'sans-serif',
        ],
      },

      fontSize: {
        // iOS Type Scale (from Figma)
        'large-title': ['34px', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.4px' }],
        'title-1': ['28px', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.4px' }],
        'title-2': ['22px', { lineHeight: '1.27', fontWeight: '700', letterSpacing: '-0.41px' }],
        'title-3': ['20px', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.4px' }],
        'body': ['17px', { lineHeight: '1.47', fontWeight: '400', letterSpacing: '-0.41px' }],      // iOS default
        'callout': ['16px', { lineHeight: '1.31', fontWeight: '400', letterSpacing: '-0.32px' }],
        'subhead': ['15px', { lineHeight: '1.33', fontWeight: '400', letterSpacing: '-0.24px' }],
        'footnote': ['13px', { lineHeight: '1.38', fontWeight: '400', letterSpacing: '-0.08px' }],
        'caption': ['12px', { lineHeight: '1.33', fontWeight: '400', letterSpacing: '0px' }],
      },

      letterSpacing: {
        tight: '-0.4px',   // Large text
        normal: '0',
        wide: '0.5px',     // All caps
      },

      // SPACING - 4px base unit
      spacing: {
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '2.5': '10px',
        '3': '12px',
        '3.5': '14px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '9': '36px',
        '10': '40px',
        '11': '44px',
        '12': '48px',
        '14': '56px',
        '16': '64px',
        '20': '80px',
        '24': '96px',

        // Semantic spacing
        'screen-margin': '20px',
        'card-padding': '24px',
        'section': '32px',
        'component': '16px',
      },

      // BORDER RADIUS - iOS 18 style
      borderRadius: {
        'sm': '8px',
        'DEFAULT': '12px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
        'full': '9999px',
      },

      // SHADOWS - iOS 18 (very subtle, from Figma)
      boxShadow: {
        'soft': '0 1px 4px rgba(0, 0, 0, 0.04)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'elevated': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'float': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'none': 'none',
      },

      // ANIMATION
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '350ms',
      },

      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',  // iOS-style bounce
      },

      // Z-INDEX
      zIndex: {
        'dropdown': '1000',
        'sticky': '1100',
        'fixed': '1200',
        'modal-backdrop': '1300',
        'modal': '1400',
        'popover': '1500',
        'tooltip': '1600',
      },

      // BREAKPOINTS (mobile-first)
      screens: {
        'sm': '640px',   // Small tablets
        'md': '768px',   // Tablets
        'lg': '1024px',  // Laptops
        'xl': '1280px',  // Desktops
        '2xl': '1536px', // Large desktops
      },

      // KEYFRAMES for animations
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
