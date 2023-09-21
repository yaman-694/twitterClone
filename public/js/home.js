$(document).ready(()=>{
    $.get("/api/v1/posts", results => {
        outputPosts(results, $(".postsContainer"));
    })
})