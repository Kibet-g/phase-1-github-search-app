// index.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("github-form");
    const userList = document.getElementById("user-list");
    const reposList = document.getElementById("repos-list");
    let currentUser = null;
  
    // Fetch users based on search input
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent form submission
      const searchTerm = document.getElementById("search").value;
  
      if (searchTerm) {
        fetchUsers(searchTerm);
      }
    });
  
    // Fetch users from GitHub API
    function fetchUsers(searchTerm) {
      userList.innerHTML = ''; // Clear previous results
      reposList.innerHTML = ''; // Clear repo list
      fetch(`https://api.github.com/search/users?q=${searchTerm}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
        .then(response => response.json())
        .then(data => {
          if (data.items) {
            data.items.forEach(user => {
              displayUser(user);
            });
          } else {
            userList.innerHTML = '<li>No users found</li>';
          }
        })
        .catch(error => console.error('Error fetching users:', error));
    }
  
    // Display user information
    function displayUser(user) {
      const userItem = document.createElement("li");
      userItem.innerHTML = `
        <img src="${user.avatar_url}" alt="${user.login}" width="50"/>
        <span>${user.login}</span>
        <a href="#" data-username="${user.login}">View Repos</a>
      `;
      userItem.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault();
        currentUser = user.login; // Store current user for repo fetching
        fetchUserRepos(currentUser);
      });
      userList.appendChild(userItem);
    }
  
    // Fetch user repositories
    function fetchUserRepos(username) {
      reposList.innerHTML = ''; // Clear previous repos
      fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
        .then(response => response.json())
        .then(data => {
          data.forEach(repo => {
            displayRepo(repo);
          });
        })
        .catch(error => console.error('Error fetching repos:', error));
    }
  
    // Display repository information
    function displayRepo(repo) {
      const repoItem = document.createElement("li");
      repoItem.innerHTML = `
        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        <span> - Stars: ${repo.stargazers_count}</span>
      `;
      reposList.appendChild(repoItem);
    }
  });
  