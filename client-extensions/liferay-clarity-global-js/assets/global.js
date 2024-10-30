document.addEventListener("DOMContentLoaded", function() {
    const settings = {
        fontSize: parseFloat(getComputedStyle(document.documentElement).fontSize),
        isGrayscale: false
    };
    
    const controlPanel = document.createElement("div");
    controlPanel.style.position = "fixed";
    controlPanel.style.bottom = "20px";
    controlPanel.style.right = "20px";
    controlPanel.style.backgroundColor = "#fff";
    controlPanel.style.border = "1px solid #ccc";
    controlPanel.style.borderRadius = "4px";
    controlPanel.style.padding = "10px";
    controlPanel.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";

    // Font size label and input
    const fontSizeLabel = document.createElement("label");
    fontSizeLabel.textContent = "Font Size: ";
    const fontSizeInput = document.createElement("input");
    fontSizeInput.type = "range";
    fontSizeInput.min = "12";
    fontSizeInput.max = "24";
    fontSizeInput.value = settings.fontSize;
    fontSizeInput.style.margin = "5px";
    fontSizeLabel.appendChild(fontSizeInput);
    
    fontSizeInput.addEventListener("input", function() {
        const newSize = `${this.value}px`;
        document.documentElement.style.fontSize = newSize;
        settings.fontSize = this.value;
    });

    // Grayscale label and checkbox
    const grayscaleLabel = document.createElement("label");
    grayscaleLabel.textContent = "Grayscale: ";
    const grayscaleCheckbox = document.createElement("input");
    grayscaleCheckbox.type = "checkbox";
    grayscaleLabel.appendChild(grayscaleCheckbox);
    
    grayscaleCheckbox.addEventListener("change", function() {
        if (this.checked) {
            document.documentElement.style.filter = "grayscale(100%)";
            settings.isGrayscale = true;
        } else {
            document.documentElement.style.filter = "none";
            settings.isGrayscale = false;
        }
    });

    // Add elements to control panel
    controlPanel.appendChild(fontSizeLabel);
    controlPanel.appendChild(document.createElement("br"));
    controlPanel.appendChild(grayscaleLabel);

    // Append control panel to body
    document.body.appendChild(controlPanel);
});
