function filterByProductName() {

    // Declare variables
    let input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("user_input");
    filter = input.value.trim().toUpperCase();
    table = document.getElementById("products_table");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
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


function updateHiddenInput(shownInput, hiddenInput) {
    const data = document.getElementById(shownInput).value
    const target = document.getElementById(hiddenInput)
    target.setAttribute('value', data)
}