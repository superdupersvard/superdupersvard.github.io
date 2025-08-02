import { clearExportArea } from './export_area.js';

var exportBtn = document.getElementById('export-btn');
var exportConfig = document.getElementById('export-config');
var exportMode = false;

exportBtn.addEventListener('click', function() {
    exportMode = !exportMode;
    if (exportMode) {
        exportBtn.classList.add('pressed');
        exportConfig.style.display = 'flex';
    } else {
        exportBtn.classList.remove('pressed');
        exportConfig.style.display = 'none';
        clearExportArea();
    }
});

export function isExportMode() {
    return exportMode;
}
