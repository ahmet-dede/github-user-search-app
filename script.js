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

// search input and button elements
const searchInput = document.getElementById("searchArea");
const searchButton = document.getElementById("searchButton");
const reposButton = document.getElementById("reposButton");

document.addEventListener("DOMContentLoaded", () => {
  searchInput.addEventListener("input", debounce(handleInput, 300));
});

// event listener to the search button
searchButton.addEventListener("click", searchUser);

// event listener for the 'Enter' key on the search input
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchUser();
  }
});

reposButton.addEventListener("click", () => {
  window.open(userId + "?tab=repositories", "_blank");
});

let timeout = null;

function debounce(func, wait) {
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

async function suggestions(query) {
  const response = await fetch(
    `https://api.github.com/search/users?q=${query}`,
  );
  const data = await response.json();
  return data.items;
}

async function handleInput(event) {
  const query = event.target.value;
  if (query.length > 0) {
    const users = await suggestions(query);
    const suggestions = users.map((user) => `<li>${user.login}</li>`).join("");
    document.getElementById("suggestions").innerHTML = suggestions;
  } else {
    document.getElementById("suggestions").innerHTML = "";
  }
}

function searchUser() {
  let userName = searchInput.value.split(" ").join("");

  const userNotFound = document.getElementById("userNotFound");

  // request to the GitHub API
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
      let name = data.name;
      let userName = document.getElementById("userName");
      userName.innerText = name;

      let profileImg = data.avatar_url;
      document.getElementById("profileImg").src = profileImg;
      document.getElementById("profileImgMobile").src = profileImg;

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

      let userId = data.login;
      let userIdUrl = data.html_url;
      document.getElementById("userId").textContent = "@" + userId;
      document.getElementById("userId").href = userIdUrl;

      let bio = data.bio;
      let userBio = document.getElementById("userBio");
      userBio.textContent = bio;

      let publicRepos = data.public_repos;
      let following = data.following;
      let followers = data.followers;

      let userRepo = document.getElementById("userRepo");
      userRepo.textContent = publicRepos;
      let userFollowers = document.getElementById("userFollowers");
      userFollowers.textContent = followers;
      let userFollowing = document.getElementById("userFollowing");
      userFollowing.textContent = following;

      let location = data.location;
      const userLocation = document.getElementById("userLocation");
      if (location === null) {
        userLocation.textContent = "Not available";
      } else {
        userLocation.textContent = location;
      }

      let twitterUsername = data.twitter_username;
      let userTwitterName = document.getElementById("userTwitterName");
      if (twitterUsername === null) {
        userTwitterName.textContent = "Not available";
      } else {
        userTwitterName.innerText = twitterUsername;
        userTwitterName.href = "https://twitter.com/" + twitterUsername;
      }

      let company = data.company;
      let userCompany = document.getElementById("userCompany");
      if (company === null) {
        userCompany.textContent = "Not available";
      } else {
        userCompany.textContent = company;
      }

      let blogURL = data.blog;
      let userWebsite = document.getElementById("userWebsite");
      if (blogURL === "") {
        userWebsite.textContent = "Not available";
        userWebsite.href = "#";
        userWebsite.removeAttribute("target");
      } else {
        userWebsite.innerText = blogURL;
        userWebsite.href = "https://" + blogURL;
      }
    });
}