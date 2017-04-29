import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as Actions from '../actions'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem'
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Moment from 'moment';
import Dialog from 'material-ui/Dialog';


const NewEventFormStyle={
  padding: 40,
  fontSize: 20,
  marginBottom: 15,
}

const styles = {
  block: {
    maxWidth: 250,
  },
  radioButton: {
    marginBottom: 16,
  },
};

const style = {
  marginRight: 15,
};



class UserBookForm extends Component {
  state = {
    cert: 1,
    open: false,
  };


  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };


  submitBook() {
  const eventId = this.props.event.id;
    const {name, email, rent, cert} = this.state;
    const data = {name, email, rent, cert}
    this.props.onCreate(name, email, rent, cert, eventId)
  }


  render() {
    const actions = [
          <RaisedButton
            label="Cancel"
            secondary={true}
            onTouchTap={this.handleClose}
          />,
          <RaisedButton
            label="Submit"
            primary={true}
            onTouchTap={() => {this.submitBook(); this.handleClose()}}
            containerElement={<Link to="/events" />}
          />,
        ];

    return (
      <div style={{width: 500, margin: '0 auto'}}>
        <div style={{flex:0.5, marginTop: 20}}>
          <Card style={NewEventFormStyle}>
            <CardHeader
              title={this.props.event.title}
              subtitle={
                'Date: ' + Moment(this.props.event.date).format('DD MMM YYYY') +
                ' at ' + Moment(this.props.event.time).format('hh:mm a')
              }
              actAsExpander={true}
              showExpandableButton={true}
            />
            <CardText expandable={true}>
              {this.props.event.details}
            </CardText>
          </Card>

        <Card style={NewEventFormStyle}>
          <form onSubmit={(e) => {e.preventDefault(); this.submitBook()}}>
            <div>
              <TextField name="name"
                hintText="Name"
                floatingLabelText="Name"
                onChange={(event, name) => this.setState({name})}
              />
            </div>
            <div>
              <TextField name="email"
                hintText="Email"
                floatingLabelText="Email"
                onChange={(event, email) => this.setState({email})}
                />
            </div>
            <div>
              <SelectField
                floatingLabelText="Certification"
                value={this.state.cert}
                onChange={(event, index, cert) => this.setState({cert})}
                autoWidth={true}
              >
                <MenuItem value={'OWD'} primaryText="Open Water Diver" />
                <MenuItem value={'AOWD'} primaryText="Advanced Open Water" />
                <MenuItem value={'Rescue'} primaryText="Rescue Diver" />
                <MenuItem value={'Instructor'} primaryText="Instructor" />
              </SelectField>
            </div>
            <div style={style}>
              <div>
                <RadioButtonGroup
                  name="renting"
                  // defaultSelected="rentGear"
                  onChange={(event, rent) => this.setState({rent})}
                  >
                  <RadioButton
                    value="YES"
                    label="I need to rent diving equipment"
                    style={styles.radioButton}
                  />
                  <RadioButton
                    value="NO"
                    label="I have my own equipment"
                    style={styles.radioButton}
                  />
                </RadioButtonGroup>
              </div>
            </div>

            <div >
              <RaisedButton
                style={{marginRight: 20}}
                label="ok"
                primary={true}
                onTouchTap={this.handleOpen} />
                <Dialog
                  title="THANK YOU FOR DIVING WITH US"
                  actions={actions}
                  modal={true}
                  open={this.state.open}
                >
                  Please confirm your booking for {Moment(this.props.event.date).format('DD MMM YYYY') +
                  ' at ' + Moment(this.props.event.time).format('hh:mm a')}
                </Dialog>
              <RaisedButton
                type="submit"
                label="Cancel"
                style={style}
                primary
                containerElement={<Link to="/events" />}
                // onTouchTap={() => this.submitLogin()}
              />
            </div>
          </form>
        </Card>
      </div>
    </div>
    )
  }
}


UserBookForm.propTypes = {
  onCreate: React.PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  const event = state.events.find((event) => event.id === parseInt(ownProps.params.eventId, 10))

  return {
    event
  }
}

const mapDispatchToProps = (dispatch) => ({
  onCreate: (name, email, rent, cert, eventId) => dispatch(Actions.createBook(name, email, rent, cert, eventId)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserBookForm)
