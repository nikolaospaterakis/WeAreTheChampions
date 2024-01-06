import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://wearethechampions-6b720-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const championsDB = ref(database, "Comments")

const btnEl = document.getElementById("publish-btn")
const inputEl = document.getElementById("input-text")
const commentsEl = document.getElementById("comments")
const whatTypeEl = document.getElementById("whatType")
const fromEl = document.getElementById("from-input")
const toEl = document.getElementById("to-input")

whatTypeEl.addEventListener("click", function() {
    if (whatTypeEl.innerHTML === "👨‍🦳" ) {
        whatTypeEl.innerHTML = `👶`
        commentsEl.style.flexDirection = "column-reverse"
    } else {
        whatTypeEl.innerHTML = `👨‍🦳`
        commentsEl.style.flexDirection = "column"
    }
})

let allTogether = {
    text: "",
    fromText: "",
    toText: "",
    likes: 0,
    isLiked: false
}

//let allTogetherList = []


btnEl.addEventListener("click", function() {
    allTogether.likes = 0
    allTogether.text = inputEl.value 
    allTogether.fromText = fromEl.value  
    allTogether.toText = toEl.value
    
    push(championsDB, allTogether)
    clearInputValue(inputEl)
    clearInputValue(fromEl)
    clearInputValue(toEl)
})

onValue(championsDB, function(snapshot){
    if(snapshot.exists()){
        clearComments()
        let itemsArray = Object.entries(snapshot.val())
        for(let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            appendItemToList(currentItem)
        }
    } else {
        commentsEl.innerHTML = `Its so quiet here...`
    }
})

function clearInputValue(item) {
    item.value = ""
}

function clearComments() {
    commentsEl.innerHTML = " "
}

function appendItemToList(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    
    let liEl = document.createElement("li")
    liEl.innerHTML = `
    <span>
        To ${itemValue.toText}
    </span> 
        <p>
            ${itemValue.text}
        </p>
    <div id="div-span">
        <span>
        From ${itemValue.fromText}
        </span>
        <span class="likes-span" id="likes-span-${itemID}">
            🖤  ${itemValue.likes} 
        </span>
    </div>
     `
    commentsEl.append(liEl)
    
    liEl.addEventListener("dblclick", function() {
        let exactItemID = ref(database, `Comments/${itemID}`)
        remove(exactItemID)
    })
    let likeEl = document.getElementById(`likes-span-${itemID}`)
    likeEl.addEventListener("click", function() {
        if(itemValue.isLiked) {
            console.log("already liked")
        } else {
            itemValue.isLiked = !itemValue.isLiked
            let currentLikes = itemValue.likes
            currentLikes ++
            itemValue.likes = currentLikes
            console.log(itemValue)
            update(ref(database, `Comments/${itemID}`), allTogether = {
            text: itemValue.text,
            fromText: itemValue.fromText,
            toText: itemValue.toText,
            likes: itemValue.likes,
            isLiked: itemValue.isLiked
    })
            console.log(currentLikes)
            }
    }
    )
}

