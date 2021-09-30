function UpdateHiddenValue(changedSelect, givenhiddenInput) {
    let select = document.getElementById(changedSelect)
    let data = select.options[select.selectedIndex].value
    let hiddenInput = document.getElementById(givenhiddenInput)
    hiddenInput.setAttribute('value', data)
}


function filterByOrderID() {
    // Declare variables
    let input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("user_input");
    filter = input.value.trim().toUpperCase();
    table = document.getElementById("orders_table");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}