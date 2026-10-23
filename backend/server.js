
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let products = [
    {
        id: 1,
        title: "Learn React",
        slug: "learn-react",
        description: "React basics",
        content: "React is a JavaScript library.",
        author: "Dildar",
        category: "Frontend"
    },
    {
        id: 2,
        title: "Learn Node.js",
        slug: "learn-nodejs",
        description: "Node.js basics",
        content: "Node.js runs JavaScript outside the browser.",
        author: "Dildar",
        category: "Backend"
    }
];

const auth = (req, res, next) => {
    const token = req.headers.authorization;

    if (token === "Bearer mytoken123") {
        return next();
    }

    return res.status(401).json({
        message: "Unauthorized"
    });
};

// POST: Add blog from Postman
app.post("/Adddata", auth, (req, res) => {
    const newProduct = {
        id: Date.now(),
        title: req.body.title,
        slug: req.body.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
        description: req.body.description,
        content: req.body.content,
        author: req.body.author,
        category: req.body.category
    };

    products.push(newProduct);

    res.status(201).json({
        message: "Blog added successfully",
        data: newProduct
    });
});

// GET: All blogs with pagination
app.get("/api/posts", (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;

    const start = (page - 1) * limit;

    res.json({
        data: products.slice(start, start + limit),
        currentPage: page,
        totalPages: Math.ceil(products.length / limit),
        totalPosts: products.length
    });
});

// GET: Single blog by slug
app.get("/api/posts/:slug", (req, res) => {
    const post = products.find(
        p => p.slug === req.params.slug
    );

    if (!post) {
        return res.status(404).json({
            message: "Blog not found"
        });
    }

    res.json(post);
});

// GET: All products
app.get("/products", (req, res) => {
    res.status(200).json(products);
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
