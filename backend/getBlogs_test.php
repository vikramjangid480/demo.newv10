<?php
// Test version of getBlogs.php for when database is not available
// This provides sample data for testing the BlogDetails page

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            // Get single blog by ID
            getBlogById($_GET['id']);
        } elseif (isset($_GET['slug'])) {
            // Get single blog by slug
            getBlogBySlug($_GET['slug']);
        } else {
            // Get all blogs with filters
            getAllBlogs();
        }
        break;
    
    default:
        sendResponse(['error' => 'Method not allowed'], 405);
}

function getAllBlogs() {
    $blogs = getSampleBlogs();
    
    sendResponse([
        'blogs' => $blogs,
        'total' => count($blogs),
        'page' => 1,
        'limit' => count($blogs),
        'total_pages' => 1
    ]);
}

function getBlogById($id) {
    $blogs = getSampleBlogs();
    
    foreach ($blogs as $blog) {
        if ($blog['id'] == $id) {
            $blog['related_books'] = getSampleRelatedBooks();
            sendResponse(['blog' => $blog]);
            return;
        }
    }
    
    sendResponse(['error' => 'Blog not found'], 404);
}

function getBlogBySlug($slug) {
    $blogs = getSampleBlogs();
    
    foreach ($blogs as $blog) {
        if ($blog['slug'] === $slug) {
            $blog['related_books'] = getSampleRelatedBooks();
            sendResponse(['blog' => $blog]);
            return;
        }
    }
    
    sendResponse(['error' => 'Blog not found'], 404);
}

function getSampleBlogs() {
    return [
        [
            'id' => 1,
            'title' => 'Building Your Personal Library: A Complete Guide',
            'slug' => 'building-personal-library-complete-guide',
            'content' => '<h2>Introduction</h2><p>Building a personal library is more than just collecting books—it\'s about creating a curated space that reflects your interests, values, and intellectual journey...</p><h2>Choosing Your Focus</h2><p>The first step in building your personal library is determining what genres and topics resonate with you most...</p><h2>Quality Over Quantity</h2><p>While it might be tempting to fill your shelves with as many books as possible, focusing on quality selections will serve you better in the long run...</p>',
            'excerpt' => 'Essential tips for curating a collection that reflects your personality and interests',
            'featured_image' => 'sample1.jpg', // Sample image that would be in uploads folder
            'featured_image_2' => null, // Only one image for this blog
            'category_id' => 1,
            'category_name' => 'Fiction',
            'category_slug' => 'fiction',
            'category' => [
                'id' => 1,
                'name' => 'Fiction',
                'slug' => 'fiction'
            ],
            'tags' => ['library', 'books', 'reading', 'collection', 'personal development'],
            'meta_title' => 'Building Your Personal Library: A Complete Guide',
            'meta_description' => 'Essential tips for curating a collection that reflects your personality and interests',
            'is_featured' => true,
            'status' => 'published',
            'view_count' => 1250,
            'created_at' => '2024-09-20 10:30:00',
            'updated_at' => '2024-09-20 10:30:00'
        ],
        [
            'id' => 2,
            'title' => 'The Art of Storytelling in Modern Literature',
            'slug' => 'art-storytelling-modern-literature',
            'content' => '<h2>The Evolution of Narrative</h2><p>Storytelling has evolved significantly in modern literature, with authors experimenting with new forms and techniques...</p><h2>Character Development in the Digital Age</h2><p>Modern authors face unique challenges in developing characters that resonate with contemporary audiences...</p><h2>The Role of Technology in Storytelling</h2><p>Technology has not only changed how we read but also how stories are told...</p>',
            'excerpt' => 'Exploring how contemporary authors are revolutionizing narrative techniques',
            'featured_image' => 'sample2.jpg', // First image
            'featured_image_2' => 'sample2b.jpg', // Second image for grid layout
            'category_id' => 1,
            'category_name' => 'Fiction',
            'category_slug' => 'fiction',
            'category' => [
                'id' => 1,
                'name' => 'Fiction',
                'slug' => 'fiction'
            ],
            'tags' => ['storytelling', 'modern literature', 'narrative', 'character development', 'innovation'],
            'meta_title' => 'The Art of Storytelling in Modern Literature',
            'meta_description' => 'Exploring how contemporary authors are revolutionizing narrative techniques',
            'is_featured' => false,
            'status' => 'published',
            'view_count' => 892,
            'created_at' => '2024-09-18 14:15:00',
            'updated_at' => '2024-09-18 14:15:00'
        ]
    ];
}

function getSampleRelatedBooks() {
    return [
        [
            'id' => 1,
            'title' => 'The Library Book by Susan Orlean',
            'purchase_link' => 'https://www.amazon.com/Library-Book-Susan-Orlean/dp/1476740186',
            'description' => 'A fascinating exploration of libraries and their cultural significance',
            'price' => '$15.99',
            'image' => null // No image for this book
        ],
        [
            'id' => 2,
            'title' => 'The Name of the Rose by Umberto Eco',
            'purchase_link' => 'https://www.amazon.com/Name-Rose-Umberto-Eco/dp/0544176561',
            'description' => 'A medieval mystery set in a monastery library',
            'price' => '$16.99',
            'image' => null
        ]
    ];
}

function sendResponse($data, $status_code = 200) {
    header('Content-Type: application/json');
    http_response_code($status_code);
    echo json_encode($data);
    exit();
}
?>