function updateHiddenInputValue(actualInputID, hiddenInputID) {
    const actualInput = document.getElementById(actualInputID)
    const hiddenInput = document.getElementById(hiddenInputID)

    hiddenInput.setAttribute('value', actualInput.value)
}