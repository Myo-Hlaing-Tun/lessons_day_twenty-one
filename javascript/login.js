// selecting the login button in navbar
const button = document.getElementById("button");
// selecting the login form
const form = document.getElementById('form');
// clicking the login button will display login information and login form
button.onclick = function(e){
    form.style.display = "block";
    document.querySelector("#posts").style.display = "none";
}

// submiting the form will save user's datas in local storage and will allow logging in for correct username and password
form.onsubmit = function(e){
    e.preventDefault();
    let found = false;
    if(localStorage.getItem("Shwebook-js")){
        let data = JSON.parse(localStorage.getItem("Shwebook-js"));
        data.map((item)=>{
            if(form.username.value === item.email && form.password.value === item.password){
            localStorage.setItem("Login-user",item.username);
            found = true;
        }})
    }
    else{
        alert("There is no Registered Account")
    }
    if(found){
        window.location.href = "posts.html";
    }
    if(!found){
        alert("wrong username or password")
    }
}

// fetching datas from local json file
let result;
const getPosts = async () => {
    const data = await fetch("./javascript/data.json");
    let data1 = await data.json();

    // if localStorage has post-datas, datas will be received via localstorage
    // if not, datas will be received via fetched data
    if(localStorage.getItem("posts-data-update")){
        result = JSON.parse(localStorage.getItem("posts-data-update"));
        result = result["result"];
    }
    else{
        result = data1;
    }

     // sorting the posts according to posted time
    result.sort((a,b)=>{
        return new Date(b["created_at"]) - new Date(a["created_at"]);
    })

    // choosing the most recently posted 20 posts
    let display = result.slice(0,20);
    let posts = document.getElementById("posts");

    // to calculate hours ago or minutes ago or days ago
    for(let item of display){
        let postTime = new Date(item["created_at"]);
        let present = new Date();

        // (1000*60*30*13) means 6:30 hour and i will correct GMT time as Myanmar is GMT+6:30
        let difference = present.getTime() - postTime.getTime() + (1000*60*30*13);
        // converting into minutes, hours and days
        let minutes = Math.floor(difference/60000);
        let hours = Math.floor(difference/(60*60*1000));
        let days = Math.floor(difference/(24*60*60*1000));
        let showTime;
        /* 2592000000 means 30 days if posts are created more than 30 days ago it will show post-time
        if posts are within 30 days the posts will show 5days ago, 10hours ago, 15minutes ago etc */
        if(difference >= 2592000000){
            showTime = `${item["created_at"].match(/^[\d]{4}-[\d]{2}-[\d]{2}/g)}`;
        }

        while(difference < 2592000000) {
            if (days) {
                // if difference is 1 day it should be 1day ago. if not, it should be 3days ago etc
                days = days == 1 ? "1 day": `${days} days`;
                showTime = days + " ago";
                break;
            }
            else if (hours) {
                hours = hours == 1 ? "1 hour": `${hours} hours`;
                showTime = hours + " ago";
                break;
            }
            else if (minutes) {
                minutes = minutes == 1 ? "1 minute": `${minutes} minutes`;
                showTime = minutes + " ago";
                break;
            }
            else {
                showTime = "A moment ago";
                break;
            }
        }

        // to display the posts
        posts.innerHTML += `<div class="single-post">
            <span>
                <p class="user">${item["created_by"]}</p>
                <p class="time">${showTime}</p>
            </span>
            <p class="content">${item["content"]}
            <figure>
                <img src="javascript/newimage.webp" alt="sample photo">
            </figure>
        </div>`
    }
};
getPosts();