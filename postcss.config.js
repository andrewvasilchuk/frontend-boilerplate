module.exports = {
  plugins: {
    autoprefixer: {
      cascade: false,
      flexbox: false
    },
    ["css-mqpacker"]: {
      sort: true
    },
    cssnano: { zindex: false }
  }
};
