const path = require('path');
const fs = require('fs');


/**
 * Find all files recursively in specific folder with specific extension, e.g:
 * findFilesInDir('./project/src', '.html') ==> ['./project/src/a.html','./project/src/build/index.html']
 * @param  {String} startPath    Path relative to this file or other file which requires this files
 * @param  {String} filter       Extension name, e.g: '.html'
 * @param {Boolean} recurse      True to enable recursiviness
 * @return {Array}               Result files with path string in an array
 */
function findFilesInDir(startPath, filter, recurse) {
    let results = [];

    if (!fs.existsSync(startPath)) {
        console.error("no dir ", startPath);
        return;
    }

    let files = fs.readdirSync(startPath);
    for (let file of files) {
        let filename = path.join(startPath, file);
        let stat = fs.lstatSync(filename);

        if (stat.isDirectory() && recurse) {
            results = results.concat(findFilesInDir(filename, filter, recurse)); //recurse
        }

        else if (filename.indexOf(filter) >= 0) {
            console.log('-- found: ', filename);
            results.push(filename);
        }
    }
    return results;
}

module.exports = findFilesInDir;