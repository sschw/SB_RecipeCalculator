import React from 'react';
import ReactDOM from 'react-dom';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

class Hops extends React.Component {
  render() {
    return <TableRow key={this.props.name}>
    <TableCell component="th" scope="row">{this.props.name}</TableCell>
    <TableCell align="right"><TextField label="${this.props.alpha}" /></TableCell>
    <TableCell align="right">{this.props.oil}</TableCell>
    </TableRow>;
  }
}

export default Hops