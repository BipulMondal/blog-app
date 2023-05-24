 // Fetch blogs from the API
 async function fetchBlogs() {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
     return await response.json();
  }

  // Render blogs on the UI
  function renderBlogs(blogs) {
    const blogsContainer = document.getElementById('blogs-container');
    blogsContainer.innerHTML = '';

    blogs.forEach(blog => {
      const blogCard = document.createElement('div');
      blogCard.classList.add('blog-card');
      blogCard.innerHTML = `
        <h3>${blog.title}</h3>
        <p>${blog.body}</p>
        <button class="delete-blog-button" data-id="${blog.id}">Delete</button>
      `;
      blogsContainer.appendChild(blogCard);
    });
  }

  // Add a new blog
  function addBlog(event) {
    event.preventDefault();

    const titleInput = document.getElementById('title');
    const bodyInput = document.getElementById('body');
    const errorMessage = document.getElementById('error-message');

    // Validate inputs
    if (titleInput.value.trim() === '' || bodyInput.value.trim() === '') {
      errorMessage.textContent = 'Please fill in all fields.';
      return;
    }

    // Create new blog object
    const newBlog = {
      title: titleInput.value.trim(),
      body: bodyInput.value.trim()
    };

    // Save new blog to the API
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify(newBlog),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(() => {
        // Clear form inputs
        titleInput.value = '';
        bodyInput.value = '';
        errorMessage.textContent = '';

        // Refresh blogs
        fetchBlogs()
          .then(blogs => renderBlogs(blogs));
      })
      .catch(error => console.error(error));
  }

  // Delete a blog
  function deleteBlog(event) {
    const deleteButton = event.target;
    const blogId = deleteButton.getAttribute('data-id');

    // Delete blog from the API
    fetch(`https://jsonplaceholder.typicode.com/posts/${blogId}`, {
      method: 'DELETE'
    })
      .then(() => {
        // Refresh blogs
        fetchBlogs()
          .then(blogs => renderBlogs(blogs));
      })
      .catch(error => console.error(error));
  }

  // Event listeners
  document.getElementById('new-blog-form').addEventListener('submit', addBlog);
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-blog-button')) {
      deleteBlog(event);
    }
  });

  // Initial setup
  fetchBlogs()
    .then(blogs => renderBlogs(blogs))
    .catch(error => console.error(error));