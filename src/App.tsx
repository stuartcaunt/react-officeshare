import React, {Component} from 'react';
import './App.scss';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {


    public componentDidMount() {

        const icon = <span><i aria-hidden="true" className="fas fa-door-open"/> Stuart caunt has entered the room</span>


        toast.success(icon, {
            autoClose: 2000,
            hideProgressBar: true,


        });

        toast.success("Stuart Caunt is now broadcasting his screen", {
            progress: 0,
        });


        toast.error("Stuart Caunt has exited the room", {
            progress: 0,
        });
    }

    render() {
        return (
            <div className="container">
                <ToastContainer/>

                <div className="header">

                    <div className="left">
                        <i className="fas fa-users"/><span>10 participants</span>
                    </div>
                    <div className="center">My room</div>
                    <div className="right">
                        <i className="far fa-comments"/>
                    </div>
                </div>
                <div className="content">
                    <div className="participants">
                        <div className="participants__header">Participants</div>
                        <div className="participants__list">
                            <div className="participants">
                                <div className="participant">
                                    <img
                                        src="https://4.bp.blogspot.com/-8P1FMWl3kHo/WuC-GbctJcI/AAAAAAAAASc/X5mB7KR8y8oMxmpNNmy9QqNnwlc07Fw9QCLcBGAs/s640/ubuntu1804_screenshots.png"/>
                                    <div className="participant__user">
                                        <span className="participant__user__content">
                                            <span className="participant__user__username">Jamie Hall</span>
                                            <span
                                                className="participant__user__status participant__user__status--online">
                                                <i className="fa fa-circle"/>
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div className="participant">
                                    <img
                                        src="https://cdn.arstechnica.net/wp-content/uploads/2011/07/lion_gallery_intro-4e24a11-intro.png"/>
                                    <div className="participant__user">
                                        <span className="participant__user__content">
                                            <span className="participant__user__username">Stuart Caunt</span>
                                            <span
                                                className="participant__user__status participant__user__status--offline">
                                                <i className="fa fa-circle"/>
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div className="participant">
                                    <img
                                        src="https://www.extremetech.com/wp-content/uploads/2015/10/Windows-10-desktop-640x353.jpg"/>
                                    <div className="participant__user">
                                        <span className="participant__user__content">
                                            <span className="participant__user__username">Joe Bloggs</span>
                                            <span
                                                className="participant__user__status participant__user__status--offline">
                                                <i className="fa fa-circle"/>
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="viewer">
                        <div className="screen">

                            <div className="debug-toolbar">
                                <div className="action-bar">
                                    <ul className="actions-container" role="toolbar">
                                        <li className="action-item" role="presentation">
                                            <a className="action-label icon debug-action screenshot" role="button"/>
                                        </li>
                                        <li className="action-item" role="presentation">
                                            <a className="action-label icon debug-action microphone" role="button"/>
                                        </li>
                                        <li className="action-item" role="presentation">
                                            <a className="action-label icon debug-action clipboard" role="button"/>
                                        </li>
                                        <li className="action-item" role="presentation">
                                            <a className="action-label icon debug-action settings" role="button"/>
                                        </li>
                                        <li className="action-item" role="presentation">
                                            <a className="action-label icon debug-action exit-full-screen"
                                               role="button"/>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <img
                                src="https://www.ghacks.net/wp-content/uploads/2018/03/Elementary-Applications-Menu.jpeg"/>
                        </div>
                        <div className="toolbar">
                            <div className="action-bar">
                                <ul className="actions-container" role="toolbar">
                                    <li className="action-item" role="presentation">
                                        <a className="action-label icon debug-action screenshot" role="button"/>
                                    </li>
                                    <li className="action-item" role="presentation">
                                        <a className="action-label icon debug-action microphone" role="button"/>
                                    </li>
                                    <li className="action-item" role="presentation">
                                        <a className="action-label icon debug-action clipboard" role="button"/>
                                    </li>
                                    <li className="action-item" role="presentation">
                                        <a className="action-label icon debug-action settings" role="button"/>
                                    </li>
                                    <li className="action-item" role="presentation">
                                        <a className="action-label icon debug-action exit-full-screen"
    role="button"/>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                    <div className="chat">
                        <div className="chat__header">Chat</div>


                        <div className="chat-messages">
                            <div className="message">
                                <div className="author">
                                    <span className="name">Jamie Hall</span>
                                    <span className="time">10:12 AM, Today</span>
                                </div>
                                <div className="content">
                                    <p>Content goes here. This can include links and other content.</p>
                                </div>
                            </div>
                            <div className="message">
                                <div className="author">
                                    <span className="name">Jamie Hall</span>
                                    <span className="time">10:12 AM, Today</span>
                                </div>
                                <div className="content">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc faucibus, tortor
                                        scelerisque aliquam sollicitudin, tellus odio tincidunt mi, in convallis lacus
                                        augue eget nisl. Quisque pretium, tortor eget tempus fringilla.
                                    </p>
                                </div>
                            </div>

                            <div className="message">
                                <div className="author">
                                    <span className="name">Joe Bloggs</span>
                                    <span className="time">10:12 AM, Today</span>
                                </div>
                                <div className="content">
                                    <p>Content goes here. This can include links and other content.</p>
                                </div>
                            </div>

                            <div className="message">
                                <div className="author">
                                    <span className="name">Jane Doe Hall</span>
                                    <span className="time">10:12 AM, Today</span>
                                </div>
                                <div className="content">
                                    <p>Content goes here. This can include links and other content.</p>
                                </div>
                            </div>
                        </div>
                        <div className="send-message">
                            <span>Send message...</span>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}


export default App;
