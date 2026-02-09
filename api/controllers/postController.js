import { errorHandler } from "../utils/errorHandler.js"
import Post from '../models/postModel.js'

export const create = async (req, res, next)=>{
    //'isAdmin' was used along with 'id' to create 'token' and checked that token in verifyUser.js and add it into the req as userData
    if(!req.userData.isAdmin){
        return next(errorHandler(403, 'You are not authorized!'))
    }

    if(!req.body.title || !req.body.content){
        return next(errorHandler(400, 'All fields must be filled!'))
    }

    //it is better to create a slug for seo
    //https://www.example.com/blog/how-to-make-a-website, the slug is how-to-make-a-website
    //split with space, join with '-' and replace any char that is not alphanumerical with '-'
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')

    const createdPost = new Post({
        ...req.body,
        slug,
        userId: req.userData.id
    })

    try {
        const savedPost = await createdPost.save();
        res.status(200).json(savedPost)
    } catch (error) {
        console.error("Error saving a post at postController.js", error)
        next(errorHandler(400, "Error saving post!"))   
    }
}

export const fetch = async(req, res, next)=>{

    try {
        //from which index to show posts, users can specify which index to start otherwise start from 0
        //eg: /api/post/fetch?startIndex=8, then posts form index 8 and above will be fetched
        const startIndex = parseInt(req.query.startIndex) || 0
        //how many to fetch at once
        //eg: /api/post/fetch?limit=3, then only 3 will be fetched. if not explicitely mentioned only 9 will fetched
        const limit = parseInt(req.query.limit) || 9;
        //if order=asc, fetch in ascending order (1) otherwise in descending order(-1)
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        const fetchedPosts = await Post.find({ //fetch with conditions, based on the query
            //if query has userId, set userId to req.query.userId and fetch from that specific userId(which is set on /create)
            ...(req.query.userId && {userId: req.query.userId}),
            //is category explicitely mentioned in the query
            ...(req.query.category && {category: req.query.category}),
            ...(req.query.slug && {category: req.query.slug}),
            ...(req.query.postId && {_id: req.query.postId}),
            //if searchTerm is in the query for searching
            ...(req.query.searchTerm && {
                //$or: [], will check for both title and content to find the searchTerm
                $or: [
                    //$regex: will search the specific word/searchTerm in the title and content
                    //$options: 'i', makes the regex search case insensitive
                    {title: {$regex: req.query.searchTerm, $options: 'i'}},
                    {content: {$regex: req.query.searchTerm, $options: 'i'}}
                ]
            })
        }).sort({updatedAt: sortDirection}).skip(startIndex).limit(limit);

        const totalPosts = await Post.countDocuments();

        //for checking how many posts were made 1 month ago
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() -1,
            now.getDate()
        )

        const lastMonthPosts = await Post.countDocuments({
            //$gte: , refers to greater than or equal to and $lte, refers to lass than or equal to
            createdAt: {$gte: oneMonthAgo},
        })

        res.status(200).json({fetchedPosts, totalPosts, lastMonthPosts})
    } catch (error) {
        // next(errorHandler(400, 'Error fetching user posts!'))
        next(error)
    }
}