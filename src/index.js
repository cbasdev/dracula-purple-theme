import settings from '../.vscode/settings.json' assert { type: 'json' };
import dist from '../themes/Dracula Purple-color-theme.json' assert { type: 'json' };
import fs from 'fs'

const colorCustomizations =  settings["workbench.colorCustomizations"]
const tokenColorCustomizations = settings["editor.tokenColorCustomizations"].textMateRules


dist.colors = colorCustomizations
dist.tokenColors = tokenColorCustomizations

fs.writeFile('./themes/Dracula Purple-color-theme.json', JSON.stringify(dist), err => {
  console.log(err);
})
