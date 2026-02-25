// Simulated API functions

function fetchUserProfile(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = {
        id: userId,
        name: 'Nicole Nigro',
        email: 'nicole@example.com',
        username: 'niclanigro'
      };
      resolve(user);
    }, 1000);
  });
}

function fetchUserPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = [
        { postId: 1, userId: userId, title: 'My First Post', content: 'Hello world!' },
        { postId: 2, userId: userId, title: 'Learning JS', content: 'Promises are cool.' },
        { postId: 3, userId: userId, title: 'Async Fun', content: 'Async/Await rocks!' }
      ];
      resolve(posts);
    }, 1500);
  });
}

function fetchPostComments(postId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 30% chance of failure
      if (Math.random() < 0.3) {
        reject(new Error('Failed to fetch comments'));
        return;
      }
      const comments = [
        { commentId: 1, postId, username: 'Alice', comment: 'Nice post!' },
        { commentId: 2, postId, username: 'Bob', comment: 'Thanks for sharing!' }
      ];
      resolve(comments);
    }, 2000);
  });
}

// Display results in HTML
function displayResults(data) {
  const container = document.getElementById('output');
  container.innerHTML = '';

  if (!data) return;

  const userDiv = document.createElement('div');
  userDiv.innerHTML = `<h2>User: ${data.user.name} (${data.user.username})</h2>
                       <p>Email: ${data.user.email}</p>`;
  container.appendChild(userDiv);

  data.posts.forEach(post => {
    const postDiv = document.createElement('div');
    postDiv.innerHTML = `<h3>${post.title}</h3>
                         <p>${post.content}</p>`;
    if (post.comments) {
      const commentList = document.createElement('ul');
      post.comments.forEach(c => {
        const li = document.createElement('li');
        li.textContent = `${c.username}: ${c.comment}`;
        commentList.appendChild(li);
      });
      postDiv.appendChild(commentList);
    }
    container.appendChild(postDiv);
  });
}

// Sequential Fetch
async function fetchDataSequentially(userId) {
  const startTime = Date.now();
  try {
    const user = await fetchUserProfile(userId);
    console.log('User profile retrieved');

    const posts = await fetchUserPosts(userId);
    console.log('Posts retrieved');

    for (const post of posts) {
      try {
        const comments = await fetchPostComments(post.postId);
        post.comments = comments;
        console.log(`Comments retrieved for post ${post.postId}`);
      } catch (err) {
        console.error(err.message);
        post.comments = [];
      }
    }

    const endTime = Date.now();
    console.log(`Sequential fetch took ${endTime - startTime}ms`);

    displayResults({ user, posts });
  } catch (error) {
    console.error('Error in sequential fetch:', error.message);
  }
}

// Parallel Fetch
async function fetchDataInParallel(userId) {
  const startTime = Date.now();
  try {
    const [user, posts] = await Promise.all([fetchUserProfile(userId), fetchUserPosts(userId)]);
    console.log('User and posts retrieved simultaneously');

    const commentsPromises = posts.map(async post => {
      try {
        const comments = await fetchPostComments(post.postId);
        post.comments = comments;
      } catch (err) {
        console.error(err.message);
        post.comments = [];
      }
    });

    await Promise.all(commentsPromises);

    const endTime = Date.now();
    console.log(`Parallel fetch took ${endTime - startTime}ms`);

    displayResults({ user, posts });
  } catch (error) {
    console.error('Error in parallel fetch:', error.message);
  }
}

// Button event listeners
document.getElementById('sequentialBtn').addEventListener('click', () => {
  fetchDataSequentially(1);
});

document.getElementById('parallelBtn').addEventListener('click', () => {
  fetchDataInParallel(1);
});