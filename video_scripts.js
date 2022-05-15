const scenesNumber = 22;
const sceneTimestamp = [0, 35, 122, 256, 283, 369, 404, 530, 579, 631, 669,
  816, 885, 991, 1038, 1070, 1105, 1160, 1214, 1267, 1317, 1325];

const sceneToTimestamp = new Map();
const seinfeld = videojs('#seinfeld');

let input = document.getElementById('scene_selector');

for(let i = 0; i < sceneTimestamp.length; i++)
{
  sceneToTimestamp.set(i+1, sceneTimestamp[i]);
}


input.addEventListener('input', function (evt) {
  seinfeld.currentTime(sceneToTimestamp.get(parseInt(this.value)));
})
