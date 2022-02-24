import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import qs from "qs";
import { Button, Form, FormGroup, Label, FormText, Input } from "reactstrap";

class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmation: "",
      isLoading: "",
      files: "",
      Invoice: "",
      Amount: "",
      InvoiceDate: "",
      Retailer: "",
      Details: "",
      id: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  handleChange = (e) => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const params = {
      id: this.state.id,
      Invoice: this.state.Invoice,
      Amount: this.state.Amount,
      InvoiceDate: this.state.InvoiceDate,
      Retailer: this.state.Retailer,
      Details: this.state.Details,
    };
    axios
      .post(
        "https://7hzo4iaekk.execute-api.eu-west-2.amazonaws.com/Production/invoice",
        qs.stringify(params)
      )
      .then((resp) => {
        console.log(resp);
      });
    alert("Update Successful");
  };

  render() {
    return (
      <div className="row">
        <div className="col-6 offset-3">
          <Form onSubmit={this.onSubmit}>
            <br />
            <FormGroup>
              <Label>
                <h6>ID</h6>
              </Label>
              <Input
                placeholder="Please enter ID"
                type="text"
                name="id"
                id="id"
                required
                value={this.state.id}
                onChange={this.handleChange}
              />
            </FormGroup>

            <button type="submit" className="btn btn-success">
              Update
            </button>
          </Form>
        </div>
      </div>
    );
  }
}

export default EditModal;
