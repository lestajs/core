export default {
  minify: true,
  origin: 'http://localhost:8080',
  outDir: 'dist',
  source: 'dist/index.html',
  view: {},
  meta: [{
    'http-equiv': 'Content-Security-Policy',
    content: "default-src 'self'; script-src 'self'; connect-src 'self'; style-src-attr 'none'"
  }]
}