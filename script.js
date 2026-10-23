const oppurtunities = [
    {
        id:1,
        title: "frontend devolepers",
        company : "ABc technologies",
        category: "Internships",
        skills : "html,css and javascript"
    },   

     {
        id:2,
        title: "backend devolepers",
        company: "infosys technologies",
        category : "Jobs",
        skills : "express.js, javascript"

      },

      {
        id:3,
        title: "python devoleper",
        company: "Innovate Labs",
        category: "Internships",
        skills: "React, Node.js,MongoDB"
      },

      {
        id:4,
        title: "AI",
        company: "Space X",
        category: "Jobs",
        skills: "python"
      }
]

const oppurtunityList = document.getElementById("oppurtunity-list");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const noResult = document.getElementById("no-results");
const favoriteToggle = document.getElementById("favorite-toggle");

let savedIds= [];

try {
    const savedData = localStorage.getItem("savedOpportunities");

    if (savedData !== null) {
        const parseData= JSON.parse(savedData);

        if(Array.isArray(parseData)) {
            savedIds = parseData.filter((id) => Number.isInteger(id) && oppurtunities.some((oppurtunity) =>  oppurtunity.id === id)
        );
        }
    }
}catch (error) {
    console.log("Could Not Load Favorited:",error);
}

// is the user viewing favorites only
let showFavorites = false;

//save favorites to localStorage
function saveFavorites() {
    try{
        localStorage.setItem("savedOpportunities",JSON.stringify(savedIds));
    }catch (error) {
      console.log("could Not Save Favorites:",error);
      alert("Unable To Save Favorites In This Browser.");
    }
}

// displat oppurtunities
function displayOpportunities() {
    // get the users search text
    const searchText = searchInput.value.toLowerCase().trim();

    // get the selected category
    const selectedCategory = categoryFilter.value;

    //filter the oppurtunities
    const filterdOppurtunities = oppurtunities.filter((oppurtunity) => {
        const title = oppurtunity.title.toLowerCase();
        const company = oppurtunity.company.toLowerCase();

        const matchesSearch = 
        title.includes(searchText)||
        company.includes(searchText);

        const matchesCategory = 
        selectedCategory === "All" ||
        oppurtunity.category === selectedCategory;

        const isSaved = savedIds.includes(oppurtunity.id);


        const matchesFavorites =
        !showFavorites || isSaved ;


        return matchesSearch && matchesCategory && matchesFavorites;
    });

    // clear the old cards before displaying new results
    oppurtunityList.innerHTML = "";

    //show or hide no-result message 
    noResult.hidden = filterdOppurtunities.length > 0;

    //update the toggle button
    favoriteToggle.textContent = showFavorites
    ? " Show All Oppurtunites" : "Show Favorites";




    filterdOppurtunities.forEach((oppurtunity) => {
        const card = document.createElement("article");
        card.className = "card";

        const title = document.createElement("h3");
        title.textContent = oppurtunity.title;

        const company = document.createElement("p");
        company.textContent = oppurtunity.company;

        const category = document.createElement("p");
        category.textContent = "Type : " + oppurtunity.category;
        const skills = document.createElement("p");
        skills.textContent = "Type: " + oppurtunity.skills;

        const detailsButton = document.createElement("button");
        detailsButton.textContent = "View Details";
        detailsButton.type = "button";

        const saveButton =document.createElement("button");
        saveButton.type="button";

        const isSaved = savedIds.includes(oppurtunity.id);
        

        saveButton.textContent = isSaved
        ?"Remove Saved"
        :"save";

        saveButton.className = isSaved
        ?"saved-btn"
        :"save-btn";
       
        // save or remove a favorite
        saveButton.addEventListener("click", () => {
            if (savedIds.includes(oppurtunity.id)) {
                savedIds = savedIds.filter((id) => id !== oppurtunity.id);
            } else {
                savedIds.push(oppurtunity.id);
            }

            saveFavorites();
            displayOpportunities();
        })
        card.appendChild(title);
        card.appendChild(company);
        card.appendChild(category);
        card.appendChild(skills);
        card.appendChild(detailsButton);
        card.appendChild(saveButton);

        oppurtunityList.appendChild(card);
    });
}

//search whenever the user types
searchInput.addEventListener("input", displayOpportunities);

//filter whenever the selected category changes
categoryFilter.addEventListener("change",displayOpportunities);

//toggle between all oppurtunities and favorites
favoriteToggle.addEventListener("click", () => {
    showFavorites = !showFavorites;
    displayOpportunities();
});

displayOpportunities();

const registerForm = document.getElementById("register-form");
const nameInput=document.getElementById("name");
const emailInput= document.getElementById("email");
const courseInput = document.getElementById("course");
const passwordInput = document.getElementById("password");
const formMessage = document.getElementById("form-message");

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const course = courseInput.value.trim();
    const password = passwordInput.value.trim();

    if(!name || !email || !course || !password) {
        formMessage.textContent = "Please Fill In All Fields.";
        return;
    }


    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        formMessage.textContent = "Please Enter A Valid Email";
        return; 
     }

     if(password.length < 6) {
        formMessage.textContent = "password Must Contain At Leat 6 Characters";
        return;
     }

     formMessage.textContent = "Register Form Validated Success.";
     registerForm.reset();
});