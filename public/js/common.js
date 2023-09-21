$("#postTextArea").keyup(event => {
    const textbox = $(event.target);
    const value = textbox.val().trim();
    const submitButton = $("#submitPostButton");
    if (submitButton.length == 0) return alert("No submit button found");
    if (value == "") {
        submitButton.prop("disabled", true);
        return;
    }

    submitButton.prop("disabled", false);
});

$("#replyTextArea").keyup(event => {
    const textbox = $(event.target);
    const value = textbox.val().trim();
    const submitButton =$("#submitReplyButton");
    if (submitButton.length == 0) return alert("No submit button found");
    if (value == "") {
        submitButton.prop("disabled", true);
        return;
    }

    submitButton.prop("disabled", false);
});

$("#submitPostButton").click((event) => {
    const button = $(event.currentTarget);
    const textbox = $("#postTextArea");

    const data = {
        content: textbox.val()
    }

    $.post("/api/v1/posts", data, postData => {
        console.log(postData);
        const html = createPostHtml(postData);
        $(".postsContainer").prepend(html);
        textbox.val("");
        button.prop("disabled", true);
    })
});

$("#submitReplyButton").click((event) => {
    const button = $(event.currentTarget);
    const textbox = $("#replyTextArea");

    const data = {
        content: textbox.val()
    }

    const id = button.data().id;
    if (id === undefined) return alert("Button id is undefined");
    data.replyTo = id;

    $.post("/api/v1/posts", data, postData => {
        if(postData.replyTo !== undefined) {
            location.reload();
        } else {
            const html = createPostHtml(postData);
            $(".postsContainer").prepend(html);
            textbox.val("");
            button.prop("disabled", true);
        }
    })
});

$("#replyModal").on("show.bs.modal", (event) => {
    const button = $(event.relatedTarget);
    const postId = getPostIdFromElement(button);
    $('#submitReplyButton').data('id', postId);
    $.get(`/api/v1/posts/${postId}`, results => {
        outputPosts(results.postData, $("#originalPostContainer"));
    })
});


$("#deletePostModal").on("show.bs.modal", (event) => {
    const button = $(event.relatedTarget);
    const postId = getPostIdFromElement(button);
    $('#submitDeletePostButton').data('id', postId);
});

$("#submitDeletePostButton").click((event) => {
    const postId = $(event.currentTarget).data("id");
    $.ajax({
        url: `/api/v1/posts/${postId}`,
        type: "DELETE",
    }).then(() => {
        location.reload();
    })
});

$("#replyModal").on("hidden.bs.modal", (event) => {
    $("#originalPostContainer").html("");
});

$(document).on('click', '.displayName', event => {
    const element = $(event.target);
    const username = element.data().username;
    console.log(username)
    if(username !== undefined && !element.is('button')) {
        window.location.href = `api/v1/profile/${username}`;
    }
})

$(document).on("click", ".likeButton", async (event) => {
    const button = $(event.target);
    const postId = getPostIdFromElement(button);

    if (postId === undefined) return;
    await $.ajax({
        url: `/api/v1/posts/${postId}/like`,
        type: "PUT",
        success: (postData) => {
            button.find("span").text(postData.likes.length || "");
            if (postData.likes.includes(userLoggedIn._id)) {
                button.addClass("active");
            }
            else {
                button.removeClass("active");
            }
        }
    })
});
$(document).on('click', '.post', event => {
    const element = $(event.target);
    const postId = getPostIdFromElement(element);
    if(postId!==undefined && !element.is('button') && !element.is('a') && !element.is('span')) {
        window.location.href = `/api/v1/post/${postId}`;
    }
})
$(document).on("click", ".retweet", async (event) => {
    const button = $(event.target);
    const postId = getPostIdFromElement(button);

    if (postId === undefined) return;
    await $.ajax({
        url: `/api/v1/posts/${postId}/retweet`,
        type: "POST",
        success: (postData) => {
            button.find("span").text(postData.retweetUsers.length || "");
            if (postData.retweetUsers.includes(userLoggedIn._id)) {
                button.addClass("active");
            }
            else {
                button.removeClass("active");
            }
        }
    })
});



function getPostIdFromElement(element) {
    const isRoot = element.hasClass("post");
    const rootElement = isRoot == true ? element : element.closest(".post");
    const postId = rootElement.data().id;
    return postId;
}
function createPostHtml(postData, largeFont = false) {
    if(postData == null) return console.log("Post object is null");
    const isRetweet = postData.retweetData !== undefined;
    const retweetedBy = isRetweet ? postData.postedBy.username : null;
    postData = isRetweet ? postData.retweetData : postData;
    const name = postData.postedBy.firstName + " " + postData.postedBy.lastName;
    const userName = postData.postedBy.username;
    const timestamp = timeDifference(new Date(), new Date(postData.createdAt));
    const isLike = postData.likes.includes(userLoggedIn._id) ? "active" : "";
    const isTweet = postData.retweetUsers.includes(userLoggedIn._id) ? "active" : "";
    const largeFontClass = largeFont ? "largeFont" : "";
    let retweetText = "";
    if (isRetweet) {
        retweetText = `<span>
        <i class='fas fa-retweet'></i>
        Retweeted by <a href='/profile/${retweetedBy}'>@${retweetedBy}</a>
        </span>`;
    }
    let replyFlag = "";
    if (postData.replyTo && postData.replyTo._id) {
        if (!postData.replyTo._id) {
            return alert("Reply to is not populated");
        }
        else if (!postData.replyTo.postedBy) {
            return alert("Posted by is not populated");
        }

        const replyToUsername = postData.replyTo.postedBy.firstName;
        replyFlag = `<div class='replyFlag'>
                        Replying to <a href='/profile/${replyToUsername}'>@${replyToUsername}</a>
                    </div>`;
    }

    let button = "";
    if (postData.postedBy._id == userLoggedIn._id){
        button = `<button class='deleteButton' data-id='${postData._id}' data-bs-toggle='modal' data-bs-target='#deletePostModal'>
                    <i class='fas fa-times'></i>
                </button>`;
    }

    return `<div class='post ${largeFontClass}' data-id='${postData._id}'>
                <div class='postActionContainer'>
                    ${retweetText}
                </div>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postData.postedBy.profilePic}'>
                    </div>
                        <div class='postContentContainer'>
                            <div class='header'>
                                <a class="displayName toProfile" data-username=${userName}>${name}</a>
                                <span class='username toProfile' data-username=${userName}>@${userName}</span>
                                <span class='date'>${timestamp}</span>
                                ${button}
                            </div>
                            ${replyFlag}
                            <div class='postBody'>
                                <span>${postData.content}</span>
                            </div>
                            <div class='postFooter'>
                                <div class='postButtonContainer'>
                                    <button data-bs-toggle='modal' data-bs-target='#replyModal'>
                                        <i class='far fa-comment'></i>
                                    </button>
                                </div>
                                <div class='postButtonContainer green'>
                                    <button class='retweet ${isTweet}'>
                                        <i class='fas fa-retweet'></i>
                                        <span>${postData.retweetUsers.length > 0 ? postData.retweetUsers.length : ""}</span>
                                    </button>
                                </div>
                                <div class='postButtonContainer red'>
                                    <button class='likeButton ${isLike}'>
                                        <i class='far fa-heart'></i>
                                        <span>${postData.likes.length > 0 ? postData.likes.length : ""}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                </div>
            </div>`;
}

function timeDifference(current, previous) {

    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if (elapsed / 1000 < 30) return "Just now";
        return Math.round(elapsed / 1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    }

    else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
}


const outputPosts = (results, container) => {
    container.html("");
    if(!Array.isArray(results)) {
        results = [results];
    }
    results.forEach(result => {
        const html = createPostHtml(result);
        container.append(html);
    });

    if(results.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>")
    }
}

function outputPostsWithReplies(results, container) {
    container.html("");
    if(results.replyTo && results.replyTo._id) {
        const html = createPostHtml(results.replyTo, false);
        container.append(html);
    }
    const mainPostHtml = createPostHtml(results.postData, true);
    container.append(mainPostHtml);
    results.replies.forEach(result => {
        const html = createPostHtml(result);
        container.append(html);
    });
    
}