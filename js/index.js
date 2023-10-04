document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const userRepos = document.getElementById('user-repos');

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();

        if (searchTerm !== '') {
            searchGitHubUsers(searchTerm);
        }
    });

    function searchGitHubUsers(query) {
        const apiUrl = `https://api.github.com/search/users?q=${query}`;
        
        fetch(apiUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => response.json())
        .then(data => {
            displayUsers(data.items);
        })
        .catch(error => {
            console.error('Error fetching GitHub users:', error);
        });
    }

    function displayUsers(users) {
        userList.innerHTML = '';

        users.forEach(user => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            userItem.innerHTML = `
                <img src="${user.avatar_url}" alt="${user.login}" />
                <h3>${user.login}</h3>
                <a href="${user.html_url}" target="_blank">View Profile</a>
            `;

            userItem.addEventListener('click', () => {
                getUserRepos(user.login);
            });

            userList.appendChild(userItem);
        });
    }

    function getUserRepos(username) {
        const apiUrl = `https://api.github.com/users/${username}/repos`;

        fetch(apiUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => response.json())
        .then(data => {
            displayUserRepos(data);
        })
        .catch(error => {
            console.error('Error fetching user repositories:', error);
        });
    }

    function displayUserRepos(repos) {
        userRepos.innerHTML = '';

        if (repos.length === 0) {
            userRepos.innerHTML = '<p>No repositories found.</p>';
        } else {
            repos.forEach(repo => {
                const repoItem = document.createElement('div');
                repoItem.className = 'repo-item';
                repoItem.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description available'}</p>
                    <a href="${repo.html_url}" target="_blank">View Repository</a>
                `;

                userRepos.appendChild(repoItem);
            });
        }
    }
});
