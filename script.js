const table = document.querySelector("table");
const addItemBtn = document.getElementById("add-item-btn");
const itemEditorWindow = document.getElementById("item-editor-window");
const nameInput = document.getElementById("name-input");
const dateInput = document.getElementById("date-input");
const cancelBtn = document.getElementById("cancel-btn");
const confirmBtn = document.getElementById("confirm-btn");

let currentItem = {};

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

const addOrUpdateItem = () => {
    if (!nameInput.value) {
        window.alert("Please add a name for the item");
        return
    }
    const dateFormat = /\d{4}-\d{2}-\d{2}/;
    if (!dateFormat.test(dateInput.value)) {
        window.alert("Please fill in the date properly");
        return;
    }
    const itemIndex = groceries.findIndex((item) => item.name == nameInput.value);
    const newItem = {
        name: nameInput.value,
        expiryDate: new Date(dateInput.value)
    };
    if (itemIndex === -1) {
        groceries.push(newItem);
    }
    else {
        console.log(`"${groceries[itemIndex].name}" vs "${nameInput.value}"`);
        if (groceries[itemIndex].name === nameInput.value) {
            const editItemInstead = confirm(`An "${nameInput.value}" item already exists. If you would like to modify the existing item, click okay. Otherwise, click cancel and give the item a new name.`);
            if (!editItemInstead) {
                return;
            }
        }
        groceries[itemIndex] = newItem;
    }
    updateGroceryList();
    reset();
}
const editItem = (buttonEl) => {
    const itemIndex = groceries.findIndex((item) => item.name == buttonEl.parentElement.parentElement.id);
    currentItem = groceries[itemIndex];
    const date = currentItem.expiryDate;
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;

    nameInput.value = currentItem.name;
    dateInput.value = formattedDate;

    itemEditorWindow.classList.remove("hidden");
}
const deleteItem = (buttonEl) => {
    const itemIndex = groceries.findIndex((item) => item.name == buttonEl.parentElement.parentElement.id);
    buttonEl.parentElement.parentElement.remove();
    groceries.splice(itemIndex,1);
}
const updateGroceryList = () => {
    const localOffset = new Date().getTimezoneOffset() * 60000; // in minutes, converted to ms
    const msPerDay = 60*60*24*1000;
    groceries.sort((a,b) => a.expiryDate - b.expiryDate);
    table.innerHTML = "";
    groceries.forEach(({name,expiryDate}) => {
        expiryDate.setTime(expiryDate.getTime() + localOffset);
        const daysLeft = Math.ceil((expiryDate - new Date())/msPerDay);
        let expiryText = "";
        if (daysLeft > 0) {
            expiryText = `${daysLeft} days left`;
        }
        else if (daysLeft === 0) {
            expiryText = `<span class="important">EXPIRING TODAY</span>`;
        }
        else {
            expiryText = `<span class="important">EXPIRED ${-daysLeft} DAYS AGO</span>`;
        }
        table.innerHTML += `
        <tr id=${name}>
            <th>${name}:</th>
            <td>${expiryText}</td>
            <td><i class="fa-regular fa-pen-to-square" onclick="editItem(this)"></i></td>
            <td><i class="fa-regular fa-trash-can" onclick="deleteItem(this)"></i></td>
        </tr>
        `;
    });
}

const reset = () => {
    itemEditorWindow.classList.add("hidden");
    nameInput.value = "";
    dateInput.value = "";
    currentItem = {};
}

addItemBtn.addEventListener("click", () => {
    itemEditorWindow.classList.remove("hidden");
})

cancelBtn.addEventListener("click", () => {
    itemEditorWindow.classList.add("hidden");
})
confirmBtn.addEventListener("click", addOrUpdateItem);