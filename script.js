document.addEventListener('DOMContentLoaded', function () {
    // Function to generate a random password
    function generatePassword() {
        var length = parseInt(document.getElementById('length').value);
        var includeUpperCase = document.getElementById('includeUpperCase').checked;
        var includeNumbers = document.getElementById('includeNumbers').checked;
        var includeSpecialCharacters = document.getElementById('includeSpecialCharacters').checked;
        var excludeDuplicates = document.getElementById('excludeDuplicates').checked;

        var lowerCase = "abcdefghijklmnopqrstuvwxyz";
        var upperCase = includeUpperCase ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "";
        var numbers = includeNumbers ? "0123456789" : "";
        var specialCharacters = includeSpecialCharacters ? "!@#$%^&*()_-+={}[]|?/><" : "";

        var all = lowerCase + upperCase + numbers + specialCharacters;

        // Ensure at least one character from each selected group is included
        var password = lowerCase.charAt(Math.floor(Math.random() * lowerCase.length));

        if (includeUpperCase) {
            password += upperCase.charAt(Math.floor(Math.random() * upperCase.length));
        }

        if (includeNumbers) {
            password += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }

        if (includeSpecialCharacters) {
            password += specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length));
        }

        // Calculate the remaining length for the password
        var remainingLength = length - password.length;

        // Generate the rest of the password
        for (var i = 0; i < remainingLength; i++) {
            var charToAdd = all.charAt(Math.floor(Math.random() * all.length));

            // Exclude duplicates if the checkbox is checked
            if (excludeDuplicates && password.includes(charToAdd)) {
                i--; // Repeat the loop iteration
            } else {
                password += charToAdd;
            }
        }

        // Shuffle the password characters
        password = password.split('').sort(function () {
            return 0.5 - Math.random();
        }).join('');

        // Update the password field
        var passwordField = document.getElementById('password');
        passwordField.textContent = password;
    }

    // Function to copy content to clipboard
    function copyToClipboard(element) {
        var textarea = document.createElement('textarea');
        textarea.value = element.textContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    // Function to show copy notification
    function showCopyNotification() {
        var container = document.querySelector('.password-container');

        // Change the background color of the password field
        container.style.background = 'linear-gradient(135deg, #d12d9c, #60a1ef)';
        // Create and append the notification
        var notification = document.createElement('p');
        notification.innerHTML = 'Copied to clipboard!';
        notification.className = 'copy-notification';
        container.appendChild(notification);

        // Calculate the right position for the notification
        var notificationWidth = notification.offsetWidth;
        notification.style.right = (container.offsetWidth - notificationWidth) + 'px';

        // Reset background color and remove notification after 1.5 seconds
        setTimeout(function () {
            container.style.background = '#2c3e50'; // Reset to original color
            container.removeChild(notification);
            window.getSelection().removeAllRanges(); // Clear selection
        }, 1500); // Show the notification for 1.5 seconds (adjust as needed)
    }

    // Add event listener to update slider value and generate password in real-time
    var lengthSlider = document.getElementById('length');
    var lengthValue = document.getElementById('lengthValue');

    lengthSlider.addEventListener('input', function () {
        lengthValue.textContent = this.value;
        generatePassword();
    });

    // Add event listeners for checkboxes to generate password in real-time
    var checkboxes = document.querySelectorAll('.checkboxes input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            if (!sliderDisabled) {
                generatePassword();
            }
        });
    });

    // Add click event listener to copy password to clipboard
    var passwordField = document.querySelector('.password-container');
    var iconElement = document.querySelector('.password-icon');
    var sliderDisabled = false; // Variable to track slider status

    passwordField.addEventListener('click', function () {
        if (!sliderDisabled) {
            // Disable the slider during the animation
            lengthSlider.disabled = true;
            sliderDisabled = true;

            // Disable pointer events
            passwordField.style.pointerEvents = 'none';

            // Disable checkboxes during the animation
            checkboxes.forEach(function (checkbox) {
                checkbox.disabled = true;
            });

            copyToClipboard(document.getElementById('password'));
            showCopyNotification();

            // Hide the icon
            iconElement.style.display = 'none';

            // After 1.5 seconds, show the icon again and enable slider, checkboxes, and pointer events
            setTimeout(function () {
                iconElement.style.display = 'block';
                passwordField.style.pointerEvents = 'auto';
                lengthSlider.disabled = false;
                sliderDisabled = false;

                // Enable checkboxes after the animation
                checkboxes.forEach(function (checkbox) {
                    checkbox.disabled = false;
                });
            }, 1500);
        }
    });

    // Call generatePassword initially
    generatePassword();
});
