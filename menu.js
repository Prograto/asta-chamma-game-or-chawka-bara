function toggleDropdown() {
    var dropdownContent = document.getElementById('dropdownContent');
    if (dropdownContent.style.display === 'block') {
      dropdownContent.style.display = 'none';
    } else {
      dropdownContent.style.display = 'block';
    }
  }
  
  function removeAllInputs() {
    var existingInputs = document.querySelectorAll('.player-inputs');
    existingInputs.forEach(function(input) {
      input.remove();
    });
  }
  
  function createInput(num) {
    removeAllInputs(); 
    var container = document.createElement('div');
    container.className = 'player-inputs';
    for (var i = 0; i < num; i++) {
      var inputContainer = document.createElement('div');
      inputContainer.className = 'input-container';
  
      //player name input
      var input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Enter Player ' + (i + 1) + ' Name';
      inputContainer.appendChild(input);
  
      //color picker input
      var colorPicker = document.createElement('input');
      colorPicker.type = 'color';
      colorPicker.id = 'colorPicker' + (i + 1);
      colorPicker.value = getDefaultColor(i);
      inputContainer.appendChild(colorPicker);
  
      container.appendChild(inputContainer);
    }
    document.body.appendChild(container);
    // Hiding the dropdown content after creating inputs
    document.getElementById('dropdownContent').style.display = 'none';
  }
  
  function getDefaultColor(index) {
    // Setting default colors to red, green, blue, and black
    var colors = ['#ff0000', '#00ff00', '#0000ff', '#000000'];
    return colors[index % colors.length];
  }
  
  function printPlayerDetails() {
    var playerInputs = document.querySelectorAll('.player-inputs input[type="text"]');
    var colorInputs = document.querySelectorAll('.player-inputs input[type="color"]');
    var playerDetails = [];

    // Check if any player name input is empty
    var anyEmptyName = false;
    playerInputs.forEach(function(input, index) {
        if (input.value.trim() === '') {
            anyEmptyName = true;
        } else {
            playerDetails.push({
                name: input.value,
                color: colorInputs[index].value
            });
        }
    });

    // Check if no player names are filled
    if (playerDetails.length === 0) {
        showErrorMessage('Please fill in at least one player name.');
        return;
    }

    // Check if all player names are filled
    if (anyEmptyName) {
        showErrorMessage('Please fill in all player names.');
        return; 
    }

    // Store player details in local storage
    localStorage.setItem('playerDetails', JSON.stringify(playerDetails));

    window.location.href = 'game.html';
}

function showErrorMessage(message) {
    var errorMessage = document.createElement('div');
    errorMessage.textContent = message;
    errorMessage.style.position = 'absolute';
    errorMessage.style.top = 'calc(80% - 50px)';
    errorMessage.style.left = '50%';
    errorMessage.style.transform = 'translate(-50%, -50%)';
    errorMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
    errorMessage.style.color = 'white';
    errorMessage.style.padding = '10px 20px';
    errorMessage.style.borderRadius = '10px';
    errorMessage.style.zIndex = '1';
    document.body.appendChild(errorMessage);

    setTimeout(function() {
        errorMessage.remove();
    }, 2000);
}



