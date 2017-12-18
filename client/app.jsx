import React, {Component} from 'react'
import Header from '../client/components/Header'
import Projects from '../client/components/Projects'

// import CreateNewProject from '../client/components/CreateNewProject'
 /* <Projects/>
                <CreateNewProject/> */
export default class App extends Component {
    render() {
        return (
            <div>
                <Header/>
                <Projects/>
            </div>
        )
    }
}