# U68D-LocalTools

## Description

A NodeJS app which provides series of handy tools developed with love by Unknown68D. 💙

## Requirements For Full Usage

- Windows (For now)
- [NodeJS + NPM](https://nodejs.org/en/) (To run the application)
- [Python](https://www.python.org) (To run local scripts on your machine. The latest version is always recommended.)
- [eyeD3](https://eyed3.readthedocs.io/en/latest/installation.html) (A Python library for working with audio files. See below for more details.)
- [moviepy](https://pypi.org/project/moviepy/) (A Python library used for combining audio and thumbnails into an mp4 file. See below for more details.)
- [Microsoft PowerToys](https://github.com/microsoft/PowerToys/releases/tag/v0.64.1) (Specifically, the **[PowerRename](#Auto-Rename-Generated-Files)** feature to remove invalid characters in file names.)
- [FFMPEG](https://www.ffmpeg.org) ("A complete, cross-platform solution to record, convert and stream audio and video." ~ [ffmpeg.org](https://www.ffmpeg.org))

## Recommendations

- Setting Execution Policy to **RemoteSigned** or **Unrestricted** on Windows (At your own risk).

-> By default, .ps1 files may not run for security reasons. A safer alternative is to open each script and copy/paste the contents in a terminal to execute them manually if you don't want to change the execution policy. It's always good practice to read the scripts you're executing beforehand anyways. 🙂

-> If you do want to change the execution policy, I'd recommended [this article](https://techdirectarchive.com/2020/02/04/how-to-set-execution-policy/) to learn more.

- Ensure that the names of the files you are using are not too long. There is a character limit for Windows file paths, so if certain scripts don't run, consider decreasing the number of characters in the file path.

## Dev Resources

- [Auto PY to EXE](https://pypi.org/project/auto-py-to-exe/)
-> Useful for development purposes, as creating a .exe file from a .py script is very easy with this converter.

## Setup Instructions

1. Clone or download the .zip and save the project to a location of your choice. 
2. Install all requirements listed above.
3. Run the **npm-install.ps1** or the **npm-install** from the command line to download all the dependencies for the server.
4. Run the .exe, .ps1 OR .py for **Start-U68D-LocalTools** to start the server.
5. Navigate to **[http://localhost:680](http://localhost:680)** to start using the interface.

## Features

- [YT-DLP GUI](#YT-DLP-GUI)
- [Batch Change File Extension](#Batch-Change-File-Extension)
- [Change Letter Case](#Change-Letter-Case)

---

## YT-DLP GUI

A visual interface that generates a customized Powershell script that will download every video's data specified by the user, made possible by [yt-dlp](https://github.com/yt-dlp/yt-dlp), which comes included in this application! The video data you can download includes any combination of the following:

- Video and Audio (Any quality up to 1080p as a .mp4)
- Audio Only (.mp3)
- Thumbnail (.png)
- Subtitles (.vtt)

After generating **~DownloadFiles.ps1**, run it to download all of the videos and their data.

### Auto-Rename Generated Files

Some files that you download from yt-dlp will likely have invalid characters, which is inconvenient when using them as media files in other programs, including updating MP3 cover images. As such, the **PowerRename** utility comes in handy for batch renaming files. Follow the instructions to install and use the feature.

1. Download and install [Microsoft PowerToys](https://learn.microsoft.com/en-us/windows/powertoys/install), which includes **PowerRename** and many other useful utilities.
2. Go to **PowerToys Settings -> PowerRename** and ensure that it is enabled.
3. Go to the **~yt-dlp** folder, group by **Type** and select all media files (.mp4, .mp3, .png, .vtt).
4. Right click the selection. You should see a **PowerRename** option in the context menu. Click it to launch the program.
5. In the **Search for** textbox, enter the following regex expression to remove all non-ASCII characters: **\[^\x00-\x7F\]**
<!--
If you're viewing this file in an editor, copy these regular expressions instead to save time removing those pesky square-bracket protecting backslashes. :)
[^\x00-\x7F]
-->
6. Ensure that **Use regular expressions** and **Match all occurrences** are checked.
7. Leave the **Replace with** field empty, or replace with any character you'd like.
8. Ensure that in the **Apply to** dropdown menu, **Filename only** is selected.
9. There are three buttons to the right of the **Apply to** dropdown menu. Ensure that **Include files** is active.
10. Click **Apply** to rename all the selected files.

### Audio + Image to MP4

**NOTE:** Use **PowerRename** utility before using this feature to ensure generated script executes properly.

After generating .mp3 and .png files for each video, you can generate a script that will automatically combined both files into a .mp4 file with the push of a button! Run it and a python script will take care of the rest, courtesy of [moviepy](https://pypi.org/project/moviepy/).

### Updating MP3 Cover Images

**NOTE:** Use **PowerRename** utility before using this feature to ensure generated script executes properly.

For .mp3 files, if you also downloaded that corresponding video's thumbnail, you can also run the following two files to add all thumbnail images to their corresponding mp3 cover images. 

1. **~\[RUN-FIRST\]_CoverImage.exe** OR **~\[RUN-FIRST\]_CoverImage.py** (Will generate the script below)
2. **~\[RUN-SECOND\]_CoverImage.ps1** (Will add all images to all mp3 files)

This is useful for mp3 players to help you identify songs. You can also use a free program like [Mp3Tag](https://www.mp3tag.de/en/index.html) to verify that the album image was added successfully.

### Append Rename Files

A visual interface that allows you to append text to the beginning of a file in all folders specified. This is useful for programs where you would like to organize files based on file naming conventions. You can also include subfolders! Simply provide the folders to check and the text to append, then click 'Rename Files' to rename them all.

## Loop MP4

A visual interface that allows you to loop MP4 files any number of times.

**NOTE:** All MP4 files must be copied to the **~loopMP4** folder before running the script.

## Batch Change File Extension

A visual interface that allows you to change various file extensions to a user-defined one in all folders specified. You can enter as many extensions as you'd like and replace them all with a specific extension. (Ex. Replace jpg, jpeg, and jfif with png.) You can also include subfolders! Simply provide the folders to check and the text to append, then click 'Rename Files' to rename them all.

## Change Letter Case

A visual interface for changing the case of text, including the following:

- All uppercase
- All lowercase
- Invert Case
- Randomize Case (LIKE THis OR lIkE ThIs OR likE tHIS)

## Credits

- Back to Top Button courtesy of [Code Boxx](https://code-boxx.com/html-scroll-to-top-button/)