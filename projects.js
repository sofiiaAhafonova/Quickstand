const fs = require("fs-promise");

function  makeId(arr) {
    return  arr[arr.length - 1].id + 1;
}

function create(projectBuf) {
    return  getAll()
        .then(arr => {
            projectBuf.id = makeId(arr);
            arr.push(projectBuf);
            return (arr);
        }).then(arr => fs.writeFile("projects.json",
            JSON.stringify(arr, null, 4)));
}

function getAll() {
    return fs.readFile('projects.json')
        .then(x => JSON.parse(x));
}

function getById(proj_id) {
    return getAll()
        .then(arr => {
            let index = arr.findIndex(el => el.id == proj_id);
            if (index > -1) 
                return (arr[index]);
            else
                return Promise.reject(null);
        });
}

function update(proj_update) {
    return getAll()
    .then(arr => {
        let index = arr.findIndex(el => el.id == proj_update.id);
        if(index >  -1)
            arr.splice(index, 1, proj_update);
        else 
            return Promise.reject(null);
        return Promise.resolve(arr);
    })
    .then(arr => fs.writeFile("projects.json",
    JSON.stringify(arr, null, 4)));
}
 
function remove(proj_id) {
    return getAll()
    .then(arr => {
        let index = arr.findIndex(el => el.id == proj_id);
        if(index >  -1)
            arr.splice(index,1);
        else 
            return Promise.reject(null);
        return Promise.resolve(arr);
    })
    .then(arr => fs.writeFile("projects.json",
    JSON.stringify(arr, null, 4)));
}

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove
}