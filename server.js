//--BEGINNING OF APP INITIALIZATIONS--//

const express = require(`express`);
const app = express();
const fs = require(`fs`);

app.set(`view engine`, `ejs`)
app.use(`/images/`, express.static(`./images`))
app.use(express.urlencoded({ extended: true }));

//--END OF APP INITIALIZATIONS--//

//--BEGINNING OF VARIABLE INITIALIZATIONS--//
const finalLine = `\necho 'COMPLETE!'`
const YTDLP_Path = `~yt-dlp`
const LoopMP4_Path = `~loopMP4`
//--END OF VARIABLE INITIALIZATIONS--//

//--BEGINNING OF HELPER FUNCTIONS--//

//Small Functions

function makeDir(dirPath) { if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath) }

const dirPathsToMake = [`~loopMP4`]
for (dirPath of dirPathsToMake) makeDir(dirPath)

function scriptSuccessMessage(path, fileName) {
    return `
    <body style='font-family: arial; word-wrap: break-word'>
        <h1 style='color:green'>Success!</h1>
        <p>Navigate to the <b>${path}</b> folder in the project to run the <b>${fileName}</b> script.
    </body>
    `
}

//Large Functions

function getSubFolders(folderPathList) {
    let foundFolder = false
    for (folderPath of folderPathList) {
        let subItemsList
        try {
            subItemsList = fs.readdirSync(folderPath)
            subItemsPathList = []
            for (sub of subItemsList) {
                subItemsPathList.push(`${folderPath}\\${sub}`)
            }
            foundFolder = false
            for (i in subItemsList) {
                try {
                    fs.readdirSync(`${folderPath}\\${subItemsList[i]}`)
                    foundFolder = true
                    folderPathList.push(subItemsPathList[i])
                } catch { }
            }
            if (foundFolder) getSubFolders(subItemsPathList)
        } catch { }
    }
    return folderPathList
}

function writeFileToServer(contents, filePath) {
    fs.writeFileSync(filePath, contents, err => {
        if (err) {
            fs.appendFileSync(filePath, contents, err => {
                if (err) res.status(500).send(err)
            })
        }
    })
    return filePath
}

function ytdlpHelper(Thumbnail, Subtitles) {
    let str = ``
    if (Thumbnail) str += `--write-thumbnail --convert-thumbnails png `
    if (Subtitles) str += `--write-subs --sub-langs 'en.*,ja' `
    return str
}

//--END OF HELPER FUNCTIONS--//

//---BEGINNING OF ROUTING---//

app.route(`/`)
    .get((req, res) => {
        res.render(`index`)
    })

app.route(`/YT-DLP_GUI`)
    .post((req, res) => {
        let URLs = req.body.URLs.split(`\r\n`)

        let Video = req.body.Video
        let Audio = req.body.Audio
        let Thumbnail = req.body.Thumbnail
        let Subtitles = req.body.Subtitles

        let VidRes = req.body.VideoResolution

        let Channel = req.body.Channel

        //console.log(req.body)

        if (!URLs || !YTDLP_Path || (!Video && !Audio && !Thumbnail && !Subtitles)) res.sendStatus(204)
        else {
            let baseStr = `./~yt-dlp -o '`
            if (Channel) baseStr += `%(uploader)s ~ `
            baseStr += `%(title)s.%(ext)s'`

            let commandStr = ``

            for (URL of URLs) {
                if (Video) {
                    commandStr += `${baseStr} '${URL}' -f bestvideo[height=${VidRes}][ext=mp4]+bestaudio/best[height=${VidRes}]/best[ext=mp4]/best --embed-chapters --remux-video mp4 ${ytdlpHelper(Thumbnail, Subtitles)}\n `
                }

                if (Audio) {
                    commandStr += `${baseStr} '${URL}' -x --audio-format mp3 `
                    if (!Video) commandStr += `${ytdlpHelper(Thumbnail, Subtitles)} `
                    commandStr += `\n`
                }

                if (!(Video || Audio)) {
                    commandStr += `${baseStr} '${URL}' ${ytdlpHelper(Thumbnail, Subtitles)} --max-filesize 0.001k\n`
                }
            }

            let fileName = `~DownloadFiles.ps1`
            writeFileToServer(`${commandStr}${finalLine}`, `${YTDLP_Path}/${fileName}`)
            res.send(scriptSuccessMessage(YTDLP_Path, fileName))
        }
    })

    app.route(`/AudioAndImageToMP4`)
    .get((req, res) => {
        let items = fs.readdirSync(`~yt-dlp`)
        let commandStr = ``
        
        for (item of items) {
            if (item.endsWith(`.mp3`)) {
                mp3Item = item
                pngItem = item.replaceAll(`.mp3`, `.png`)
                itemNoExt = item
                itemNoExt = itemNoExt.replaceAll(`.mp3`, ``); itemNoExt = itemNoExt.replaceAll(`.png`, ``)

                commandStr += `python ~AudioAndImageToVid.py "${pngItem}" "${mp3Item}" "${itemNoExt}.mp4"\n`
            }
        }

        const fileName = `~AudioAndImageToVid.ps1`
        writeFileToServer(`${commandStr}${finalLine}`, `${YTDLP_Path}/${fileName}`)
        res.send(scriptSuccessMessage(YTDLP_Path, fileName))
    })

    app.route(`/LoopMP4`)
    .post((req, res) => {
        let numLoops = req.body.NumLoops
        let commandStr = ``

        if (!numLoops) res.sendStatus(204)
        else {
            let folderItems = fs.readdirSync(`~loopMP4`)
            for (item of folderItems) {
                if (item.endsWith(`.mp4`)) {
                    commandStr += `ffmpeg -stream_loop ${numLoops} -i "${item}" -c copy "${item.replaceAll(`.mp4`, ``)} (${numLoops} Loops).mp4"\n`
                }
            }
            
            const fileName = `~LoopMP4.ps1`
            writeFileToServer(`${commandStr}${finalLine}`, `${LoopMP4_Path}/${fileName}`)
            res.send(scriptSuccessMessage(LoopMP4_Path, fileName))
        }
    })

    app.route(`/AppendRename`)
    .post((req, res) => {
        let FolderPaths = req.body.FolderPaths
        let StringToAppend = req.body.StringToAppend
        let IncludeSubfolders = req.body.IncludeSubfolders

        if (!FolderPaths || !StringToAppend) res.sendStatus(204)
        else {
            let folderPathList = FolderPaths.split(`\r\n`)
            if (IncludeSubfolders) folderPathList = getSubFolders(folderPathList)

            for (folderPath of folderPathList) {
                let folderItems = fs.readdirSync(folderPath)
                for (item of folderItems) {
                    try {
                        fs.readdirSync(`${folderPath}/${item}`)
                    } catch {
                        if (!(item.startsWith(StringToAppend))) {
                            fs.renameSync(`${folderPath}/${item}`, `${folderPath}/${StringToAppend}${item}`)
                        }
                    }
                }
            }

            res.send(`<body style='font-family: arial; word-wrap: break-word'><h1 style='color:green'>Files Renamed!</h1><p>All files have been successfully renamed with <b>${StringToAppend}</b> appended to them.</p></body>`)
        }
    })

    app.route(`/BatchChangeFileExtension`)
    .post((req, res) => {
        let FolderPaths = req.body.FolderPaths
        let InputExtensions = req.body.InputExtensions
        let OutputExtension = req.body.OutputExtension
        let IncludeSubfolders = req.body.IncludeSubfolders
        if (!FolderPaths
            || !InputExtensions
            || !OutputExtension) res.sendStatus(204)
        else {
            let folderPathList = FolderPaths.split(`\r\n`)
            if (IncludeSubfolders) folderPathList = getSubFolders(folderPathList)
            let inputExtList = InputExtensions.split(`\r\n`)
            let outputExt = OutputExtension

            for (folderPath of folderPathList) {
                let folderItems = fs.readdirSync(folderPath)
                for (item of folderItems) {
                    for (inputExt of inputExtList) {
                        if (item.endsWith(inputExt)) {
                            fs.renameSync(`${folderPath}/${item}`, `${folderPath}/${item.replace(`.${inputExt}`, `.${outputExt}`)}`)
                        }
                    }
                }
            }

            res.send(`<body style='font-family: arial; word-wrap: break-word'><h1 style='color:green'>All File Extensions Changed!</h1><p>All files have been successfully converted to the <b>.${outputExt}</b> extension.</p></body>`)
        }
    })

app.route(`/ChangeCase`)
    .post((req, res) => {
        if (!req.body.TextToChange) res.sendStatus(204)
        else {
            let str = req.body.TextToChange
            let newStr = ''

            for (var i = 0; i < str.length; i++) {
                switch (req.body.SelectedOperation) {
                    case `Invert Case`:
                        if (str.charAt(i) === str.charAt(i).toUpperCase()) newStr += str.charAt(i).toLowerCase()
                        else newStr += str.charAt(i).toUpperCase()
                        break;
                    case `Randomize Case`:
                        randNum = Math.floor(Math.random() * 2)
                        if (randNum === 0) newStr += str.charAt(i).toLowerCase()
                        else newStr += str.charAt(i).toUpperCase()
                        break;
                }
            }
            res.send(`<body style='font-family: arial; word-wrap: break-word'><h1>Text Generated!</h1><p>${newStr}</p></body>`)
        }
    })

//---END OF ROUTING---//

const server = app.listen(process.env.PORT || 680, () => {
    if (process.env.PORT) console.log(`App Running at port ${server.address().port}.`)
    else console.log(`Local: http://localhost:${server.address().port}`)
})
