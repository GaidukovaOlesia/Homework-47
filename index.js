const API = `https://63f9131f347a824a7f6293d3.mockapi.io`;

async function controller (method, action, body) {
    const URL = `${API}/${action}`;
    const params = {
        method,
        headers: {
            "Content-Type": "application/json",
        }
    }
    if (body) params.body = JSON.stringify(body);
    const response = await fetch(URL, params);
    const data = await response.json();
    return data;
}

const heroesForm = document.getElementById("heroesForm");
const select = document.querySelector("[data-name='heroComics']");

async function getSelectValue() {
    const comicsValue = await controller("GET", `universes`);
    comicsValue.forEach(universe => {
        let option = document.createElement("option");
        option.value = universe.name;
        option.innerText = universe.name;
        select.append(option);
    })
}
getSelectValue();

async function getHeroes() {
    const response = await controller("GET", "/heroes");
    renderHeroes(response);
}
 getHeroes();

function renderHeroes(response) {
    response.forEach(hero => {
        renderHero(hero);
    })
}

heroesForm.addEventListener("submit", async e => {
    e.preventDefault();


    const nameSurname = document.querySelector("[data-name='heroName']").value;
    const comics = document.querySelector("[data-name='heroComics']").value;

    const response = await controller("GET", "/heroes");
    const heroFind = response.find(hero => hero.name === nameSurname && hero.comics === comics)

    if(heroFind) {
        console.log("This hero is already in the database!");
    } else {
        const newHero = await createHero();
        renderHero(newHero);
    }
})

async function createHero() {
    const nameSurname = document.querySelector("[data-name='heroName']").value;
    const comics = document.querySelector("[data-name='heroComics']").value;
    let favourite = document.querySelector(`input[data-name='heroFavourite']`).value;

    if(document.querySelector("[data-name='heroFavourite']").checked) {
        favourite = "true";
    } else {
        favourite = "false";
    }
    console.log(favourite);
    const body = {
        name: nameSurname,
        comics,
        favourite,
    }
    const newHero = await controller("POST", "/heroes", body);
    console.log(newHero);
    return newHero;
}

function renderHero(newHero) {
    console.log(newHero);
    const tbody = document.querySelector("tbody");
    const tr = document.createElement("tr");
    const tdFirst = document.createElement("td");
    const tdSecond = document.createElement("td");
    const tdThird = document.createElement("td");
    const tdForth = document.createElement("td");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const button = document.createElement("button");

    label.innerText = " Favourite ";
    tdFirst.innerText = newHero.name;
    tdSecond.innerText = newHero.comics;
    button.innerText = "Delete";
    input.type = "checkbox";
    if(newHero.favourite === "true") {
        input.checked = true;
    }

    tr.append(tdFirst);
    tr.append(tdSecond);

    label.append(input);
    tdThird.append(label);
    tr.append(tdThird);
    tdForth.append(button);
    tr.append(tdForth);
    tbody.append(tr);

    input.addEventListener("change", async () => {
        if(input.checked) {
            input.value = "true";
        } else {
            input.value = "false";
        }
        const body = {
            name: newHero.name,
            comics: newHero.comics,
            favourite: input.value,
        }
        console.log(input.value);
        const changeHero = await controller("PUT", `heroes/${newHero.id}`, body);
        console.log(changeHero);
    })

    button.addEventListener("click",async () => {
        const deleteHero = await controller("DELETE", `heroes/${newHero.id}`);
        tr.innerHTML = "";
    })
}
