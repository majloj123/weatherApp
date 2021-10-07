const form = document.querySelector('.top-banner form');
const input = document.querySelector('.top-banner input');
const message = document.querySelector('.top-banner .popUp');
const list = document.querySelector('.ajax-section .cities');

const apiKey = '85b6f094097b7689ee4f95682ae62355';


    
// Verification in searchbar

form.addEventListener('submit', (e)=> {
    e.preventDefault();
    const inputValue = input.value;

    //checking cities
    const itemList = list.querySelectorAll('.ajax-section .city');
    const itemArray = Array.from(itemList);

    if (itemArray.length > 0) {
        const filteredArray = itemArray.filter(item => {
            let content ='';
            if (inputValue.includes(',')) {
                if (inputValue.split(',')[1].length > 2) {
                    content = item.querySelector('.city-name span').textContent.toLowerCase();
                } else {
                    content = item.querySelector('.city-name').dataset.name.toLowerCase();
                }
            } else {
                content = item.querySelector('.city-name span').textContent.toLowerCase();
            }
            return content == inputValue.toLowerCase();
        })
        if (filteredArray.length > 0) {
        message.textContent = `You already find the weather for ${filteredArray[0].querySelector('.city-name span').textContent}. If you want to find different weather, try to type also country code!`;
        form.reset();
        input.focus();
        return;
        }
    }
    
    //actual API fetch 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${apiKey}&units=metric`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        const { main, name, sys, weather } = data;
        const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;
 
        const li = document.createElement("li");
        li.classList.add("city");
        li.setAttribute('id', sys.id);
        li.innerHTML = `
        <button onclick="delFunction(${sys.id})" class="delete"><i class="fas fa-trash-alt"></i></button>
        <h2 class="city-name" data-name="${name},${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup> 
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup>
        </div>
        <figure>
            <img class="city-icon" src=${icon} alt=${weather[0]["main"]}>
            <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
        `;
        
        list.appendChild(li);
        
    })
    .catch(() => {
        message.textContent = 'Please try to enter real city!';
    })

    message.textContent = "";
    form.reset();
    input.focus();
})

function delFunction(id) {
    const selectedLi = document.getElementById(`${id}`);
    selectedLi.remove()
}



