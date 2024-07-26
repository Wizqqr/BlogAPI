document.addEventListener('DOMContentLoaded', () => {
    const posts = document.querySelectorAll('#postsList li');

    posts.forEach((post, index) => {
      post.style.opacity = 0;
      post.style.transform = 'translateY(20px)';
      setTimeout(() => {
        post.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        post.style.opacity = 1;
        post.style.transform = 'translateY(0)';
      }, index * 100); 
    });

    const deleteLinks = document.querySelectorAll('.delete');
      deleteLinks.forEach(link => {
        link.addEventListener('click', async (event) => {
          event.preventDefault();
          const postId = link.getAttribute('data-id');
          try {
            const response = await axios.delete(`/api/posts/delete/${postId}`);
            if (response.status === 200) {
              const postElement = document.querySelector(`li[data-id="${postId}"]`);
              postElement.remove();
            } else {
              alert('Failed to delete post');
            }
          } catch (error) {
            console.error('There was an error deleting the post!', error);
            alert('An error occurred while deleting the post');
          }
        });
      });
    });
  