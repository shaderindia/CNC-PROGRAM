document.getElementById('cnc-form').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form inputs
    const programNumber = document.getElementById('program-number').value;
    const toolNumber = document.getElementById('tool-number').value;
    const feedRate = document.getElementById('feed-rate').value;
    const spindleSpeed = document.getElementById('spindle-speed').value;
    const coordinates = document.getElementById('coordinates').value;

    // Generate G-code
    const gcode = `
O${programNumber} (Program Start)
T${toolNumber} M06 (Tool Change)
G21 (Set units to mm)
S${spindleSpeed} M03 (Set spindle speed and start clockwise rotation)
G90 (Absolute positioning)
G01 ${coordinates} F${feedRate} (Linear move to coordinates with feed rate)
M30 (Program End)
    `;

    // Show G-code in the output section
    const outputSection = document.getElementById('output-section');
    const gcodeOutput = document.getElementById('gcode-output');
    gcodeOutput.textContent = gcode;
    outputSection.classList.remove('hidden');

    // Download the G-code as a file
    document.getElementById('download-btn').addEventListener('click', function () {
        const blob = new Blob([gcode], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `program_${programNumber}.txt`;
        link.click();
    });
});
