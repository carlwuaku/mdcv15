/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      // Custom colors matching your Material theme
      colors: {
        primary: {
          50: '#e8eaf6',
          100: '#c5cae9',
          200: '#9fa8da',
          300: '#7986cb',
          400: '#5c6bc0',
          500: '#3f51b5', // Your primary color
          600: '#3949ab',
          700: '#303f9f',
          800: '#283593',
          900: '#1a237e',
        },
        secondary: {
          50: '#fff3e0',
          100: '#ffe0b2',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa726',
          500: '#ff9800', // Your accent color
          600: '#fb8c00',
          700: '#f57c00',
          800: '#ef6c00',
          900: '#e65100',
        },
        success: {
          50: '#f0fff4',
          100: '#c6f6d5',
          200: '#9ae6b4',
          300: '#68d391',
          400: '#48bb78',
          500: '#38a169',
          600: '#2f855a',
          700: '#276749',
          800: '#22543d',
          900: '#1a202c',
        },
        warning: {
          50: '#fffaf0',
          100: '#fef5e7',
          200: '#feebc8',
          300: '#fbd38d',
          400: '#f6ad55',
          500: '#ed8936',
          600: '#dd6b20',
          700: '#c05621',
          800: '#9c4221',
          900: '#7b341e',
        },
        error: {
          50: '#fed7d7',
          100: '#feb2b2',
          200: '#fc8181',
          300: '#f56565',
          400: '#e53e3e',
          500: '#c53030',
          600: '#9b2c2c',
          700: '#822727',
          800: '#63171b',
          900: '#4a1010',
        },
        info: {
          50: '#ebf8ff',
          100: '#bee3f8',
          200: '#90cdf4',
          300: '#63b3ed',
          400: '#4299e1',
          500: '#3182ce',
          600: '#2b77cb',
          700: '#2c5aa0',
          800: '#2a4a7e',
          900: '#1e3a5f',
        },
        gray: {
          50: '#f7fafc',
          100: '#edf2f7',
          200: '#e2e8f0',
          300: '#cbd5e0',
          400: '#a0aec0',
          500: '#718096',
          600: '#4a5568',
          700: '#2d3748',
          800: '#1a202c',
          900: '#171923',
        }
      },

      // Custom spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '120': '30rem',
      },

      // Custom font sizes
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },

      // Custom border radius
      borderRadius: {
        'none': '0',
        'sm': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },

      // Custom shadows
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 25px rgba(0, 0, 0, 0.1)',
        'xl': '0 25px 50px rgba(0, 0, 0, 0.15)',
        '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      },

      // Custom transitions
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
        '600': '600ms',
      },

      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in': 'slideIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      // Custom keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-3px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(3px)' },
        },
      },

      // Custom typography
      fontFamily: {
        'sans': ['Muli', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'serif': ['Georgia', 'serif'],
        'mono': ['Monaco', 'Consolas', 'monospace'],
      },

      // Custom line heights
      lineHeight: {
        'extra-loose': '2.5',
        'loose': '2',
      },

      // Custom letter spacing
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },

      // Custom z-index
      zIndex: {
        '999': '999',
        '1000': '1000',
        '1040': '1040',
        '3999': '3999',
      },

      // Custom backdrop blur
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
    },
  },
  plugins: [
    // Add custom component classes
    function ({ addComponents, theme }) {
      addComponents({
        // Modern card component
        '.card-modern': {
          borderRadius: theme('borderRadius.xl'),
          boxShadow: theme('boxShadow.lg'),
          border: `1px solid ${theme('colors.gray.200')}`,
          transition: 'all 0.3s ease',
          backgroundColor: theme('colors.white'),
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme('boxShadow.xl'),
          },
        },

        // Modern button base
        '.btn-modern': {
          borderRadius: theme('borderRadius.lg'),
          fontWeight: theme('fontWeight.medium'),
          transition: 'all 0.3s ease',
          textTransform: 'none',
          '&:hover:not(:disabled)': {
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.md'),
          },
          '&:active:not(:disabled)': {
            transform: 'translateY(0)',
          },
          '&:disabled': {
            opacity: '0.6',
            cursor: 'not-allowed',
          },
        },

        // Modern form field
        '.form-field-modern': {
          '& input, & textarea, & select': {
            borderRadius: theme('borderRadius.lg'),
            transition: 'all 0.15s ease',
            '&:focus': {
              transform: 'translateY(-1px)',
              borderColor: theme('colors.primary.500'),
              boxShadow: `0 0 0 3px ${theme('colors.primary.100')}`,
            },
          },
        },

        // Alert components
        '.alert-modern': {
          padding: theme('spacing.4'),
          borderRadius: theme('borderRadius.lg'),
          display: 'flex',
          alignItems: 'center',
          gap: theme('spacing.3'),
          fontWeight: theme('fontWeight.medium'),
        },

        '.alert-success': {
          backgroundColor: theme('colors.success.50'),
          color: theme('colors.success.700'),
          borderColor: theme('colors.success.200'),
        },

        '.alert-warning': {
          backgroundColor: theme('colors.warning.50'),
          color: theme('colors.warning.700'),
          borderColor: theme('colors.warning.200'),
        },

        '.alert-error': {
          backgroundColor: theme('colors.error.50'),
          color: theme('colors.error.700'),
          borderColor: theme('colors.error.200'),
        },

        '.alert-info': {
          backgroundColor: theme('colors.info.50'),
          color: theme('colors.info.700'),
          borderColor: theme('colors.info.200'),
        },

        // Table enhancements
        '.table-modern': {
          borderRadius: theme('borderRadius.lg'),
          overflow: 'hidden',
          boxShadow: theme('boxShadow.sm'),
          border: `1px solid ${theme('colors.gray.200')}`,
          '& thead': {
            backgroundColor: theme('colors.gray.50'),
            '& th': {
              fontWeight: theme('fontWeight.semibold'),
              color: theme('colors.gray.700'),
              borderBottomColor: theme('colors.primary.500'),
              borderBottomWidth: '2px',
            },
          },
          '& tbody tr': {
            transition: 'background-color 0.15s ease',
            '&:hover': {
              backgroundColor: theme('colors.primary.50'),
            },
            '&:nth-child(even)': {
              backgroundColor: theme('colors.gray.25'),
            },
          },
        },

        // Dashboard card
        '.dashboard-card-modern': {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: theme('borderRadius.xl'),
          transition: 'all 0.3s ease',
          '& .icon': {
            color: 'rgba(0, 0, 0, 0.1)',
            position: 'absolute',
            bottom: theme('spacing.2'),
            right: theme('spacing.2'),
            transition: 'all 0.3s ease',
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme('boxShadow.xl'),
            '& .icon': {
              color: 'rgba(255, 255, 255, 0.8)',
              transform: 'scale(1.1)',
            },
          },
        },

        // Loading spinner
        '.spinner-modern': {
          display: 'inline-block',
          width: theme('spacing.5'),
          height: theme('spacing.5'),
          border: '2px solid transparent',
          borderTop: `2px solid ${theme('colors.primary.500')}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        },

        // Gradient backgrounds (subtle, not for buttons)
        '.bg-gradient-primary': {
          background: `linear-gradient(135deg, ${theme('colors.primary.500')} 0%, ${theme('colors.primary.600')} 100%)`,
        },

        '.bg-gradient-secondary': {
          background: `linear-gradient(135deg, ${theme('colors.secondary.500')} 0%, ${theme('colors.secondary.600')} 100%)`,
        },

        '.bg-gradient-page': {
          background: `linear-gradient(135deg, ${theme('colors.primary.500')} 0%, ${theme('colors.secondary.500')} 100%)`,
        },

        // Text utilities
        '.text-gradient': {
          background: `linear-gradient(135deg, ${theme('colors.primary.500')} 0%, ${theme('colors.secondary.500')} 100%)`,
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          backgroundClip: 'text',
        },

        // Glass morphism effect
        '.glass': {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },

        // Focus styles for accessibility
        '.focus-modern': {
          '&:focus': {
            outline: `2px solid ${theme('colors.primary.500')}`,
            outlineOffset: '2px',
            boxShadow: `0 0 0 3px ${theme('colors.primary.200')}`,
          },
        },
      })
    },

    // Add utility classes
    function ({ addUtilities, theme }) {
      addUtilities({
        // Animation utilities
        '.animate-fade-in': {
          animation: 'fadeIn 0.5s ease-out',
        },
        '.animate-slide-in': {
          animation: 'slideIn 0.6s ease-out',
        },
        '.animate-slide-up': {
          animation: 'slideUp 0.6s ease-out',
        },
        '.animate-shake': {
          animation: 'shake 0.5s ease-in-out',
        },

        // Transform utilities
        '.transform-gpu': {
          transform: 'translateZ(0)',
        },

        // Scrollbar utilities
        '.scrollbar-thin': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme('colors.gray.100'),
            borderRadius: theme('borderRadius.sm'),
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme('colors.primary.500'),
            borderRadius: theme('borderRadius.sm'),
            '&:hover': {
              background: theme('colors.primary.600'),
            },
          },
        },

        // Safe area utilities for mobile
        '.safe-top': {
          paddingTop: 'env(safe-area-inset-top)',
        },
        '.safe-bottom': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
        '.safe-left': {
          paddingLeft: 'env(safe-area-inset-left)',
        },
        '.safe-right': {
          paddingRight: 'env(safe-area-inset-right)',
        },
      })
    },
  ],

  // Ensure Tailwind doesn't purge Angular Material classes
  safelist: [
    'mat-mdc-card',
    'mat-mdc-button',
    'mat-mdc-raised-button',
    'mat-mdc-outlined-button',
    'mat-mdc-form-field',
    'mat-mdc-table',
    'mat-toolbar',
    'mat-mdc-dialog-container',
    'mat-mdc-menu-panel',
    'mat-mdc-snack-bar-container',
    // Add patterns for dynamic classes
    {
      pattern: /mat-*/,
    },
    {
      pattern: /bg-(red|pink|purple|indigo|blue|green|yellow|orange)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /text-(red|pink|purple|indigo|blue|green|yellow|orange)-(50|100|200|300|400|500|600|700|800|900)/,
    },
  ],
  important: true,
}

