const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it');
const md = new markdownIt();

const postsDir = path.join(__dirname, 'posts');
const distDir = path.join(__dirname, 'dist');
const blogDir = path.join(distDir, 'blog');

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(blogDir, { recursive: true });

const posts = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

let indexEntries = '';

posts.forEach(file => {
  const slug = path.basename(file, '.md');
  const src = fs.readFileSync(path.join(postsDir, file), 'utf8');
  const html = md.render(src);
  const postHtml = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${slug}</title>
  <link rel="stylesheet" href="../style.css">
</head>
<body>
  <nav><a href="../index.html">Home</a></nav>
  <article>${html}</article>
</body>
</html>`;
  const outPath = path.join(blogDir, `${slug}.html`);
  fs.writeFileSync(outPath, postHtml);

  indexEntries += `<li><a href="${slug}.html">${slug.replace(/-/g, ' ')}</a></li>`;
});

const indexHtml = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Blog</title>
  <link rel="stylesheet" href="../style.css">
</head>
<body>
  <nav><a href="../index.html">Home</a></nav>
  <h1>Blog</h1>
  <ul>${indexEntries}</ul>
</body>
</html>`;

fs.writeFileSync(path.join(blogDir, 'index.html'), indexHtml);

// homepage
const homeHtml = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Alec's Site</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Alec Jones</h1>
  <p>Welcome to my website.</p>
  <p><a href="blog/index.html">Blog</a></p>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), homeHtml);

// copy style
const style = `body{font-family:Arial,sans-serif;margin:40px;}nav a{margin-right:10px;}a{text-decoration:none;color:#0366d6;}ul{list-style:none;padding:0;}article{max-width:650px;}`;
fs.writeFileSync(path.join(distDir, 'style.css'), style);
