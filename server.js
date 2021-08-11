const Obserser = require("./observer");
const obserser = new Obserser("testFolder", "./newLogs/", "./logs");

obserser.on("file-added", (log) => {
	console.log(log.message);
});

obserser.watchFolder();
