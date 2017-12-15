import React from 'react'
import Search from 'react-search'
import {getProjects, deleteProject} from '../../client/APIWrapper'

export default class Projects extends React.Component {
    constructor (props){
        super(props);
        this.state = {
            projects: null,
            pages: null,
            searchValue: undefined
        };
        this.onClickDeleteProject = this.onClickDeleteProject.bind(this);
        this.createArray = this.createArray.bind(this);
        this.updateProject = this.updateProject.bind(this);
        this.updateSearchValue = this.updateSearchValue.bind(this);
    };

    onClickDeleteProject(id) {
        const {searchValue} = this.state;
        deleteProject(id);
        console.log("deleting project by id: ", id);
        this.updateProject(undefined, searchValue);
    };

    componentDidMount(){
        getProjects().then(projects => {
            this.setState({pages: projects["totalPages"], projects:projects["projects"]});
           
        });

    };

    updateProject(page, search) {
        getProjects(page, search).then(projects => {
            this.setState({pages: projects["totalPages"], projects:projects["projects"]});
        });
    }

    updateSearchValue(search) {
        this.updateProject(undefined, search);
        this.setState({searchValue: search});
    }

    createArray(lenght) {
        let array = [];
        for(let i = 1; i <= lenght; i++) {
            array.push(i);
        }
        return array;
    }


    render() {
        const {projects} = this.state;
        const {pages} = this.state;
        const {searchValue} = this.state;

        return (
           <div>
               <div className="main projects">
                   <h1>Search page</h1>
                   <div id="search">
                     <div className="input-group">
                    <input type="text"  onInput={(e) =>{this.updateSearchValue(e.target.value)}} id="search-input" placeholder="Search" class="form-control" name="name" pattern="^[a-zA-Z\s]*$" maxLength="32"/>
                    <div className="input-group-btn">
                        <button onClick={() => this.updateProject(undefined, searchValue)} id="search_button" class="btn btn-default" type="submit">
                            <i className="glyphicon glyphicon-search"></i>
                        </button>
                        <br/>
                    </div>
                    </div>
                       {projects ? projects.map(project => (
                               <div >
                                   <img src= {project.image}
                                        alt = "project"/>
                                   <a href= {"/projects/" + project._id} > {project.name}</a> <br/>
                                   <button onClick={() => this.onClickDeleteProject( project._id)}>Remove</button>
                               </div>
                       )) : <h1>No found!</h1> }

               <div>
                   <nav >
                       <ul className="pagination">
                           {this.createArray(pages).map(index => (
                               <li className="page-item"> <button className="page-link" onClick={() => this.updateProject(index, searchValue)}> {index} </button></li>
                           ))}
                       </ul>
                   </nav>
               </div>
           </div>
        </div>
        </div>
        );
    }
}