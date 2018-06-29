const marked = require('marked');
const Post = require('../lib/mongoose').Post;
const CommentModel = require('./comments');
const ObjectId = require('mongodb').ObjectID

// 将 post 的 content 从 markdown 转换成 html
// Post.plugin('contentToHtml', {
//     afterFind: function (posts) {
//         return posts.map(function (post) {
//             post.content = marked(post.content);
//             return post;
//         })
//     },
//     afterFindOne: function (post) {
//         if (post) {
//             post.content = marked(post.content);
//         }
//         return post;
//     }
// });

// // 给 post 添加留言数 commentsCount
// Post.plugin('addCommentsCount', {
//     afterFind: function (posts) {
//         return Promise.all(posts.map(function (post) {
//             return CommentModel.getCommentsCount(post._id)
//                 .then(function (commentsCount) {
//                     post.commentsCount = commentsCount;
//                     return post;
//                 })
//         }))
//     },

//     afterFindOne: function (post) {
//         if (post) {
//             return CommentModel.getCommentsCount(post._id)
//                 .then(function (commentsCount) {
//                     post.commentsCount = commentsCount;
//                     return post;
//                 })
//         }
//         return post;
//     },
// });

module.exports = {
    // 创建一篇文章
    create: function (post) {
        return new Promise(function (resolve) {
            Post.create(post, function (err, result) {
                if (err) return handleError(err);
                // console.log(result);
                resolve(result);
            })
        });
        // return Post.create(post).exec();
    },

    // 通过文章 id 获取一篇文章
    getPostById: function getPostById(postId) {
        return Post
            .findOne({ _id: postId })
            .populate({ path: 'author', model: 'User' })
            // .addCreatedAt()
            // .addCommentsCount()
            // .contentToHtml()
            .exec()
    },

    // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
    getPosts: function getPosts(author) {
        const query = {}
        if (author) {
            query.author = author
        }
        return Post
            .find(query)
            .populate({ path: 'author', model: 'User' })
            .sort({ _id: -1 })
            // .addCreatedAt()
            // .addCommentsCount()
            // .contentToHtml()
            .exec()
    },

    //获取所有文章数量
    getPostsCount: function () {
        return Post
            .count()
            .exec();
    },

    //分页获取文章
    getPagingPosts: function (page, pageSize = 5) {
        let skipNum = (page - 1) * pageSize;

        return Post
            .find()
            .skip(skipNum)
            .limit(pageSize)
            .populate({ path: 'author', model: 'User' })
            .sort({ _id: -1 })
            // .addCommentsCount()
            // .contentToHtml()
            .exec();
    },

    // 通过文章 id 给 pv 加 1
    incPv: function incPv(postId) {
        return Post
            .update({ _id: postId }, { $inc: { pv: 1 } })
            .exec()
    },

    // 通过文章 id 获取一篇原生文章（编辑文章）
    getRawPostById: function getRawPostById(postId) {
        return Post
            .findOne({ _id: postId })
            .populate({ path: 'author', model: 'User' })
            .exec()
    },

    // 通过文章 id 更新一篇文章
    updatePostById: function updatePostById(postId, data) {
        return Post
            .update({ _id: postId }, { $set: data })
            .exec()
    },

    // 通过用户 id 和文章 id 删除一篇文章
    delPostById: function delPostById(postId, author) {
        return Post
            .deleteOne({ _id: postId, author: author })
            .exec()
            .then(function (value) {
                // 文章删除后，再删除该文章下的所有留言
                if (res.result.ok && res.result.n > 0) {
                    return CommentModel.delCommentsByPostId(postId);
                }
            })
    }
}