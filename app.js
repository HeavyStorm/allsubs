// IMPORTS /////////////////////////////////////////////////////////////////////
const OpenSubtitles = require('./open-subtitles');
const download = require('./download-promise');
const findFilesInDir = require('./find-files-in-dir');
const path = require('path');

// DECLARATIONS ////////////////////////////////////////////////////////////////
/**
 * 
 * @param {String} file The path to the movie file.
 */
function searchSubtitleFor(file) {
    return OpenSubtitles
        .search({ path: file })
        .then(subtitles => {
            for (let lang of ['ptbr', 'pt-br', 'pt', 'en']) {
                if (subtitles[lang]) {
                    console.log(`Found lang ${lang} for ${file}!`);
                    return { file: file, subtitle: subtitles[lang] };
                }
            }

            console.warn(`No preferred subtitles found. Only found ${Object.keys(subtitles)}.`);
            throw new Error(`No subtitles found for file ${file}.`);
        })
        .catch(err => {
            console.error(`Error looking subtitle for ${file}.`, err);
            throw err;
        });
}

function downloadSubtitleFor(file, subtitle) {
    let fullpath = file.replace(/.avi$/, ".srt");

    let directory = path.dirname(fullpath);
    let filename = path.basename(fullpath);

    return download(subtitle.url, { directory, filename })
        .then(() => console.log(`Downloaded subtitle for ${file}.`))
        .catch(err => {
            console.error(`Error downloading subtitle for ${file}. Url: ${subtitle.url}.`, err);
            throw err;
        });
}

// MAIN ////////////////////////////////////////////////////////////////////////

// if (process.argv.length <= 2) {
//     console.log("Usage: " + __filename + " path/to/directory");
//     process.exit(-1);
// }


let files = findFilesInDir("D:\\Downloads\\Series", ".avi", true);

let promises = [];

for (let file of files) {
    let promise = searchSubtitleFor(file)
        .then(result => {
            return downloadSubtitleFor(result.file, result.subtitle);
        })
        // Swallow error.
        .catch(err => console.error(`Error processing ${file}.`, err));

    promises.push(promise);
}

Promise
    .all(promises)
    .then(() => {
        console.log("Finished");
        process.exit(0);
    })
    .catch(err => {
        console.error("Fatal error.", err);
        process.exit(1);
    });
