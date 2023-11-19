// to select the Logout button on the top right corner
const button = document.getElementById('button');
button.onclick = function(){
    window.location.href = "index.html";
}

// result = to store all the details about the posts, display = to store details of 20 most-recent posts
let result;
let display;

const getPosts = async () => {
    let data = await fetch("./javascript/data.json");
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
    function sorting(array){
        array.sort((a,b)=>{
            return new Date(b["created_at"]) - new Date(a["created_at"]);
        });
    }
    sorting(result);
    // choosing the most recently posted 20 posts
    display = result.slice(0,20);
    
    // selecting the div container which will show posts
    let posts = document.getElementById("posts");

    function showing(array){
        for(let item of array){
            // to calculate hours ago or minutes ago or days ago
            let postTime = new Date(item["created_at"]);
            let present = new Date();
            // (1000*60*30*13) means 6:30 hour and i will correct GMT time as Myanmar is GMT+6:30
            let difference = (present.getTime() - postTime.getTime())+ (1000*60*30*13);
             // converting into minutes, hours and days
            let minutes = Math.floor(difference/60000);
            let hours = Math.floor(difference/(60*60*1000));
            let days = Math.floor(difference/(24*60*60*1000));
            let showTime;
            /* 2592000000 means 30 days if posts are created more than 30 days ago it will show post-date
            if posts are within 30 days the posts will show 5days ago, 10hours ago, 15minutes ago etc */
            if(difference >= 2592000000){
                showTime = `${item["created_at"].match(/^[\d]{4}-[\d]{2}-[\d]{2}/g)}`;
            }
    
            while(difference < 2592000000) {
                if (days > 0) {
                    // if difference is 1 day it should be 1day ago. if not, it should be 3days ago etc
                    days = days == 1 ? "1 day": `${days} days`;
                    showTime = days + " ago";
                    break;
                }
                else if (hours > 0) {
                    hours = hours == 1 ? "1 hour": `${hours} hours`;
                    showTime = hours + " ago";
                    break;
                }
                else if (minutes > 0) {
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
                <button class="modify">See Details</button>
            </div>`
        }
    }
    showing(display);

    /* detail = select the details button in every post, form = select the post-edit, new-post form
    info = select the div which will show post details */
    let detail = document.querySelectorAll("button.modify");
    let form = document.getElementById("form");
    let info = document.getElementById('details');

    // the rerun will be called giving the argument "detail" so that detail array will be looped
    // clicking the "detail" button on landing page will lead to showing corresponding details of the post
    // additionally clicking the "detail" button will show detail div only. forms and posts will be hidden by using display : "none"
    function rerun(array){
        for(let i=0; i<array.length; i++){
            array[i].onclick = function(e){
                posts.style.display = "none";
                info.style.display = "flex";
                form.style.display = "none";
                info.innerHTML = `
                <img src="javascript/newimage.webp">
                <div class="details-words">
                    <i class="fa-solid fa-x"></i>
                    <div class="header">
                        <p>
                            Post Id-${display[i]["id"]}
                        </p>
                        <p>
                            ${display[i]["title"]}
                        </p>
                    </div>
                    <h2>Contents</h2>
                    <p>
                        ${display[i]["content"]}
                    </p>
                    <p>
                       ${display[i]["created_by"]} created on ${display[i]["created_at"]};
                    </p>
                    <p>
                    Image_url : ${display[i]["image_url"]}
                    </p>
                <span class="crud">
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                    <button class="add-new">Add New</button>
                </span>
                </div>
                `

                // selecting the corresponding buttons
                let add = document.querySelector("button.add-new");
                let edit = document.querySelector("button.edit");
                let deletePost = document.querySelector("button.delete");
                
                // clicking the add button will only show add-new-post form and others will be hidden
                add.onclick = function(e){
                    info.style.display = "none";
                    form.style.display = "block";
                    posts.style.display = "none";
                    // setting the form values refreshed so that no text will be shown after entering the form page again
                    form.title.value = "";
                    form.content.value = "";
                    // clicking the add button will show only button for new post
                    document.getElementById("editdata").style.display = "none";
                    document.getElementById("newdata").style.display = "block";
                }

                // clicking the edit button will only show edit-post form and others will be hidden
                edit.onclick = function(e){
                    info.style.display = "none";
                    form.style.display = "block";
                    posts.style.display = "none";
                    form.title.value = display[i]["title"];
                    form.content.value = display[i]["content"];
                    // clicking the edit button will show only the button for edition of posts
                    document.getElementById("editdata").style.display = "block";
                    document.getElementById("newdata").style.display = "none";
                }

                // clicking the delete button will ask you "Are you sure?" if you say yes, the corresponding post will be deleted and return back to landing page
                deletePost.onclick = function(e){
                    let confirmDelete = confirm("Are you sure?");
                    if(confirmDelete){
                        info.style.display = "none";
                        form.style.display = "none";

                        // the array you want to disappear will be deleted by replacing data from array[0]. shifting the array will delete array[0] and array[0] data is not deleted and present in the array
                        result[i] = result[0];
                        result.shift();
                        // sorting array according to created_time
                        sorting(result);
                        // choosing the most recent posts
                        display = result.slice(0,20);
                        // storing data in localstorage
                        let tempData = {result};
                        localStorage.setItem("posts-data-update",JSON.stringify(tempData));
                        // in the posts showing function, I used post.innerHTML += so post.innerHTML is reseted before using function
                        posts.innerHTML = " ";
                        // reusing the posts showing function 
                        showing(display);
                        // reuse this function so that "details" button on landing page can be clicked
                        rerun(document.querySelectorAll("button.modify"));
    
                        posts.style.display = "flex";
                    }             
                }

                // clicking the "cross x" button on top right corner will lead you to landing page
                document.querySelector("i").onclick = function(e){
                    posts.style.display = "flex";
                    info.style.display = "none";
                }

                // clicking the "edit post" button will lead you to landing page and your edition of post will be fulfilled
                document.getElementById("editdata").onclick = function(e){
                    e.preventDefault();
                    // the datas are updated
                    result[i]["title"] = form.title.value;
                    result[i]["content"] = form.content.value;
                    // sorting array according to created_time
                    sorting(result);
                    // choosing the most recent posts
                    display = result.slice(0,20);
                    // storing data in localstorage
                    let tempData = {result};
                    localStorage.setItem("posts-data-update",JSON.stringify(tempData));
                    // in the posts showing function, I used "post.innerHTML +=" so post.innerHTML is reseted before using function
                    posts.innerHTML = " ";
                     // reusing the posts showing function 
                    showing(display);
                    // using the previous function so that the buttons can be reused and clicked after editing the posts
                    rerun(document.querySelectorAll("button.modify"));

                    info.style.display = "none";
                    posts.style.display = "flex";
                    form.style.display = "none";
                }

                // clicking the "cross-x" button on the top right of form will lead you to landing page
                document.getElementById("x").onclick = function(e){
                    info.style.display = "none";
                    posts.style.display = "flex";
                    form.style.display = "none";
                }

                // clicking the "left-arrow" button will lead to you posts details page
                document.getElementById("arrow-left").onclick = function(e){
                    info.style.display = "flex";
                    posts.style.display = "none";
                    form.style.display = "none";
                }
            } 
        }
    }
    rerun(detail);

    // to automatically give the Id number to new posts, I used localStorage for id-number
    // If there is no data in localstorage, it will set to 41. If there is previous data, the previous data of Id-number will be used
    if(!localStorage.getItem("Id-number")){
        localStorage.setItem("Id-number",41);
    }
    let numberId;

    // clicking the "add new-post" button will lead you to landing page and new posts will be added to landing page
    document.getElementById("newdata").onclick = function(e){
        e.preventDefault();
        // to fill ["created_at"] property, posted date and time is calculated
        let d = new Date();
        let g = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
        let f = d.getMonth() + 1;
        f = f < 10 ? "0" + f : f;
        // if minutes is less than 10 string "0" should be added so that it will show "02", "05",etc.
        let h = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
        let k = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();

        if(localStorage.getItem("Id-number")){
            numberId = JSON.parse(localStorage.getItem("Id-number"));
        }
        else{
            numberId = 41;
        }

        // to set post creater, use localStorage user credential data
        let postcreater = localStorage.getItem("Login-user");
        result.push({
            "id" : `${numberId}`,
            "title" : form.title.value,
            "image_url" : "https://via.placeholder.com/150",
            "content" : form.content.value,
            "created_at" : `${d.getFullYear()}-${f}-${g}T${k}:${h}:00Z`,
            "created_by" : postcreater
        })
        // after adding the post the Id-number should increase by 1, Store the number in localStorage
        numberId+=1;
        localStorage.setItem("Id-number",JSON.stringify(numberId));
        // sorting array
        sorting(result);
        // choosing the most recent posts
        display = result.slice(0,20);
        // storing new data
        let tempData = {result};
        localStorage.setItem("posts-data-update",JSON.stringify(tempData));
        // reseting the posts
        posts.innerHTML = " ";
        // reuse the function to display 20 posts
        showing(display);
        info.style.display = "none";
        posts.style.display = "flex";
        form.style.display = "none";
        // reuse this function to activate "detail" buttons
        rerun(document.querySelectorAll("button.modify"));
    }
};
getPosts();