$(document).ready(()=>{
    $.get('posts', {postedBy: profileUserId, isReply: false}, results => {
        outputPosts(results, $('.postsContainer'))
    })
})