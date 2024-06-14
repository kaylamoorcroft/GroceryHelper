const table = document.querySelector("table");
const addItemBtn = document.getElementById("add-item-btn");
const itemEditorWindow = document.getElementById("item-editor-window");
const nameInput = document.getElementById("name-input");
const dateInput = document.getElementById("date-input");
const cancelBtn = document.getElementById("cancel-btn");
const confirmBtn = document.getElementById("confirm-btn");

groceries = [
    {
        name: "milk",
        expiryDate: new Date("2024-05-05")
    },
    {
        name: "ham",
        expiryDate: new Date("2024-06-27")
    },
    {
        name: "cereal",
        expiryDate: new Date("2024-07-14") 
    }
];

const addItem = () => {
    groceries.push({
        name: nameInput.value,
        expiryDate: new Date(dateInput.value)
    });
    updateGroceryList();
    reset();
}

const updateGroceryList = () => {
    console.log("today is",new Date());
    const localOffset = new Date().getTimezoneOffset() * 60000; // in minutes, converted to ms
    const msPerDay = 60*60*24*1000;
    groceries.sort((a,b) => a.expiryDate - b.expiryDate);
    table.innerHTML = "";
    groceries.forEach(({name,expiryDate}) => {
        expiryDate.setTime(expiryDate.getTime() + localOffset);
        const daysLeft = Math.ceil((expiryDate - new Date())/msPerDay);
        let expiryText = "";
        if (daysLeft > 0) {
            expiryText = daysLeft + " days left";
        }
        else if (daysLeft === 0) {
            expiryText = "EXPIRING TODAY";
        }
        else {
            expiryText = "EXPIRED " + -daysLeft + " DAYS AGO"
        }
        table.innerHTML += `
        <tr class="grocery-item">
            <th>${name}:</th>
            <td>${expiryText}</td>
            <td><i class="fa-regular fa-pen-to-square"></i></td>
            <td><i class="fa-regular fa-trash-can"></i></td>
        </tr>`;
        console.log(name, expiryDate);
    });
}

const reset = () => {
    itemEditorWindow.classList.add("hidden");
    nameInput.value = "";
    dateInput.value = "";
}

addItemBtn.addEventListener("click", () => {
    itemEditorWindow.classList.remove("hidden");
})

cancelBtn.addEventListener("click", () => {
    itemEditorWindow.classList.add("hidden");
})
confirmBtn.addEventListener("click", addItem);