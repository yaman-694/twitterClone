$(document).ready(()=>{
    console.log("hello", postId)
    $.get("/api/v1/posts/"+postId, results => {
        outputPostsWithReplies(results, $(".postsContainer"));
    })
})

