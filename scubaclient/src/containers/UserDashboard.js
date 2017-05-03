import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions'
import UserEvent from '../components/UserEvent'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

const containerStyle = {
  margin: 'auto',
  width: 1000,
  padding: 20,
  display: 'flex',
  flexDirection: 'column'
}

const styleEvents = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start'
}

class UserDashboard extends React.Component {

  componentDidMount () {
    this.props.getEvents()
  }
  state = {
    value: 1
  }

  arrangeEvent(events) {
    return events.sort((a, b) => {
      if (this.state.value === 1) {
        return new Date(b.date) > new Date(a.date)
      } else if (this.state.value === 2) {
        return b.title < a.title
      }
    })
  }

  renderEvents () {
      return this.arrangeEvent(this.props.events).map(event =>
        <UserEvent
          className="event"
          style={{ width: 300, marginRight:20, marginBottom: 20 }}
          key={event.id}
          event={event}
          onBook={(id) => this.props.bookEvent(id)}
        />
      )
    }

    handleOrderChange = (event, index, value) => {
      this.setState({value})
    }

  render() {
    return <div style={containerStyle}>
      <SelectField
        floatingLabelText='Order by:'
        value={this.state.value}
        onChange={this.handleOrderChange}>
        <MenuItem value={1} primaryText="Time" />
        <MenuItem value={2} primaryText="Name" />
      </SelectField>
      <div style={{margin: 'auto', padding: 20}}>
        <div style={styleEvents}>
          {this.renderEvents()}
        </div>
      </div>
    </div>
  }
}

const mapStateToProps = (state) => ({
  events: state.events
})

const mapDispatchToProps = (dispatch) => ({
  getEvents: () => dispatch(Actions.getEvents()),
  bookEvent: (id) => dispatch(Actions.bookEvent(id))

})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDashboard)
