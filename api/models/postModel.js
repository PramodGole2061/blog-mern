import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'https://img.freepik.com/premium-vector/blog-post-concept-illustration_114360-26355.jpg'
    },
    category: {
        type: String,
        default: 'uncategorized'
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
}, {timestamps: true})

const Post = mongoose.model('Post', postSchema)

export default Post;