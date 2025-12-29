    const frame = document.getElementById('frame');
    const inner = document.getElementById('inner');
    const root = document.documentElement;
    
    // Inputs
    const thickSlider = document.getElementById('thickSlider');
    const padVSlider = document.getElementById('padVSlider');
    const padHSlider = document.getElementById('padHSlider');
    const customDimsBox = document.getElementById('custom-dims');


    const picSizeHVal = document.getElementById('picHSlider');
    const picSizeWVal = document.getElementById('picWSlider');

    
    // Value Displays
    const thickVal = document.getElementById('thickVal');
    const padVVal = document.getElementById('padVVal');
    const padHVal = document.getElementById('padHVal');

    // Custome Picture Size
    const picSizeField = document.getElementById('custom-pic-dims');
    const picHVal = document.getElementById('picHVal');
    const picWVal = document.getElementById('picWVal');



    const picSizeRadios = document.querySelectorAll('input[name="picSize"]');

    const sizeRadios = document.querySelectorAll('input[name="size"]');
    const styleRadios = document.querySelectorAll('input[name="style"]');
    const customColorPicker = document.getElementById('customColorPicker');
    const matRadios = document.querySelectorAll('input[name="mat"]');

// Image Upload Logic
    const imgUpload = document.getElementById('imgUpload');
    const banzukeDiv = document.querySelector('.banzuke');

    imgUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                // Apply image as background so div dimensions are strictly respected
                banzukeDiv.style.backgroundImage = `url(${event.target.result})`;
                // Add class to hide the CSS fake text
                banzukeDiv.classList.add('has-image');
            }
            reader.readAsDataURL(file);
        }
    });

    customColorPicker.addEventListener('input', function() {
        const customColor = customColorPicker.value;
        root.style.setProperty('--frame-custom', customColor);
        updateVisuals();
    });

    styleRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'style-custom') {
                customColorPicker.disabled = false;
                customColorPicker.style.visibility = 'visible';
                customColorPicker.style.display = 'block';
            } else {
                customColorPicker.disabled = true;
                customColorPicker.style.visibility = 'hidden';
                customColorPicker.style.display = 'none';
            }
        });
    });

    picSizeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'pic-size-custom') {
                picSizeField.style.visibility = 'visible';
                picSizeField.style.display = 'block';
            } else {
                picSizeField.style.visibility = 'collapse';
                picSizeField.style.display = 'none';
            }
        });
    });
	
    function updateVisuals() {
        // 1. Get Values
        const sizeVal = document.querySelector('input[name="size"]:checked').value;
        const styleVal = document.querySelector('input[name="style"]:checked').value;
        const matVal = document.querySelector('input[name="mat"]:checked').value;

        const picSizeVal = document.querySelector('input[name="picSize"]:checked').value;

        // Banzuke Size is fixed: 44cm x 58cm
        var paperW = 44;
        var paperH = 58;
        
        // 2. Update Classes
        frame.className = `frame-container ${sizeVal} ${styleVal} ${matVal}`;

        // Update Picture Size if Custom
        if (picSizeVal === 'pic-size-custom') {
            const customPicH = parseFloat(picSizeHVal.value);
            const customPicW = parseFloat(picSizeWVal.value);

            root.style.setProperty('--banzuke-h', customPicH + '0px');
            root.style.setProperty('--banzuke-w', customPicW + '0px');
            paperW = customPicW;
            paperH = customPicH;

            console.log(`Custom Picture Size: ${customPicW} cm x ${customPicH} cm`);
            picHVal.textContent = customPicH.toFixed(1) + ' cm';
            picWVal.textContent = customPicW.toFixed(1) + ' cm';
        }

        if (picSizeVal !== 'pic-size-custom') {
            root.style.setProperty('--banzuke-h', '580px');
            root.style.setProperty('--banzuke-w', '440px');
            paperW = 44;
            paperH = 58;
        }

        // 3. Toggle Custom Controls
        if (sizeVal === 'size-custom') {
            customDimsBox.style.display = 'block';
        } else {
            customDimsBox.style.display = 'none';
        }

        // 4. Update CSS Variables & Slider Labels (Visuals)
        const thicknessCm = (thickSlider.value / 10);
        root.style.setProperty('--f-thick', thickSlider.value + 'px');
        thickVal.textContent = thicknessCm.toFixed(1) + ' cm';

        const customPadVCm = (padVSlider.value / 10);
        root.style.setProperty('--c-pad-v', padVSlider.value + 'px');
        padVVal.textContent = customPadVCm.toFixed(1) + ' cm';

        const customPadHCm = (padHSlider.value / 10);
        root.style.setProperty('--c-pad-h', padHSlider.value + 'px');
        padHVal.textContent = customPadHCm.toFixed(1) + ' cm';

        // 5. CALCULATE SUMMARY DIMENSIONS
        let matV_cm, matH_cm, glassW, glassH;

        if (sizeVal === 'size-custom') {
            matV_cm = customPadVCm;
            matH_cm = customPadHCm;
            glassW = paperW + (matH_cm * 2);
            glassH = paperH + (matV_cm * 2);
        } else if (sizeVal === 'size-5070') {
            // Standard 50x70 Frame
            glassW = 50;
            glassH = 70;
            matH_cm = (glassW - paperW) / 2; // (50-44)/2 = 3.0
            matV_cm = (glassH - paperH) / 2; // (70-58)/2 = 6.0
        } else if (sizeVal === 'size-a1') {
            // Standard A1 Frame (59.4 x 84.1)
            glassW = 59.4;
            glassH = 84.1;
            matH_cm = (glassW - paperW) / 2; // 7.7
            matV_cm = (glassH - paperH) / 2; // 13.05
        }

        // Total Outer Frame Size = Glass Size + (Frame Thickness * 2)
        const totalOuterW = glassW + (thicknessCm * 2);
        const totalOuterH = glassH + (thicknessCm * 2);

        // Update Summary Text
        document.getElementById('sum-mat-v').textContent = matV_cm.toFixed(1);
        document.getElementById('sum-mat-h').textContent = matH_cm.toFixed(1);
        document.getElementById('sum-frame-w').textContent = totalOuterW.toFixed(1);
        document.getElementById('sum-frame-h').textContent = totalOuterH.toFixed(1);
    }

    // Event Listeners

    picSizeHVal.addEventListener('input', updateVisuals);
    picSizeWVal.addEventListener('input', updateVisuals);

    thickSlider.addEventListener('input', updateVisuals);
    padVSlider.addEventListener('input', updateVisuals);
    padHSlider.addEventListener('input', updateVisuals);
    
    [...sizeRadios, ...styleRadios, ...matRadios, ...picSizeRadios].forEach(input => {
        input.addEventListener('change', updateVisuals);
    });

    // Initialize
    updateVisuals();