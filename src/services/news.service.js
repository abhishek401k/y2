import News from '../models/News.js'
export const createService = (body) => News.create(body)
export const findAllService = (limit, offset) => News.find().sort({
    _id: -1
}).skip(offset).limit(limit).populate("user")
export const countNews = () => News.countDocuments()
export const topNewsService = () => News.findOne().sort({
    _id: -1
}).populate("user")
export const findByIdService = (id) => News.findById(id).populate("user")
export const searchByTitleService = (title) => News.find({
    title: {
        $regex: '${title || ""}',
        $options: "i"
    },
}).sort({
    _id: -1
}).populate("user")
export const byUserService = (id) => News.find({
    user: id
}).sort({
    _id: -1
}).populate("user")
export const updateService = (id, title, text) => News.findOneAndUpdate({
    _id: id
}, {
    title: title,
    text: text
}, {
    rowResult: true
})
export const eraseService = (id) => News.findByIdAndDelete({
    _id: id
})
export const likeNewsService = (idNews, userId) => News.findOneAndUpdate(
	{ _id: idNews, "likes.userId": { $nin: [userId] } }, 
	{ $push: { likes: { userId, createdAt: new Date() } } }
)

export const deliteLikeNewsService = (idNews, userId) => News.findOneAndUpdate(
	{ _id: idNews }, 
	{ $pull: { likes: { userId } } }
)

export const addCommentService = (idNews, comment, userId) => {
	const idComment = Math.floor(Date.now() * Math.random()).toString(36)

	return News.findOneAndUpdate(
		{ _id: idNews },
		{
			$push: {
				comments: { idComment, userId, comment, crestedAt: new Date() }
			}
		}
	)
}

export const deleteCommentService = (idNews, idComment, userId) => News.findOneAndUpdate(
	{ _id: idNews },
	{ $pull: { comments: { idComment, userId } } }
)