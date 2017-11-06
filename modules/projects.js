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
function getByName(proj_name){
    return  getAll()
    .then(arr => {
        let new_arr;
        for (let s of proj_arr)
        {
            if (s.name.indexOf(name) >= 0)
                new_arr.push(s);
        }
        if (new_arr.length > 0)
            return (new_arr);
        else
            return Promise.reject(null);
    });
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

let project = {
    properties: {
        name: {
            description: "Enter a project name",
			type: "string",
            pattern: /\w+/g,
            message: "Name must be only letters",
            required: true
        },
        description: {
            description: "Enter your project description",
            type: "string",
            required: true
        },
        status: {
            description: "Enter your project status",
            type: "string",
            required: true
		},
		team: {
			description: "Enter your team name",
			type: "string",
            pattern: /\w+/g,
            required: true
		},
		man_hour: {
			description: "Enter man-hour value",
			pattern: /^[0-9]+$/,
            type: "string",
            required: true
		},	
        rating: {
            description: "Enter project rating",
            pattern: /^[1-5][.][0-9]$/,
            message: "Rating must be from 1.0 to 5.0",
            required: true
        },
        start_date: {
            description: "Enter your project start date",
            pattern: /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/,
            message: "Date must be only YYYY-MM-DD",
            required: true
		},
		finish_date: {
            description: "Enter your project finish date",
            pattern: /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/,
            message: "Date must be only YYYY-MM-DD",
            required: true
        },
        image: {
            description: "image",
            required: false
        }
		
		
    }
};
module.exports = {
    create,
    getAll,
    getById,
    update,
    remove,
    project,
    makeId
}