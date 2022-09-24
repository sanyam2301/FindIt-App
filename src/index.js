const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#searchInput');
//form search Form
searchForm.addEventListener('submit', (e) => {
    // getSearch term
    const searchTerm = searchInput.value;
    const sortBy = document.querySelector('input[name="sortby"]:checked').value;
    const limit = document.querySelector('#limit').value;
    // console.log(sortBy);

    //check input
    if (searchTerm === '') {
        //show message
        showMessage('Please add a search Term', 'alert-danger');
    }
    searchInput.value = '';

    //search Reddit api
    searchReddit(searchTerm, sortBy, limit).then(results => {
        console.log(results);
        let output = "div class='card-table'>";
        //loop through the posts
        results.forEach(post => {
            const image = post.preview ? post.preview.images[0].source.url : 'https://variety.com/wp-content/uploads/2020/06/reddit-logo-1.png?w=640'
            output += `
            <div class="card center" style="width:85rem;">
  <img src="${image}" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${post.title}</h5>
    <p class="card-text">${truncateString(post.selftext,200)}</p>
    <a href="${post.url}" target='_blank' class="btn btn-primary">Read More</a>
    
    <span class='badge bg-secondary'>Subreddit: ${post.subreddit}</span>
    <span class='badge bg-dark'>Score${post.score}</span>
  </div>
</div>`
        });

        output += '</div>';
        document.getElementById('results').innerHTML = output;
    })

    e.preventDefault();
})


function showMessage(message, className) {
    //create div
    const div = document.createElement('div');
    //add classes
    div.className = `alert ${className}`;
    //add text
    // div.textContent = `${message}` or
    div.appendChild(document.createTextNode(message));
    //get parent container and then put it there
    const searchContainer = document.getElementById('search-container');
    const search = document.getElementById('search');
    searchContainer.insertBefore(div, search);

    setTimeout(() => {
        document.querySelector('.alert').remove();
    }, 3000);

}


function searchReddit(searchTerm, sortBy, limit) {
    return fetch(`http://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${limit}`)
        .then(res => res.json())
        .then(data => data.data.children.map(dataItem => dataItem.data))
        .catch(err => console.log(err))

}


function truncateString(myString, limit) {
    const shortened = myString.indexOf(' ', limit);
    if (shortened == -1) return myString;
    return myString.substring(0, shortened);
}