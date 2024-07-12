let body = document.querySelector("body");
let themeButton = document.getElementById("themeSwitch");
let themeIcon = document.getElementById("themeIcon");

themeButton.addEventListener("click", () => {
  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    themeIcon.src = "./assets/icon-sun.svg";
  } else {
    themeIcon.src = "./assets/icon-moon.svg";
  }
});

// Get the search input and button elements
const searchInput = document.getElementById("searchArea");
const searchButton = document.getElementById("searchButton");
const reposButton = document.getElementById("reposButton");
reposButton.addEventListener("click", () => {
  window.open(userId + "?tab=repositories", "_blank");
});

// Add an event listener to the search button
searchButton.addEventListener("click", searchUser);

// Add an event listener for the 'Enter' key on the search input
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchUser();
  }
});

function searchUser() {
  // Get the user name from the search input and remove any spaces
  let userName = searchInput.value.split(" ").join("");

  // Get the 'user not found' element
  const userNotFound = document.getElementById("userNotFound");

  // Send a request to the GitHub API to get information about the user
  fetch("https://api.github.com/users/" + userName)
    .then((response) => {
      // If the response is OK, hide the 'user not found' message and return the response JSON
      if (response.ok) {
        userNotFound.style.display = "none";
        document.getElementById("userInformationContainer").style.display =
          "flex";
        return response.json();
      }
      // If the response is not OK, show the 'user not found' message and throw an error
      else {
        userNotFound.style.display = "block";
        document.getElementById("userInformationContainer").style.display =
          "none";
        throw new Error("User not found.");
      }
    })
    .then((data) => {
      // Get the name from the response data and populate it on the user name
      let name = data.name;
      let userName = document.getElementById("userName");
      userName.innerText = name;

      // Get the avatar from the response data and populate it on the profile img
      let profileImg = data.avatar_url;
      document.getElementById("profileImg").src = profileImg;
      document.getElementById("profileImgMobile").src = profileImg;

      // Get the join date from the response data, format it, and populate the join date details on the page
      let joinFullDate = data.created_at;
      let dateStr = joinFullDate.substring(0, 10);
      let dateSplit = dateStr.split("-");
      const monthNumber = dateSplit[1] - 1;
      const monthName = new Date(Date.UTC(0, monthNumber)).toLocaleString(
        "en-US",
        { month: "short" },
      );

      let joinDate = document.getElementById("joinDate");
      let joinMonth = document.getElementById("joinMonth");
      let joinYear = document.getElementById("joinYear");
      joinDate.innerText = dateSplit[2];
      joinMonth.textContent = monthName;
      joinYear.textContent = dateSplit[0];

      // Get the user id and user id URL from the response data and populate it on the user id
      let userId = data.login;
      let userIdUrl = data.html_url;
      document.getElementById("userId").textContent = "@" + userId;
      document.getElementById("userId").href = userIdUrl;

      // Get the bio from the response data and populate it on the user bio
      let bio = data.bio;
      let userBio = document.getElementById("userBio");
      userBio.textContent = bio;

      // Get the repos, followers and following from the response data and populate it on the user repos, user followers and user following respectively
      let publicRepos = data.public_repos;
      let following = data.following;
      let followers = data.followers;

      let userRepo = document.getElementById("userRepo");
      userRepo.textContent = publicRepos;
      let userFollowers = document.getElementById("userFollowers");
      userFollowers.textContent = followers;
      let userFollowing = document.getElementById("userFollowing");
      userFollowing.textContent = following;

      // Get the location from the response data and populate it on the user location
      let location = data.location;
      const userLocation = document.getElementById("userLocation");
      if (location === null) {
        userLocation.textContent = "Not available";
      } else {
        userLocation.textContent = location;
      }

      // Get the twitter user name from the response data and populate it on the user twitter name
      let twitterUsername = data.twitter_username;
      let userTwitterName = document.getElementById("userTwitterName");
      if (twitterUsername === null) {
        userTwitterName.textContent = "Not available";
      } else {
        userTwitterName.innerText = twitterUsername;
        userTwitterName.href = "https://twitter.com/" + twitterUsername;
      }

      // Get the company name from the response data and populate it on the user company name
      let company = data.company;
      let userCompany = document.getElementById("userCompany");
      if (company === null) {
        userCompany.textContent = "Not available";
      } else {
        userCompany.textContent = company;
      }

      // Get the blog URL from the response data and populate it on the user website
      let blogURL = data.blog;
      let userWebsite = document.getElementById("userWebsite");
      if (blogURL === "") {
        userWebsite.textContent = "Not available";
        userWebsite.href = "#";
        userWebsite.removeAttribute("target");
      } else {
        userWebsite.innerText = blogURL;
        userWebsite.href = "https://" + blogURL;
        userWebsite.setAttribute("target:_blank");
      }
    });
}