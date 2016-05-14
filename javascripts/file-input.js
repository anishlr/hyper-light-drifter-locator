/*
  By Osvaldas Valutis, www.osvaldas.info
  Available for use under the MIT License
*/
'use strict';

var SAVE_COLLECTIBLES_IDENTIFIER = 'cl'
var SAVE_GEARBIT_FIELD_ID = "0="
var SAVE_COLLECTIBLES_FIELD_DELIMITER = ">"
var SAVE_GEARBIT_FIELD_DELIMITER = "&"

;
(function(document, window, index) {
    var inputs = document.querySelectorAll('.inputFile');
    Array.prototype.forEach.call(inputs, function(input) {
        var label = input.nextElementSibling,
            labelVal = label.innerHTML;

        input.addEventListener('change', function(e) {
            var fileName = '';
            fileName = e.target.value.split('\\').pop();

            if (fileName)
                label.querySelector('span').innerHTML = fileName;
            else
                label.innerHTML = labelVal;

            // There should only be one file since the input element doesn't allow for selecting multiple files
            var selectedFile = this.files[0];

            if (selectedFile) {
                var reader = new FileReader();
                reader.onload = parseSaveContents;
                reader.readAsText(selectedFile);
            }
        });

        // Firefox bug fix
        input.addEventListener('focus', function() {
            input.classList.add('has-focus');
        });
        input.addEventListener('blur', function() {
            input.classList.remove('has-focus');
        });
    });
}(document, window, 0));

function parseSaveContents(e) {
    var decodedSave = window.atob(e.target.result);
    var nullTerminatedSave = '{"' + decodedSave.substring(decodedSave.indexOf(SAVE_COLLECTIBLES_IDENTIFIER), decodedSave.length);

    // Remove the trailing null terminator
    var saveString = nullTerminatedSave.toString().replace(/\0/g, "");

    try {
        var save = JSON.parse(saveString);
    } catch (error) {
        alert("Invalid save file.");
        return;
    }

    // The save will now contain information on many other things like number of deaths, enemies killed, etc. We need only the gearbit information
    var collectibles = save[SAVE_COLLECTIBLES_IDENTIFIER];
    var gearbitFieldStartIndex = collectibles.indexOf(SAVE_GEARBIT_FIELD_ID) + SAVE_GEARBIT_FIELD_ID.length;
    var gearbitString = collectibles.substring(gearbitFieldStartIndex, collectibles.indexOf(SAVE_COLLECTIBLES_FIELD_DELIMITER, gearbitFieldStartIndex));
    var gearbits = gearbitString.split(SAVE_GEARBIT_FIELD_DELIMITER);
}
