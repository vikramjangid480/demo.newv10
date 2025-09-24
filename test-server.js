#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;

// Sample blog data with featured_image_2 field
const sampleBlogs = [
  {
    id: 1,
    title: 'Building Your Personal Library: A Complete Guide',
    slug: 'building-personal-library-complete-guide',
    content: '<h2>Introduction</h2><p>Building a personal library is more than just collecting books—it\'s about creating a curated space that reflects your interests, values, and intellectual journey...</p><h2>Choosing Your Focus</h2><p>The first step in building your personal library is determining what genres and topics resonate with you most...</p><h2>Quality Over Quantity</h2><p>While it might be tempting to fill your shelves with as many books as possible, focusing on quality selections will serve you better in the long run...</p>',
    excerpt: 'Essential tips for curating a collection that reflects your personality and interests',
    featured_image: '1758533654_naruto.webp', // Use existing image
    featured_image_2: null, // Only one image for this blog
    category_id: 1,
    category_name: 'Fiction',
    category_slug: 'fiction',
    category: {
      id: 1,
      name: 'Fiction',
      slug: 'fiction'
    },
    tags: ['library', 'books', 'reading', 'collection', 'personal development'],
    meta_title: 'Building Your Personal Library: A Complete Guide',
    meta_description: 'Essential tips for curating a collection that reflects your personality and interests',
    is_featured: true,
    status: 'published',
    view_count: 1250,
    created_at: '2024-09-20 10:30:00',
    updated_at: '2024-09-20 10:30:00',
    related_books: [
      {
        id: 1,
        title: 'The Library Book by Susan Orlean',
        purchase_link: 'https://www.amazon.com/Library-Book-Susan-Orlean/dp/1476740186',
        description: 'A fascinating exploration of libraries and their cultural significance',
        price: '$15.99',
        image: null
      }
    ]
  },
  {
    id: 2,
    title: 'The Art of Storytelling in Modern Literature',
    slug: 'art-storytelling-modern-literature',
    content: '<h2>The Evolution of Narrative</h2><p>Storytelling has evolved significantly in modern literature, with authors experimenting with new forms and techniques...</p><h2>Character Development in the Digital Age</h2><p>Modern authors face unique challenges in developing characters that resonate with contemporary audiences...</p><h2>The Role of Technology in Storytelling</h2><p>Technology has not only changed how we read but also how stories are told...</p>',
    excerpt: 'Exploring how contemporary authors are revolutionizing narrative techniques',
    featured_image: '1758533654_naruto.webp', // First image
    featured_image_2: '1758546897_68036b8b-c597-4903-92fb-0becd3eefb84.png', // Second image for grid layout
    category_id: 1,
    category_name: 'Fiction',
    category_slug: 'fiction',
    category: {
      id: 1,
      name: 'Fiction',
      slug: 'fiction'
    },
    tags: ['storytelling', 'modern literature', 'narrative', 'character development', 'innovation'],
    meta_title: 'The Art of Storytelling in Modern Literature',
    meta_description: 'Exploring how contemporary authors are revolutionizing narrative techniques',
    is_featured: false,
    status: 'published',
    view_count: 892,
    created_at: '2024-09-18 14:15:00',
    updated_at: '2024-09-18 14:15:00',
    related_books: [
      {
        id: 2,
        title: 'The Name of the Rose by Umberto Eco',
        purchase_link: 'https://www.amazon.com/Name-Rose-Umberto-Eco/dp/0544176561',
        description: 'A medieval mystery set in monastery library',
        price: '$16.99',
        image: null
      }
    ]
  }
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  // Handle preflight OPTIONS request
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  console.log(`${method} ${pathname}`);

  // Handle static file serving for uploads
  if (pathname.startsWith('/uploads/')) {
    const filename = pathname.substring(9); // Remove '/uploads/'
    const filePath = path.join(__dirname, 'uploads', filename);
    
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filename).toLowerCase();
      let contentType = 'application/octet-stream';
      
      if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.webp') contentType = 'image/webp';
      else if (ext === '.gif') contentType = 'image/gif';
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      return;
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'File not found' }));
      return;
    }
  }

  // API routes
  if (pathname === '/api/blogs' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      blogs: sampleBlogs,
      total: sampleBlogs.length,
      page: 1,
      limit: sampleBlogs.length,
      total_pages: 1
    }));
    return;
  }

  // Get blog by slug
  const slugMatch = pathname.match(/^\/api\/blogs\/slug\/(.+)$/);
  if (slugMatch && method === 'GET') {
    const slug = decodeURIComponent(slugMatch[1]);
    const blog = sampleBlogs.find(b => b.slug === slug);
    
    if (blog) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ blog }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Blog not found' }));
    }
    return;
  }

  // Get blog by ID
  const idMatch = pathname.match(/^\/api\/blogs\/(\d+)$/);
  if (idMatch && method === 'GET') {
    const id = parseInt(idMatch[1]);
    const blog = sampleBlogs.find(b => b.id === id);
    
    if (blog) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ blog }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Blog not found' }));
    }
    return;
  }

  // Categories endpoint
  if (pathname === '/api/categories' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      categories: [
        { id: 1, name: 'Fiction', slug: 'fiction', blog_count: 2 },
        { id: 2, name: 'History', slug: 'history', blog_count: 0 },
        { id: 3, name: 'Science', slug: 'science', blog_count: 0 }
      ]
    }));
    return;
  }

  // 404 for all other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Route not found' }));
});

server.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  - GET /api/blogs - List all blogs');
  console.log('  - GET /api/blogs/slug/{slug} - Get blog by slug');
  console.log('  - GET /api/blogs/{id} - Get blog by ID');
  console.log('  - GET /api/categories - List categories');
  console.log('  - GET /uploads/{filename} - Serve uploaded files');
  console.log('\\nTest URLs:');
  console.log('  - http://localhost:8000/api/blogs/slug/building-personal-library-complete-guide');
  console.log('  - http://localhost:8000/api/blogs/slug/art-storytelling-modern-literature');
});