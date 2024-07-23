const corsAnywhere = "https://cors-anywhere.herokuapp.com/"
const baseURL = "https://www.freetogame.com/api"
const retrieveAllExtension = "/games"
let allObj
let sortObj

let searchBar = document.getElementById("search-bar")
let searchButton = document.getElementById("search-button")

let searched_value
let retrieveByGenreExtension
let retrieveByPlatformExtension
let objectToUse

let relevanceBtn = document.getElementById("relevance")
let releaseDateBtn = document.getElementById("release-date")
let alphabeticalBtn = document.getElementById("alphabetical")
let popularityBtn = document.getElementById("popularity")

let sortMethod
const relevance = "relevance"
const release_date = "release-date"
const alphabetical = "alphabetical"
const popularity = "popularity"

let listBox = document.querySelector(".list-box")

async function RetrieveAll(){
    try {
        let allResponse = await fetch(`${corsAnywhere}${baseURL}${retrieveAllExtension}`)
        allObj = await allResponse.json()
        UpdateInfo(allObj)
    } catch (error) {
        console.error("Error fetching all games:", error)
    }
}

function UpdateInfo(games){
    games.forEach((game, index) => {
        let srNo = (index + 1) + "."
        let thumbnail = game.thumbnail
        let name = game.title
        let developer = game.developer
        let publisher = game.publisher
        let genre = game.genre
        let platform = game.platform
        let releaseDate = game.release_date
        let description = game.short_description
        let id = game.id

        let row = document.createElement("tr")
        
        let srNoTd = document.createElement("td")
        srNoTd.className = "sr-no"
        srNoTd.textContent = srNo
        row.appendChild(srNoTd)

        let thumbnailTd = document.createElement("td")
        thumbnailTd.className = "thumbnail"
        let thumbnailImg = document.createElement("img")
        thumbnailImg.src = thumbnail
        thumbnailTd.appendChild(thumbnailImg)
        row.appendChild(thumbnailTd)
        
        let nameTd = document.createElement("td")
        nameTd.className = "name"
        nameTd.textContent = name
        row.appendChild(nameTd)

        let descriptionTd = document.createElement("td")
        let devSpan = document.createElement("span")
        let pubSpan = document.createElement("span")
        let genSpan = document.createElement("span")
        let platSpan = document.createElement("span")
        let descSpan = document.createElement("span")
        let dateSpan = document.createElement("span")

        devSpan.textContent = `Developer: ${developer}`
        pubSpan.textContent = `Publisher: ${publisher}`
        genSpan.textContent = `Genre: ${genre}`
        platSpan.textContent = `Platform: ${platform}`
        descSpan.textContent = `Description: ${description}`
        dateSpan.textContent = `Release Date: ${releaseDate}`

        descriptionTd.appendChild(devSpan)
        descriptionTd.appendChild(document.createElement("br"))
        descriptionTd.appendChild(pubSpan)
        descriptionTd.appendChild(document.createElement("br"))
        descriptionTd.appendChild(genSpan)
        descriptionTd.appendChild(document.createElement("br"))
        descriptionTd.appendChild(platSpan)
        descriptionTd.appendChild(document.createElement("br"))
        descriptionTd.appendChild(descSpan)
        descriptionTd.appendChild(document.createElement("br"))
        descriptionTd.appendChild(dateSpan)

        row.appendChild(descriptionTd)    
                                     
        listBox.appendChild(row)
        row.id = id
    })
}

function UpdateSearch(object){
    // Clear previous search results
    listBox.innerHTML = `<tr id="unremovable">
            <th class = "sr-no">Sr. No</th>
            <th class="thumbnail"></th>
            <th class = "name">Name</th>
            <th class = "description">Description</th>
        </tr>`

    // Populate with new search results
    UpdateInfo(object)
}

async function RetrieveSearch(){
    try {
        let genreResponse = await fetch(`${corsAnywhere}${baseURL}${retrieveByGenreExtension}`)
        let platformResponse = await fetch(`${corsAnywhere}${baseURL}${retrieveByPlatformExtension}`)

        let genreObj = await genreResponse.json()
        let platformObj = await platformResponse.json()

        if (genreObj.length) {
            objectToUse = genreObj
        } else if (platformObj.length) {
            objectToUse = platformObj
        } else {
            alert("Invalid Search")
            return
        }

        console.log("Object to use:", objectToUse)
        UpdateSearch(objectToUse)
    } catch (error) {
        console.error("Error fetching search results:", error)
    }
}

RetrieveAll()

searchButton.addEventListener("click", () => {
    searched_value = searchBar.value
    retrieveByPlatformExtension = `/games?platform=${searched_value}`
    retrieveByGenreExtension = `/games?category=${searched_value}`
    console.log("Searched value:", searched_value)
    RetrieveSearch()
})

relevanceBtn.addEventListener("click", () => {
    sortMethod = relevance
    SortRetrieve()
})
releaseDateBtn.addEventListener("click", () => {
    sortMethod = release_date
    SortRetrieve()
})
popularityBtn.addEventListener("click", () => {
    sortMethod = popularity
    SortRetrieve()
})
alphabeticalBtn.addEventListener("click", () => {
    sortMethod = alphabetical
    SortRetrieve()
})

async function SortRetrieve(){
    let response = await fetch(`${corsAnywhere}${baseURL}/games?sort-by=${sortMethod}`)
    sortObj = await response.json()
    UpdateSearch(sortObj)
}