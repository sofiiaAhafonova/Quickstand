import React from 'react'

export default class Header extends React.Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a className="navbar-brand" href="/">Quickstand</a>
                    </div>
                    <div className="collapse navbar-collapse" id="myNavbar">
                    <ul className="nav navbar-nav">
                        <li className="active">
                        <a href="/">Home</a>
                        </li>
                        <li>
                        <a href="/projects">Projects</a>
                        </li>
                        <li>
                            <a href="/projects/personal">Personal Projects</a>
                        </li>
                        <li>
                            <a href="/project_form">Create Project</a>
                        </li>
                    </ul>
                    <ul className="nav navbar-nav navbar-right">
                <li>
                <form className="navbar-form navbar-right" action="/search">
                    <div className="input-group">
                        <input type="text" name="name" className="form-control" placeholder="Search"/>
                        <div className="input-group-btn">
                            <button className="btn btn-default" type="submit">
                            <i className="glyphicon glyphicon-search"></i>
                            </button>
                        </div>
                    </div>
                </form>
                </li>
                <li>
                    <a href="/profile">
                    <span className="  glyphicon glyphicon-user"> </span> </a>
                </li>
                <li><a href="/register/logout">
                    <span className="glyphicon glyphicon-log-out"></span> Log out</a>
                </li>
                     </ul>
                    </div>
                </div>
                </nav>             
            </div>
        );
    }
}
