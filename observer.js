const chokidar = require("chokidar");
const EventEmitter = require("events").EventEmitter;
const fsExtra = require("fs-extra");

class Observer extends EventEmitter {
	folderObserved = "./";
	moveToFolder = "./";
	logPath = "./";

	//THE DEFAULT OBSERVED FOLDER AND THE FOLDER THAT THE NEW FILE WILL BE MOVED WILL
	// BE THE CURRENT FOLDER, IF NOT PROVIDED

	constructor(folderObserved, moveToFolder, logPath) {
		super();
		this.folderObserved = folderObserved;
		this.moveToFolder = moveToFolder;
		this.logPath = logPath;
	}

	watchFolder() {
		try {
			if (!fsExtra.pathExistsSync(this.folderObserved))
				throw `Esse diretório não existe`;

			console.log(
				`[${new Date().toLocaleString()}] Watching for folder changes on: ${
					this.folderObserved
				}`
			);

			const watcher = chokidar.watch(this.folderObserved, {
				persistent: true,
			});

			watcher.on("add", (path, stats) => {
				let fileName = path.split("/").pop();

				let newFileLogEntry = `O arquivo ${fileName} foi adicionado em ${new Date().toLocaleString()} \r\n`;

        this.writeInLog(newFileLogEntry);

				fsExtra.copySync(path, this.moveToFolder + fileName);

				let movedFileLogEntry = `O arquivo ${fileName} foi movido para ${
					this.moveToFolder
          } em ${new Date().toLocaleString()} \r\n`;
        
        this.writeInLog(movedFileLogEntry);
			});
		} catch (error) {
			fsExtra.outputFileSync(this.logPath, "ERROR: " + ERROR + "\r\n");
		}
	}

	writeInLog(entry) {
		let log = this.newLogFile();
    fsExtra.ensureFileSync(log);
		const CreateFiles = fsExtra.createWriteStream(log, {
		  flags: 'a' //flags: 'a' preserved old data
		})

		  CreateFiles.write(entry + '\r') //'\r\n at the end of each value
	}

	newLogFile() {
		return `${this.logPath}/log_entries-${new Date()
			.toLocaleString()
			.split(",")[0]
			.split("/")
			.reverse()
			.join("-")}.log`;
	}
}

module.exports = Observer;
