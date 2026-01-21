document.addEventListener("DOMContentLoaded", function () {
    const blogListContainer = document.getElementById('blog-list');
    const recentBlogListContainer = document.getElementById('recent-blog-list'); // For Home Page
    const blogPage = window.location.pathname.includes('blog.html');
    const homePage = window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');

    fetch('assets/js/db.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network Response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const blogs = data.Blogs;

            // Sort by date (Newest First)
            blogs.sort((a, b) => new Date(b.Date) - new Date(a.Date));

            if (homePage && recentBlogListContainer) {
                renderBlogs(blogs.slice(0, 3), recentBlogListContainer); // Show top 3
            } else if (blogPage && blogListContainer) {
                renderBlogs(blogs, blogListContainer); // Show all
            }
        })
        .catch(error => {
            console.error('Error Loading Blogs:', error);
            if (blogListContainer) blogListContainer.innerHTML = '<p class="text-center">Failed to load blogs.</p>';
            if (recentBlogListContainer) recentBlogListContainer.innerHTML = '<p class="text-center">Failed to load recent blogs.</p>';
        });

    function renderBlogs(blogs, container) {
        let blogHTML = '';
        blogs.forEach(blog => {
            blogHTML += `
                <div class="col-lg-4 col-md-6 mb-5">
                    <div class="post">
                        <img class="img-fluid" src="${blog.Image}" alt="${blog.Title}" style="width:100%; height:250px; object-fit:cover;">
                        <div class="post_inner p-3">
                            <p class="mb-1 fw-bold">${blog.DisplayDate}</p>
                            <h5 class="fw-bold">${blog.Title}</h5>
                            <p>${blog.Text.substring(0, 100)}...</p>
                            <div class="comment d-flex">
                                <span class="me-3">
                                    <i class="fa fa-user me-3 color-orange"></i>${blog.Author} </span>
                                <span class="me-3">
                                    <i class="fa fa-comments me-3 color-orange"></i>Comments </span>
                            </div>
                            <!--<a class="btn color-orange read-more mt-3" href="${blog.Link}">Read More</a>-->
                        </div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = blogHTML;
    }
});
