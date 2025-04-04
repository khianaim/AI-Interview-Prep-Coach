module.exports = {
  theme: {
    extend: {
      keyframes: {
        type: {
          '0%': { width: '0' },
          '1%, 99%': { 'border-right': '1px solid orange' },
          '100%': { 'border-right': 'none' },
        },
        shrink: {
          '0%': {
            backgroundPosition: '0 0',
            opacity: '0',
            width: '0',
          },
          '1%': {
            backgroundPosition: '0 0',
            opacity: '1',
            'border-right': '1px solid orange',
          },
          '50%': {
            backgroundPosition: '150px 0',
            opacity: '1',
            'border-right': '1px solid orange',
          },
          '100%': {
            backgroundPosition: '400px 0',
            opacity: '1',
            'border-right': '1px solid orange',
          },
        },
      },
      animation: {
        type: 'type 2s steps(40, end) forwards',
        shrink: 'shrink-animation 2.2s steps(40, end) 2s forwards',
        blink: 'blink 0.5s step-end infinite alternate',
      },
    },
  },
}
