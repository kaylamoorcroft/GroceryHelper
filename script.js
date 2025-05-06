const table = document.querySelector("table");
const addItemBtn = document.getElementById("add-item-btn");
const itemEditorWindow = document.getElementById("item-editor-window");
const nameInput = document.getElementById("name-input");
const dateInput = document.getElementById("date-input");
const cancelBtn = document.getElementById("cancel-btn");
const confirmBtn = document.getElementById("confirm-btn");
const csvImportBtn = document.getElementById("csv-import-btn");
const uploadCsvWindow = document.getElementById("upload-csv");
const submitCsvBtn = document.getElementById("submit-csv-btn");
const cancelUploadBtn = document.getElementById("cancel-upload-btn");
const csvFile = document.getElementById("csv-file");
/** Grocery item currently selected to edit */
let currentItem = {};
/** Array of stored grocery items */
let groceries = JSON.parse(localStorage.getItem("data")) || [];
/** Adds/modifies grocery item in array through form input. Updates storage data and UI to reflect the change. */
const addOrUpdateItem = () => {
    // input validation
    if (!nameInput.value) {
        window.alert("Please add a name for the item");
        return;
    }
    const dateFormat = /\d{4}-\d{2}-\d{2}/;
    if (!dateFormat.test(dateInput.value)) {
        window.alert("Please fill in the date properly");
        return;
    }
    // add new item to array if it doesn't exist
    const itemIndex = groceries.findIndex((item) => item.name == nameInput.value);
    const newItem = {
        name: nameInput.value,
        expiryDate: dateInput.value
    };
    if (itemIndex === -1) {
        groceries.push(newItem);
    }
    else {
        // warning before overwriting existing item
        if (groceries[itemIndex].name === nameInput.value) {
            const editItemInstead = confirm(`"${nameInput.value}" item already exists. Click OK to overwrite the existing item.`);
            if (!editItemInstead) {
                return;
            }
        }
        groceries[itemIndex] = newItem;
    }
    localStorage.setItem("data", JSON.stringify(groceries));
    updateGroceryList();
    reset();
}
/** 
 * Opens the form to edit selected grocery item details.
 * @param buttonEl The edit button of the item to edit
 */
const editItem = (buttonEl) => {
    const itemIndex = groceries.findIndex((item) => item.name == buttonEl.parentElement.parentElement.id);
    currentItem = groceries[itemIndex];

    nameInput.value = currentItem.name;
    dateInput.value = currentItem.expiryDate;

    itemEditorWindow.classList.remove("hidden");
}
/** 
 * Deletes the item selected from the array, UI, and stored data 
 * @param buttonEl The delete button of the item to delete
 */
const deleteItem = (buttonEl) => {
    const itemIndex = groceries.findIndex((item) => item.name == buttonEl.parentElement.parentElement.id);
    buttonEl.parentElement.parentElement.remove();
    groceries.splice(itemIndex,1);
    localStorage.setItem("data", JSON.stringify(groceries));
}
/** Updates the UI table of groceries based on the array */
const updateGroceryList = () => {
    // sort grocery array by soonest expiry day
    const localOffset = new Date().getTimezoneOffset() * 60000; // in minutes, converted to ms
    const msPerDay = 60*60*24*1000;
    groceries.sort((a,b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    // delete old table to make new one
    table.innerHTML = "";
    groceries.forEach(({name,expiryDate}) => {
        // expiry date in local time
        const date = new Date(expiryDate);
        date.setTime(date.getTime() + localOffset);
        const daysLeft = Math.ceil((date - new Date())/msPerDay);
        // change text based on the number of days left
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
        // new table row with grocery item
        table.innerHTML += `
        <tr id="${name}">
            <th>${name}:</th>
            <td>${expiryText}</td>
            <td><i class="fa-regular fa-pen-to-square" onclick="editItem(this)"></i></td>
            <td><i class="fa-regular fa-trash-can" onclick="deleteItem(this)"></i></td>
        </tr>
        `;
    });
}
/** Resets the input form and hides it */
const reset = () => {
    setItemEditorWindowVisible(false);
    nameInput.value = "";
    dateInput.value = "";
    currentItem = {};
}
/** Hide or show the form to edit grocery items
 * @param show If set to true, it makes the window visible. This is the default setting.
 */
const setItemEditorWindowVisible = (visible = true) => {
    visible ? itemEditorWindow.classList.remove("hidden") : itemEditorWindow.classList.add("hidden");
}

// load initial table if there are items in the grocery list

if (groceries.length) {
    updateGroceryList();
}

// button click event listeners
addItemBtn.addEventListener("click", () => { setItemEditorWindowVisible(true); })
cancelBtn.addEventListener("click", reset)
confirmBtn.addEventListener("click", addOrUpdateItem);
csvImportBtn.addEventListener("click", () => {
    csvImportBtn.classList.add("hidden");
    uploadCsvWindow.classList.remove("hidden");
    console.log(`import button is ${csvImportBtn.classList.contains("hidden") ? "hidden" : "visible"}`);
    console.log(`upload window is ${uploadCsvWindow.classList.contains("hidden") ? "hidden" : "visible"}`);
});
cancelUploadBtn.addEventListener("click", () => {
    csvImportBtn.classList.remove("hidden");
    uploadCsvWindow.classList.add("hidden");
    console.log(`import button is ${csvImportBtn.classList.contains("hidden") ? "hidden" : "visible"}`);
    console.log(`upload window is ${uploadCsvWindow.classList.contains("hidden") ? "hidden" : "visible"}`);
});
submitCsvBtn.addEventListener("click", e => {
    const fileInput = csvFile.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        // ovewrite groceries
        groceries = [];
        e.target.result.split("\r\n").map(item => {
            if (!item) return; // ignore blank lines
            const vals = item.split(/,|;|\|| /); // split by all delimiters 
            groceries.push({ name: vals[0], expiryDate: vals[1] });
        });
        // update UI and data in storage
        updateGroceryList();
        localStorage.setItem("data", JSON.stringify(groceries));
    };
    reader.readAsText(fileInput);
    csvImportBtn.classList.remove("hidden");
    uploadCsvWindow.classList.add("hidden");
});