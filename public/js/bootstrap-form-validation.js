// JavaScript for disabling form submissions if there are invalid fields
(function() {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function(form) {
            form.addEventListener('submit', function(event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()

// (function() {
//     const availabletag = document.getElementById('availabletag')
//     const onsaletag = document.getElementById('onsaletag')
//     const outofstocktag = document.getElementById('outofstocktag')

//     if (outofstocktag.getAttribute('checked')) {
//         availabletag.setAttribute('checked', 'false')
//         onsaletag.setAttribute('checked', 'false')
//     } else if (availabletag.getAttribute('checked')) {
//         outofstocktag.setAttribute('checked', 'false')
//     }
// })()

// document.getElementsByClassName('form-check-input').addEventListener('change', (e) => {
//     if (outofstocktag.getAttribute('checked')) {
//         console.log('out of stock')
//     } else if (availabletag.getAttribute('checked')) {
//         console.log('available')
//     }
// })