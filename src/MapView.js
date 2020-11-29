import React, {Component} from 'react';
import GoogleMapReact from 'google-map-react';
import {PushpinTwoTone, HeartTwoTone} from '@ant-design/icons';
import axios from 'axios';
import {Card} from 'antd';



const UserMarker = ({text}) => <div><PushpinTwoTone style={{fontSize: '30px', color: '#ff0000'}}/><Card
    style={{width: 50, color: 'blue', border: 'solid'}}><p style={{color: 'red'}}>{text}</p></Card></div>;
const UserNote = ({text}) => <div><HeartTwoTone twoToneColor="#eb2f96"/><Card
    style={{width: 50, color: 'blue', border: 'solid'}}><p style={{color: 'red'}}>{text}</p></Card></div>;
const AddNote = ({text}) => <div><HeartTwoTone twoToneColor="#eb2f96" style={{fontSize: '30px', color: '#2721ff'}}/><p
    style={{color: 'black'}}>{text}</p></div>;

class SimpleMap extends Component {
    state = {
        userLat: -37.84,
        userLong: 144.946457,
        latClicked: '',
        logClicked: '',
        noteArea: false,
        Note: 'Add text here'


    };
    static defaultProps = {
        center: {
            lat: -37.84,
            lng: 144.94
        },
        zoom: 15,

    };


    api = async (notes) => {
        const data = await axios.get("https://api.sebin.ai/notes/all");
        this.setState({allNotes: data});
    }
    onMapClicked = (event) => {
        this.setState({
            noteArea: true,
            latClicked: event.lat,
            logClicked: event.lng
        })
        console.log(this.state)
    };
    handleNote = (event) => {
        // update state values
        this.setState({
            Note: event.target.value,
        });

    };

    submitNote = (event) => {
        event.preventDefault();
        console.log(this.state)

        // send credentials to back-end to check account
        axios.get(`https://api.sebin.ai/userid/${this.props.user}`).then((res) => {
            if (res.data) {
                console.log(res.data)
                //  let values = [req.body.user_id, req.body.note_lat, req.body.note_long, req.body.note_text];
                const details = {
                    user_id: res.data.id.user_id,
                    note_lat: this.state.latClicked,
                    note_long: this.state.logClicked,
                    note_text: this.state.Note
                }
                console.log(details)
                axios.post("https://api.sebin.ai/notes/new", details).then((res) => {
                    if (res.data.status == 'success') {
                        this.api()

                    } else {
                        // show error
                        this.setState({
                            error: res.data.msg
                        })
                    }
                });


            } else {
                // show error
                this.setState({
                    //error: res.data.msg
                })
            }
        });
    };


    componentDidMount(props) {
        this.api();
        console.log(this.props)
        window.navigator.geolocation.getCurrentPosition((pos) => {
            console.log('\n Position is  : ', pos);
            this.setState({
                userLat: pos.coords.latitude,
                userLong: pos.coords.longitude,
                latClicked: pos.coords.latitude,
                logClicked: pos.coords.longitude,
                mapCenter: {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                }
            });
        });
    }

    render() {


        let apiKey = 'paste google api key';
        let markers = this.state.allNotes && this.state.allNotes.data.notes.map((note) => {
            return (<UserNote lat={note.note_lat}
                              lng={note.note_long}
                              text={note.note_text}/>)
        });


        return (

            // Important! Always set the container height explicitly
            <div style={{height: '100vh', width: '100%'}}>

                {this.state.noteArea ? <form>
                    <label>
                        Add Note:
                        <textarea type="text" name="name" value={this.state.username}
                                  onChange={this.handleNote}/>
                    </label>
                    <input type="submit" value="Submit" onClick={this.submitNote}/>
                </form> : null}

                <GoogleMapReact
                    bootstrapURLKeys={{key: apiKey}}
                    defaultCenter={this.props.center}
                    center={this.state.mapCenter}
                    defaultZoom={this.props.zoom}
                    onClick={this.onMapClicked}
                    yesIWantToUseGoogleMapApiInternals


                >
                    {markers}
                    <UserMarker
                        lat={this.state.userLat}
                        lng={this.state.userLong}
                        text={`${this.props.user} You are Here`}

                    />

                    {this.state.noteArea ? <AddNote
                        lat={this.state.latClicked}
                        lng={this.state.logClicked}
                        text={`${this.props.user} ${this.state.Note}`}

                    /> : null}


                </GoogleMapReact>


            </div>
        );
    }
}


export default SimpleMap;
